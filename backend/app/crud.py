from sqlalchemy import func
from sqlalchemy.orm import Session
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from . import models, schemas, config
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Company CRUD operations
def get_company(db: Session, company_id: int):
    return db.query(models.Company).filter(models.Company.id == company_id).first()


def get_companies(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Company).offset(skip).limit(limit).all()


def create_company(db: Session, company: schemas.CompanyCreate):
    db_company = models.Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


def update_company(db: Session, company_id: int, company: schemas.CompanyUpdate):
    db_company = (
        db.query(models.Company).filter(models.Company.id == company_id).first()
    )
    if db_company:
        for key, value in company.dict().items():
            setattr(db_company, key, value)
        db.commit()
        db.refresh(db_company)
    return db_company


def delete_company(db: Session, company_id: int):
    db_company = (
        db.query(models.Company).filter(models.Company.id == company_id).first()
    )
    if db_company:
        db.delete(db_company)
        db.commit()
    return db_company


def update_company_pdf(db: Session, company_id: int, pdf_data: bytes):
    db_company = get_company(db, company_id)
    if db_company:
        db_company.company_pdf = pdf_data
        db.commit()
        db.refresh(db_company)
    return db_company


def delete_company_pdf(db: Session, company_id: int):
    db_company = get_company(db, company_id)
    if db_company:
        db_company.company_pdf = None
        db.commit()
        db.refresh(db_company)
    return db_company


def update_environmental_metric_pdf(
    db: Session,
    metric_id: int,
    electricity_pdf: bytes = None,
    gas_pdf: bytes = None,
    car_electricity_pdf: bytes = None,
    car_diesel_pdf: bytes = None,
    car_fuel_pdf: bytes = None,
):
    db_metric = get_environmental_metric(db, metric_id)
    if db_metric:
        if electricity_pdf is not None:
            db_metric.electricity_consumption_pdf = electricity_pdf
        if gas_pdf is not None:
            db_metric.gas_consumption_pdf = gas_pdf
        if car_electricity_pdf is not None:
            db_metric.car_electricity_consumption_pdf = car_electricity_pdf
        if car_diesel_pdf is not None:
            db_metric.car_diesel_consumption_pdf = car_diesel_pdf
        if car_fuel_pdf is not None:
            db_metric.car_fuel_consumption_pdf = car_fuel_pdf
        db.commit()
        db.refresh(db_metric)
    return db_metric


def delete_environmental_metric_pdf(db: Session, metric_id: int, file_type: str):
    db_metric = get_environmental_metric(db, metric_id)
    if db_metric:
        if file_type == "electricity":
            db_metric.electricity_consumption_pdf = None
        elif file_type == "gas":
            db_metric.gas_consumption_pdf = None
        elif file_type == "car_electricity":
            db_metric.car_electricity_consumption_pdf = None
        elif file_type == "car_diesel":
            db_metric.car_diesel_consumption_pdf = None
        elif file_type == "car_fuel":
            db_metric.car_fuel_consumption_pdf = None
        db.commit()
        db.refresh(db_metric)
    return db_metric


def get_environmental_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.EnvironmentalMetric)
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .all()
    )


def get_social_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.SocialMetric)
        .filter(models.SocialMetric.company_id == company_id)
        .all()
    )


def get_governance_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.company_id == company_id)
        .all()
    )


# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        company_id=user.company_id,
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


# EnvironmentalMetric CRUD operations
def get_environmental_metric(db: Session, metric_id: int):
    return (
        db.query(models.EnvironmentalMetric)
        .filter(models.EnvironmentalMetric.id == metric_id)
        .first()
    )


def get_environmental_metrics(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.EnvironmentalMetric).offset(skip).limit(limit).all()


def get_environmental_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.EnvironmentalMetric)
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .all()
    )


def create_environmental_metric(db: Session, metric: schemas.EnvironmentalMetricCreate):
    db_metric = models.EnvironmentalMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


def update_environmental_metric(
    db: Session, metric_id: int, metric: schemas.EnvironmentalMetricUpdate
):
    db_metric = (
        db.query(models.EnvironmentalMetric)
        .filter(models.EnvironmentalMetric.id == metric_id)
        .first()
    )
    if db_metric:
        for key, value in metric.dict().items():
            setattr(db_metric, key, value)
        db.commit()
        db.refresh(db_metric)
    return db_metric


def delete_environmental_metric(db: Session, metric_id: int):
    db_metric = (
        db.query(models.EnvironmentalMetric)
        .filter(models.EnvironmentalMetric.id == metric_id)
        .first()
    )
    if db_metric:
        db.delete(db_metric)
        db.commit()
    return db_metric


# SocialMetric CRUD operations
def get_social_metric(db: Session, metric_id: int):
    return (
        db.query(models.SocialMetric)
        .filter(models.SocialMetric.id == metric_id)
        .first()
    )


def get_social_metrics(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.SocialMetric).offset(skip).limit(limit).all()


def get_social_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.SocialMetric)
        .filter(models.SocialMetric.company_id == company_id)
        .all()
    )


def create_social_metric(db: Session, metric: schemas.SocialMetricCreate):
    db_metric = models.SocialMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


def update_social_metric(
    db: Session, metric_id: int, metric: schemas.SocialMetricUpdate
):
    db_metric = (
        db.query(models.SocialMetric)
        .filter(models.SocialMetric.id == metric_id)
        .first()
    )
    if db_metric:
        for key, value in metric.dict().items():
            setattr(db_metric, key, value)
        db.commit()
        db.refresh(db_metric)
    return db_metric


def delete_social_metric(db: Session, metric_id: int):
    db_metric = (
        db.query(models.SocialMetric)
        .filter(models.SocialMetric.id == metric_id)
        .first()
    )
    if db_metric:
        db.delete(db_metric)
        db.commit()
    return db_metric


# GovernanceMetric CRUD operations
def get_governance_metric(db: Session, metric_id: int):
    return (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.id == metric_id)
        .first()
    )


def get_governance_metrics(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.GovernanceMetric).offset(skip).limit(limit).all()


def get_governance_metrics_by_company(db: Session, company_id: int):
    return (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.company_id == company_id)
        .all()
    )


def create_governance_metric(db: Session, metric: schemas.GovernanceMetricCreate):
    db_metric = models.GovernanceMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


def update_governance_metric(
    db: Session, metric_id: int, metric: schemas.GovernanceMetricUpdate
):
    db_metric = (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.id == metric_id)
        .first()
    )
    if db_metric:
        for key, value in metric.dict().items():
            setattr(db_metric, key, value)
        db.commit()
        db.refresh(db_metric)
    return db_metric


def delete_governance_metric(db: Session, metric_id: int):
    db_metric = (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.id == metric_id)
        .first()
    )
    if db_metric:
        db.delete(db_metric)
        db.commit()
    return db_metric


def get_governance_metrics_percentage_by_year(db: Session, company_id: int):
    metrics = (
        db.query(models.GovernanceMetric)
        .filter(models.GovernanceMetric.company_id == company_id)
        .all()
    )
    results = []

    for metric in metrics:
        total_fields = 0
        true_fields = 0

        for field in [
            "anti_corruption",
            "whistleblowing",
            "corporate_culture",
            "business_conduct",
        ]:
            status = getattr(metric, field)
            total_fields += len(status)
            true_fields += sum(status.values())

        percentage = (true_fields / total_fields) * 100 if total_fields > 0 else 0
        results.append(
            {
                "company_id": metric.company_id,
                "year": metric.year,
                "percentage": percentage,
            }
        )

    return results


# Goal CRUD operations
def get_goal(db: Session, goal_id: int):
    return db.query(models.Goal).filter(models.Goal.id == goal_id).first()


def get_goals(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Goal).offset(skip).limit(limit).all()


def get_goals_by_company(db: Session, company_id: int):
    return db.query(models.Goal).filter(models.Goal.company_id == company_id).all()


def create_goal(db: Session, goal: schemas.GoalCreate):
    db_goal = models.Goal(**goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


def delete_goal(db: Session, goal_id: int):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if db_goal:
        db.delete(db_goal)
        db.commit()
        return db_goal
    else:
        raise HTTPException(status_code=404, detail="Goal not found")


# Consumptions crud operations
def get_consumption_data_by_year(db, company_id, year=None):
    query = db.query(models.EnvironmentalMetric).filter(models.EnvironmentalMetric.company_id == company_id)
    if year:
        query = query.filter(models.EnvironmentalMetric.year == year)
    return query.all()

def get_co2_emissions_by_year(db, company_id, year=None):
    query = db.query(models.EnvironmentalMetric).filter(models.EnvironmentalMetric.company_id == company_id)
    if year:
        query = query.filter(models.EnvironmentalMetric.year == year)
    return query.all()

def get_co2_consumption_per_person_by_year(db: Session, company_id: int):
    co2_data = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            (
                func.sum(models.EnvironmentalMetric.electricity_consumption)
                + func.sum(models.EnvironmentalMetric.gas_consumption)
                + func.sum(models.EnvironmentalMetric.car_diesel_consumption)
                + func.sum(models.EnvironmentalMetric.car_fuel_consumption)
                + func.sum(models.EnvironmentalMetric.car_electricity_consumption)
            ).label("total_co2_consumption"),
            func.sum(models.SocialMetric.no_of_employees).label("total_employees"),
        )
        .join(
            models.SocialMetric,
            models.EnvironmentalMetric.company_id == models.SocialMetric.company_id,
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {
            "year": year,
            "co2_per_person": (
                round((total_co2_consumption or 0) / (total_employees or 1), 2)
                if total_employees
                else 0
            ),
        }
        for year, total_co2_consumption, total_employees in co2_data
    ]

def get_environmental_metrics_by_company_and_year(db, company_id, year):
    return db.query(models.EnvironmentalMetric).filter(
        models.EnvironmentalMetric.company_id == company_id,
        models.EnvironmentalMetric.year == year
    ).all()

def get_social_metrics_by_company_and_year(db, company_id, year):
    return db.query(models.SocialMetric).filter(
        models.SocialMetric.company_id == company_id,
        models.SocialMetric.year == year
    ).all()

def get_governance_metrics_by_company_and_year(db, company_id, year):
    return db.query(models.GovernanceMetric).filter(
        models.GovernanceMetric.company_id == company_id,
        models.GovernanceMetric.year == year
    ).all()
