from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderResponse
from app.services import po_service

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])


class RejectRequest(BaseModel):
    comment: str


@router.post("", response_model=PurchaseOrderResponse, status_code=201)
def create_po(data: PurchaseOrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.create_po(db, data, current_user)


@router.get("", response_model=list[PurchaseOrderResponse])
def list_pos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.get_all_pos(db)


@router.get("/{po_id}", response_model=PurchaseOrderResponse)
def get_po(po_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.get_po_by_id(db, po_id)


@router.post("/{po_id}/approve", response_model=PurchaseOrderResponse)
def approve_po(po_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.approve_po(db, po_id, current_user)


@router.post("/{po_id}/reject", response_model=PurchaseOrderResponse)
def reject_po(po_id: int, data: RejectRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.reject_po(db, po_id, data.comment, current_user)


@router.post("/{po_id}/resubmit", response_model=PurchaseOrderResponse)
def resubmit_po(po_id: int, data: PurchaseOrderUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return po_service.resubmit_po(db, po_id, data, current_user)
