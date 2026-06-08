from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.purchase_order import PurchaseOrder, POStatus, POCategory
from app.models.user import User, UserRole
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate


def _get_initial_status(amount: Decimal, category: POCategory) -> POStatus:
    if amount < 100:
        if category == POCategory.IT_EQUIPMENT:
            return POStatus.PENDING_IT
        return POStatus.PENDING_FINANCE
    return POStatus.PENDING_MANAGER


def _get_next_status(po: PurchaseOrder) -> POStatus:
    if po.status == POStatus.PENDING_MANAGER:
        if po.category == POCategory.IT_EQUIPMENT:
            return POStatus.PENDING_IT
        return POStatus.PENDING_FINANCE
    if po.status == POStatus.PENDING_IT:
        return POStatus.PENDING_FINANCE
    if po.status == POStatus.PENDING_FINANCE:
        return POStatus.INVOICED
    raise HTTPException(status_code=400, detail="PO cannot be approved at its current status")


def _required_role_for_status(status: POStatus) -> UserRole:
    if status == POStatus.PENDING_MANAGER:
        return UserRole.MANAGER
    if status == POStatus.PENDING_IT:
        return UserRole.IT_REPRESENTATIVE
    if status == POStatus.PENDING_FINANCE:
        return UserRole.FINANCE
    raise HTTPException(status_code=400, detail="PO is not awaiting any approval")


def create_po(db: Session, data: PurchaseOrderCreate, current_user: User) -> PurchaseOrder:
    if current_user.role != UserRole.CREATOR:
        raise HTTPException(status_code=403, detail="Only a Creator can submit a purchase order")
    po = PurchaseOrder(
        title=data.title,
        amount=data.amount,
        category=data.category,
        status=_get_initial_status(data.amount, data.category),
        creator_id=current_user.id,
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    return po


def approve_po(db: Session, po_id: int, current_user: User) -> PurchaseOrder:
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    required = _required_role_for_status(po.status)
    if current_user.role != required:
        raise HTTPException(status_code=403, detail=f"Only a {required.value} can approve at this stage")
    po.status = _get_next_status(po)
    po.rejection_comment = None
    db.commit()
    db.refresh(po)
    return po


def reject_po(db: Session, po_id: int, comment: str, current_user: User) -> PurchaseOrder:
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    required = _required_role_for_status(po.status)
    if current_user.role != required:
        raise HTTPException(status_code=403, detail=f"Only a {required.value} can reject at this stage")
    po.status = POStatus.NEEDS_REWORK
    po.rejection_comment = comment
    db.commit()
    db.refresh(po)
    return po


def resubmit_po(db: Session, po_id: int, data: PurchaseOrderUpdate, current_user: User) -> PurchaseOrder:
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    if current_user.role != UserRole.CREATOR:
        raise HTTPException(status_code=403, detail="Only a Creator can resubmit a purchase order")
    if po.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the creator of this PO can resubmit it")
    if po.status != POStatus.NEEDS_REWORK:
        raise HTTPException(status_code=400, detail="Only POs with status NEEDS_REWORK can be resubmitted")
    po.title = data.title
    po.amount = data.amount
    po.category = data.category
    po.status = _get_initial_status(data.amount, data.category)
    po.rejection_comment = None
    db.commit()
    db.refresh(po)
    return po


def get_po_by_id(db: Session, po_id: int) -> PurchaseOrder:
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po


def get_all_pos(db: Session) -> list[PurchaseOrder]:
    return db.query(PurchaseOrder).all()
