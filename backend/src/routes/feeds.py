from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Session, declarative_base
from datetime import datetime
from uuid import uuid4
from app.db import get_db  # <-- your DB session provider

Base = declarative_base()
router = APIRouter()


# ------------------------------
# SQLALCHEMY MODEL
# ------------------------------

class Feed(Base):
    __tablename__ = "feeds"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    infant_id = Column(String, ForeignKey("infants.id"), nullable=False)
    type = Column(Enum("Milk", "Formula", "Solid", "Water", name="feed_type"), nullable=False)
    amount_ml = Column(Integer)
    notes = Column(String(500))
    started_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())


# ------------------------------
# PYDANTIC SCHEMAS
# ------------------------------

class FeedCreate(BaseModel):
    infantId: str = Field(..., min_length=1)
    type: str = Field(..., regex="^(Milk|Formula|Solid|Water)$")
    amountMl: Optional[int] = Field(None, ge=1, le=2000)
    notes: Optional[str] = Field(None, max_length=500)
    startedAt: Optional[datetime] = None


class FeedUpdate(BaseModel):
    infantId: Optional[str] = None
    type: Optional[str] = Field(None, regex="^(Milk|Formula|Solid|Water)$")
    amountMl: Optional[int] = Field(None, ge=1, le=2000)
    notes: Optional[str] = Field(None, max_length=500)
    startedAt: Optional[datetime] = None


class FeedOut(BaseModel):
    id: str
    infant_id: str
    type: str
    amount_ml: Optional[int]
    notes: Optional[str]
    started_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True


# ------------------------------
# POST /feeds
# ------------------------------

@router.post("/", response_model=FeedOut, status_code=201)
def create_feed(payload: FeedCreate, db: Session = Depends(get_db)):
    feed = Feed(
        infant_id=payload.infantId,
        type=payload.type,
        amount_ml=payload.amountMl,
        notes=payload.notes,
        started_at=payload.startedAt,
    )
    db.add(feed)
    db.commit()
    db.refresh(feed)
    return feed


# ------------------------------
# GET /feeds
# ------------------------------

@router.get("/", response_model=dict)
def list_feeds(
    infantId: Optional[str] = None,
    dateFrom: Optional[datetime] = None,
    dateTo: Optional[datetime] = None,
    type: Optional[str] = Query(None, regex="^(Milk|Formula|Solid|Water)$"),
    limit: int = Query(25, ge=1, le=100),
    cursor: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Feed)

    if infantId:
        query = query.filter(Feed.infant_id == infantId)

    if type:
        query = query.filter(Feed.type == type)

    if dateFrom:
        query = query.filter(Feed.started_at >= dateFrom)

    if dateTo:
        query = query.filter(Feed.started_at <= dateTo)

    if cursor:
        query = query.filter(Feed.id > cursor)

    query = query.order_by(Feed.started_at.desc()).limit(limit)
    results = query.all()

    next_cursor = results[-1].id if len(results) == limit else None

    return {"items": results, "nextCursor": next_cursor}


# ------------------------------
# GET /feeds/{id}
# ------------------------------

@router.get("/{id}", response_model=FeedOut)
def get_feed(id: str, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(Feed.id == id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Not found")
    return feed


# ------------------------------
# PATCH /feeds/{id}
# ------------------------------

@router.patch("/{id}", response_model=FeedOut)
def update_feed(id: str, payload: FeedUpdate, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(Feed.id == id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Not found")

    data = payload.dict(exclude_unset=True)

    if "infantId" in data:
        feed.infant_id = data["infantId"]
    if "type" in data:
        feed.type = data["type"]
    if "amountMl" in data:
        feed.amount_ml = data["amountMl"]
    if "notes" in data:
        feed.notes = data["notes"]
    if "startedAt" in data:
        feed.started_at = data["startedAt"]

    db.commit()
    db.refresh(feed)
    return feed


# ------------------------------
# DELETE /feeds/{id}
# ------------------------------

@router.delete("/{id}", status_code=204)
def delete_feed(id: str, db: Session = Depends(get_db)):
    feed = db.query(Feed).filter(Feed.id == id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(feed)
    db.commit()
    return None
