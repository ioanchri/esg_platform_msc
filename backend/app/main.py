import logging
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .database import engine
from . import models, routers
from .routers import esg_router
from fastapi.middleware.cors import CORSMiddleware
from .auth import router as auth_router
from dotenv import load_dotenv

models.Base.metadata.create_all(bind=engine)
load_dotenv()
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
models.Base.metadata.create_all(bind=engine)


origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:4300").split(",")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(esg_router.router)
app.include_router(auth_router, prefix="/auth")
