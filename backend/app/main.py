from fastapi import FastAPI
from app.core.database import Base, engine
from app.models import user, purchase_order
from app.routers import users, purchase_orders, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PO Management System")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(purchase_orders.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
