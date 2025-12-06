from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime
from uuid import uuid4
import jwt
import os

from app.db import get_db  # <-- your DB session function

router = APIRouter()
Base = declarative_base()


# ------------------------------
# JWT AUTH (matches getUserId())
# ------------------------------

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        return None

    token = authorization.replace("Bearer ", "")
    if not token:
        return None

    secret = os.getenv("JWT_SECRET_KEY", "my-secret")

    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload.get("userId")
    except Exception:
        return None


# ------------------------------
# SQLALCHEMY MODEL
# ------------------------------

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    message = Column(String, nullable=True)
    at_time = Column(DateTime, nullable=False)
    enabled = Column(Boolean, default=True)
    channel = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


# ------------------------------
# PYDANTIC MODELS
# ------------------------------

class ReminderCreate(BaseModel):
    type: str
    message: Optional[str] = None
    atTime: datetime
    enabled: Optional[bool] = True
    channel: Optional[str] = None


class ReminderOut(BaseModel):
    id: str
    user_id: str
    type: str
    message: Optional[str]
    at_time: datetime
    enabled: bool
    channel: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


# ------------------------------
# POST /reminders
# ------------------------------

@router.post("/", response_model=ReminderOut)
def create_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    reminder = Reminder(
        user_id=user_id,
        type=payload.type,
        message=payload.message,
        at_time=payload.atTime,
        enabled=payload.enabled,
        channel=payload.channel,
    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


# ------------------------------
# GET /reminders
# ------------------------------

@router.get("/", response_model=list[ReminderOut])
def list_reminders(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    reminders = (
        db.query(Reminder)
        .filter(Reminder.user_id == user_id)
        .order_by(Reminder.at_time.desc())
        .all()
    )

    return reminders


# ------------------------------
# PATCH /reminders/{id}/toggle
# ------------------------------

@router.patch("/{id}/toggle", response_model=ReminderOut)
def toggle_reminder(
    id: str,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    reminder = (
        db.query(Reminder)
        .filter(Reminder.id == id, Reminder.user_id == user_id)
        .first()
    )

    if not reminder:
        raise HTTPException(status_code=404, detail="Not found")

    reminder.enabled = not reminder.enabled
    db.commit()
    db.refresh(reminder)

    return reminder
