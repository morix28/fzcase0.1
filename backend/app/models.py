from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True, nullable=False)
    username = Column(String)
    first_name = Column(String)
    balance_stars = Column(Integer, default=0)
    referral_code = Column(String, unique=True)
    referrer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price_stars = Column(Integer)
    drop_rate_real = Column(Float, default=10.0)  # %
    image_url = Column(String)
    total_openings = Column(Integer, default=0)
    total_real_drops = Column(Integer, default=0)

class Key(Base):
    __tablename__ = "keys"
    id = Column(Integer, primary_key=True)
    key_value = Column(String, unique=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    is_used = Column(Boolean, default=False)
    used_by_user_id = Column(Integer, ForeignKey("users.id"))
    added_by_admin_id = Column(Integer, ForeignKey("users.id"))

class Opening(Base):
    __tablename__ = "openings"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    case_id = Column(Integer, ForeignKey("cases.id"))
    key_id = Column(Integer, ForeignKey("keys.id"), nullable=True)
    generated_key = Column(String, nullable=True)
    stars_spent = Column(Integer)
    opened_at = Column(DateTime, default=datetime.utcnow)