from app.core.database import SessionLocal
from app.services.user_service import create_user, get_user_by_email
from app.schemas.user import UserCreate

users = [
    {"name": "Ana Creator", "email": "creator@test.com", "password": "test1234", "role": "CREATOR"},
    {"name": "Mihai Manager", "email": "manager@test.com", "password": "test1234", "role": "MANAGER"},
    {"name": "Ion IT", "email": "it@test.com", "password": "test1234", "role": "IT_REPRESENTATIVE"},
    {"name": "Florin Finance", "email": "finance@test.com", "password": "test1234", "role": "FINANCE"},
]

db = SessionLocal()
for u in users:
    if not get_user_by_email(db, u["email"]):
        create_user(db, UserCreate(**u))
        print(f"Creat: {u['email']}")
    else:
        print(f"Exista deja: {u['email']}")
db.close()
print("Gata!")
