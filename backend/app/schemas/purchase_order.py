from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from app.models.purchase_order import POCategory, POStatus
from app.schemas.user import UserResponse


class PurchaseOrderCreate(BaseModel):
    title: str
    amount: Decimal
    category: POCategory


class PurchaseOrderUpdate(BaseModel):
    title: str
    amount: Decimal
    category: POCategory


class PurchaseOrderResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    category: POCategory
    status: POStatus
    rejection_comment: Optional[str]
    creator: UserResponse

    model_config = {"from_attributes": True}
