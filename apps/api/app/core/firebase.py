import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

def initialize_firebase():
    if not firebase_admin._apps:
        try:
            if settings.firebase_credentials_path:
                cred = credentials.Certificate(settings.firebase_credentials_path)
                firebase_admin.initialize_app(cred)
            elif settings.firebase_project_id:
                firebase_admin.initialize_app(options={'projectId': settings.firebase_project_id})
            else:
                firebase_admin.initialize_app()
        except Exception:
            # Allow the backend to boot gracefully even if Firebase is unconfigured
            pass

initialize_firebase()
