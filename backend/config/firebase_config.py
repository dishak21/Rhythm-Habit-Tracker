import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin.firestore import DocumentReference, DocumentSnapshot

import os

from dotenv import load_dotenv
load_dotenv()

# Initialize Firebase app if it hasn't been initialized
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# Firestore client instance
db = firestore.client()
