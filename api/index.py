# Vercel Serverless Function Entry Point for Modi Medical API
# Adapts FastAPI for Vercel serverless deployment

import sys
import os

# Add the parent directory to Python path for imports
sys.path.insert(0, os.path.dirname(__file__))

from main import app
from mangum import Mangum

# Create ASGI wrapper for Vercel
handler = Mangum(app)

# Vercel requires this export
__all__ = ["handler"]