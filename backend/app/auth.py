from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
import jwt
from sqlalchemy.orm import Session
from app.config import ALGORITHM, SECRET_KEY
from . import crud, models, schemas, database
from jwt.exceptions import ExpiredSignatureError

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = crud.create_access_token(
        data={"sub": user.username, "user_id": user.id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
    }


@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


async def get_current_user(
    request: Request,
    db: Session = Depends(database.get_db),
    token: str = Depends(oauth2_scheme),
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if username is None or user_id is None:
            raise credentials_exception
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Signature has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    request.state.user = user
    return user


async def get_current_admin_user(
    request: Request,
    db: Session = Depends(database.get_db),
    token: str = Depends(oauth2_scheme),
):
    user = await get_current_user(request, db, token)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user


@router.post("/change-password")
def change_password(
    data: schemas.ChangePassword, db: Session = Depends(database.get_db)
):
    user = crud.get_user_by_username(db, username=data.username)
    if not user or not crud.verify_password(data.currentPassword, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    user.hashed_password = crud.get_password_hash(data.newPassword)
    db.commit()
    return {"msg": "Password changed successfully"}


@router.put("/users/{user_id}/reset-password")
def reset_password(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    default_password = "123456"
    user.hashed_password = crud.get_password_hash(default_password)
    db.commit()
    return {"msg": "Password reset successfully"}
