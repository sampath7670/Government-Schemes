import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import db_manager
from app.api.schemes import router as schemes_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup DB connection & index setup
    await db_manager.connect()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title="AI-Powered Government & Public Service Assistant",
    description="Class 10 Student Government Schemes Module",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schemes_router)

@app.get("/")
async def root():
    return {
        "title": "AI-Powered Government & Public Service Assistant",
        "module": "Class 10 Student Government Schemes",
        "status": "Online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
