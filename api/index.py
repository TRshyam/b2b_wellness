import os
import sys

# Ensure backend package is in python search path for Vercel Serverless Function
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app

# Export app instance for Vercel WSGI/ASGI handler
__all__ = ["app"]
