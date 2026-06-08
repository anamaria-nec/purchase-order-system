import enum
from sqlalchemy import Column, Integer, String, Numeric, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class POCategory(enum.Enum):
    SERVICES = "SERVICES"
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES"
    IT_EQUIPMENT = "IT_EQUIPMENT"


class POStatus(enum.Enum):
    SUBMITTED = "SUBMITTED"
    PENDING_MANAGER = "PENDING_MANAGER"
    PENDING_IT = "PENDING_IT"
    PENDING_FINANCE = "PENDING_FINANCE"
    NEEDS_REWORK = "NEEDS_REWORK"
    INVOICED = "INVOICED"


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)
    category = Column(Enum(POCategory), nullable=False)
    status = Column(Enum(POStatus), nullable=False, default=POStatus.SUBMITTED)
    rejection_comment = Column(String, nullable=True)

    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", foreign_keys=[creator_id])

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
