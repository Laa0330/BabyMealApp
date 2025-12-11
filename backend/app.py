from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.feeds import router as feeds_router
from routes.reminders import router as reminders_router
from routes.auth import router as auth_router

app = FastAPI(
    title="Baby Meal API",
    description="Backend API for Baby Meal Tracking App",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"ok": True, "service": "feeding"}

# sign up routes
app.include_router(feeds_router, prefix="/api/feeds", tags=["Feeds"])
app.include_router(reminders_router, prefix="/api/reminders", tags=["Reminders"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

# run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=4000, reload=True)
