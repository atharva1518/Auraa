from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core import firebase  # Initializes Firebase Admin SDK
from app.gateway.routes import router as gateway_router
from app.core.exceptions import (
    AuthException, 
    auth_exception_handler, 
    generic_exception_handler,
    validation_exception_handler,
    http_exception_handler
)

app = FastAPI(title="Aura API", version="0.1.0")

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(AuthException, auth_exception_handler)
from app.core.exceptions import DatabaseException, database_exception_handler
app.add_exception_handler(DatabaseException, database_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register the global gateway router
app.include_router(gateway_router)
