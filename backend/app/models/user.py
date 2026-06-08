import enum
from sqlalchemy import Column, Integer, String, Enum
from app.core.database import Base


class UserRole(enum.Enum):
    CREATOR = "CREATOR"
    MANAGER = "MANAGER"
    IT_REPRESENTATIVE = "IT_REPRESENTATIVE"
    FINANCE = "FINANCE"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
