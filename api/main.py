# FastAPI Backend Service for Modi Medical (App #1)
# Implements Open Architecture Backend API Integration

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import sqlite3
from datetime import datetime

app = FastAPI(
    title="Modi Medical API",
    description="Backend API service for Modi Medical Wholesale Distributor Web Application",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "public")  # Changed to public for Vercel
ASSETS_DIR = os.path.join(FRONTEND_DIR, "assets")

# Database configuration for serverless
# Use /tmp directory for SQLite in serverless environment
DB_PATH = os.environ.get("DB_PATH", os.path.join("/tmp", "modi_medical.db"))

# Database initialization
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            shop_name TEXT,
            created_at TEXT,
            last_login TEXT,
            status TEXT DEFAULT 'active',
            force_password_change INTEGER DEFAULT 0
        )
    ''')
    
    # Default initial Admin user
    cursor.execute("SELECT id FROM users WHERE username = 'admin'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, username, password, role, name, email, phone, shop_name, created_at, status, force_password_change)
            VALUES ('user_001', 'admin', 'password', 'admin', 'Administrator', 'admin@modimedical.com', '8709484805', '', ?, 'active', 0)
        ''', (datetime.now().isoformat(),))
    
    # Medicines table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            manufacturer TEXT NOT NULL,
            category TEXT NOT NULL,
            mrp_price REAL NOT NULL,
            unit_price REAL NOT NULL,
            discounted_price REAL NOT NULL,
            lot_number TEXT,
            manufacturing_date TEXT,
            expiry_date TEXT,
            stock_status TEXT DEFAULT 'available',
            created_at TEXT,
            updated_at TEXT
        )
    ''')
    
    # Marketing Materials table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS marketing_materials (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            description TEXT,
            category TEXT,
            uploaded_at TEXT,
            is_featured INTEGER DEFAULT 0
        )
    ''')
    
    # Excel Files table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS excel_files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            uploaded_by TEXT,
            uploaded_at TEXT,
            last_updated TEXT,
            content_json TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Pydantic Schemas
class UserCreate(BaseModel):
    username: str
    password: str
    role: str
    name: str
    email: Optional[str] = ""
    phone: str
    shop_name: Optional[str] = ""
    force_password_change: Optional[bool] = False

class UserLogin(BaseModel):
    username: str
    password: str

class PasswordChange(BaseModel):
    username: str
    current_password: str
    new_password: str

class MedicineCreate(BaseModel):
    name: str
    manufacturer: str
    category: str
    mrp_price: float
    unit_price: float
    discounted_price: float
    lot_number: Optional[str] = ""
    manufacturing_date: Optional[str] = ""
    expiry_date: Optional[str] = ""
    stock_status: str

# API Routes
@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Modi Medical API", "version": "1.0.0"}

# Serve static files (for local development)
@app.get("/")
def serve_frontend():
    """Serve the frontend index.html"""
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"error": "Frontend not found"}, status_code=404)

# User Endpoints
@app.post("/api/auth/login")
def login(login_data: UserLogin):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ? AND status = 'active'", 
                   (login_data.username, login_data.password))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    user_dict = dict(user)
    del user_dict["password"]
    return {"status": "success", "user": user_dict}

@app.post("/api/auth/change-password")
def change_password(data: PasswordChange):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ? AND password = ?", (data.username, data.current_password))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    cursor.execute("UPDATE users SET password = ?, force_password_change = 0 WHERE username = ?", 
                   (data.new_password, data.username))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Password updated successfully"}

@app.get("/api/users")
def get_users():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, name, email, phone, shop_name, created_at, status FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return users

@app.post("/api/users")
def create_user(user: UserCreate):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    user_id = f"user_{int(datetime.now().timestamp() * 1000)}"
    try:
        cursor.execute('''
            INSERT INTO users (id, username, password, role, name, email, phone, shop_name, created_at, status, force_password_change)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
        ''', (user_id, user.username, user.password, user.role, user.name, user.email, user.phone, user.shop_name, datetime.now().isoformat(), 1 if user.force_password_change else 0))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    conn.close()
    return {"id": user_id, "username": user.username, "status": "created"}

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

# Medicine Endpoints
@app.get("/api/medicines")
def get_medicines():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medicines")
    medicines = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return medicines

@app.post("/api/medicines")
def create_medicine(med: MedicineCreate):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    med_id = f"med_{int(datetime.now().timestamp() * 1000)}"
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO medicines (id, name, manufacturer, category, mrp_price, unit_price, discounted_price, lot_number, manufacturing_date, expiry_date, stock_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (med_id, med.name, med.manufacturer, med.category, med.mrp_price, med.unit_price, med.discounted_price, med.lot_number, med.manufacturing_date, med.expiry_date, med.stock_status, now, now))
    conn.commit()
    conn.close()
    return {"id": med_id, "name": med.name, "status": "created"}

@app.delete("/api/medicines/{med_id}")
def delete_medicine(med_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM medicines WHERE id = ?", (med_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

# Serve Frontend static files
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
