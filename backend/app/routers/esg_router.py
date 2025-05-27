import io
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Dict, List

from ..auth import get_current_user

from ..models import Company

from ..utils import generate_company_pdf
from .. import crud, schemas
from ..database import SessionLocal, get_db
from app import models

router = APIRouter()


@router.post("/companies/", response_model=schemas.Company)
def create_company(
    company: schemas.CompanyCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    company.owner_id = current_user.id
    db_company = crud.create_company(db=db, company=company)

    current_user.company_id = db_company.id
    db.commit()
    db.refresh(current_user)

    return db_company


@router.get("/companies/", response_model=List[schemas.Company])
def read_companies(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_companies(db, skip=skip, limit=limit)


@router.get("/companies/count", response_model=int)
def get_companies_count(db: Session = Depends(get_db)):
    return db.query(func.count(Company.id)).scalar()


@router.get("/companies/{company_id}", response_model=schemas.Company)
def read_company(company_id: int, db: Session = Depends(get_db)):
    return crud.get_company(db, company_id=company_id)


@router.get("/companies/{company_id}/metrics", response_model=schemas.CompanyMetrics)
def get_company_metrics(company_id: int, db: Session = Depends(get_db)):
    environmental_metrics = crud.get_environmental_metrics_by_company(db, company_id)
    social_metrics = crud.get_social_metrics_by_company(db, company_id)
    governance_metrics = crud.get_governance_metrics_by_company(db, company_id)
    return {
        "environmental": environmental_metrics,
        "social": social_metrics,
        "governance": governance_metrics,
    }


@router.get("/companies/user/{user_id}", response_model=schemas.Company)
def get_company_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    if user is None or user.company_id is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return crud.get_company(db, company_id=user.company_id)


@router.get("/api/industries")
def get_company_industries():
    db = SessionLocal()
    industries = (
        db.query(Company.industry, func.count(Company.id).label("count"))
        .group_by(Company.industry)
        .all()
    )
    return [{"industry": industry, "count": count} for industry, count in industries]


@router.put("/companies/{company_id}", response_model=schemas.Company)
def update_company(
    company_id: int, company: schemas.CompanyUpdate, db: Session = Depends(get_db)
):
    db_company = crud.update_company(db, company_id=company_id, company=company)
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return db_company


@router.delete("/companies/{company_id}", response_model=schemas.Company)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    db_company = crud.delete_company(db, company_id=company_id)
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return db_company


@router.post("/companies/{company_id}/upload_pdf")
async def upload_company_pdf(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_company = crud.get_company(db, company_id=company_id)
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")

    file_content = await file.read()
    db_company = crud.update_company_pdf(db, company_id, file_content)
    return {"msg": "PDF uploaded successfully"}


@router.get("/companies/industries")
def get_company_industries():
    db = SessionLocal()
    industries = (
        db.query(Company.industry, func.count(Company.id).label("count"))
        .group_by(Company.industry)
        .all()
    )
    return [{"industry": industry, "count": count} for industry, count in industries]


@router.get("/companies/{company_id}/pdf", response_class=StreamingResponse)
def get_company_pdf(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    metrics = {
        "environmental": crud.get_environmental_metrics_by_company(db, company_id),
        "social": crud.get_social_metrics_by_company(db, company_id),
        "governance": crud.get_governance_metrics_by_company(db, company_id),
    }

    pdf_buffer = generate_company_pdf(company, metrics)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=company_{company_id}.pdf"
        },
    )


# User endpoints
@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)


@router.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.get("/username/{username}", response_model=schemas.User)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# EnvironmentalMetric endpoints


@router.post("/environmental_metrics/", response_model=schemas.EnvironmentalMetric)
def create_environmental_metric(
    metric: schemas.EnvironmentalMetricCreate, db: Session = Depends(get_db)
):
    return crud.create_environmental_metric(db=db, metric=metric)


@router.get("/environmental_metrics/", response_model=List[schemas.EnvironmentalMetric])
def read_environmental_metrics(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    return crud.get_environmental_metrics(db, skip=skip, limit=limit)


@router.get(
    "/environmental_metrics/{metric_id}", response_model=schemas.EnvironmentalMetric
)
def read_environmental_metric(metric_id: int, db: Session = Depends(get_db)):
    return crud.get_environmental_metric(db, metric_id=metric_id)


@router.get(
    "/environmental_metrics/company/{company_id}",
    response_model=List[schemas.EnvironmentalMetric],
)
def read_environmental_metrics_by_company(
    company_id: int, db: Session = Depends(get_db)
):
    return crud.get_environmental_metrics_by_company(db, company_id=company_id)


@router.put(
    "/environmental_metrics/{metric_id}", response_model=schemas.EnvironmentalMetric
)
def update_environmental_metric(
    metric_id: int,
    metric: schemas.EnvironmentalMetricUpdate,
    db: Session = Depends(get_db),
):
    db_metric = crud.update_environmental_metric(db, metric_id=metric_id, metric=metric)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="EnvironmentalMetric not found")
    return db_metric


@router.delete(
    "/environmental_metrics/{metric_id}", response_model=schemas.EnvironmentalMetric
)
def delete_environmental_metric(metric_id: int, db: Session = Depends(get_db)):
    db_metric = crud.delete_environmental_metric(db, metric_id=metric_id)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="EnvironmentalMetric not found")
    return db_metric


# SocialMetric endpoints
@router.post("/social_metrics/", response_model=schemas.SocialMetric)
def create_social_metric(
    metric: schemas.SocialMetricCreate, db: Session = Depends(get_db)
):
    return crud.create_social_metric(db=db, metric=metric)


@router.get("/social_metrics/", response_model=List[schemas.SocialMetric])
def read_social_metrics(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_social_metrics(db, skip=skip, limit=limit)


@router.get("/social_metrics/{metric_id}", response_model=schemas.SocialMetric)
def read_social_metric(metric_id: int, db: Session = Depends(get_db)):
    db_metric = crud.get_social_metric(db, metric_id=metric_id)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="SocialMetric not found")
    return db_metric


@router.get(
    "/social_metrics/company/{company_id}", response_model=List[schemas.SocialMetric]
)
def read_social_metrics_by_company(company_id: int, db: Session = Depends(get_db)):
    return crud.get_social_metrics_by_company(db, company_id=company_id)


@router.put("/social_metrics/{metric_id}", response_model=schemas.SocialMetric)
def update_social_metric(
    metric_id: int, metric: schemas.SocialMetricUpdate, db: Session = Depends(get_db)
):
    db_metric = crud.update_social_metric(db, metric_id=metric_id, metric=metric)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="SocialMetric not found")
    return db_metric


@router.delete("/social_metrics/{metric_id}", response_model=schemas.SocialMetric)
def delete_social_metric(metric_id: int, db: Session = Depends(get_db)):
    db_metric = crud.delete_social_metric(db, metric_id=metric_id)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="SocialMetric not found")
    return db_metric


# GovernanceMetric endpoints
@router.post("/governance_metrics/", response_model=schemas.GovernanceMetric)
def create_governance_metric(
    metric: schemas.GovernanceMetricCreate, db: Session = Depends(get_db)
):
    return crud.create_governance_metric(db=db, metric=metric)


@router.get("/governance_metrics/", response_model=List[schemas.GovernanceMetric])
def read_governance_metrics(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    return crud.get_governance_metrics(db, skip=skip, limit=limit)


@router.get("/governance_metrics/{metric_id}", response_model=schemas.GovernanceMetric)
def read_governance_metric(metric_id: int, db: Session = Depends(get_db)):
    return crud.get_governance_metric(db, metric_id=metric_id)


@router.get(
    "/governance_metrics/company/{company_id}",
    response_model=List[schemas.GovernanceMetric],
)
def read_governance_metrics_by_company(company_id: int, db: Session = Depends(get_db)):
    return crud.get_governance_metrics_by_company(db, company_id=company_id)


@router.put("/governance_metrics/{metric_id}", response_model=schemas.GovernanceMetric)
def update_governance_metric(
    metric_id: int,
    metric: schemas.GovernanceMetricUpdate,
    db: Session = Depends(get_db),
):
    db_metric = crud.update_governance_metric(db, metric_id=metric_id, metric=metric)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="GovernanceMetric not found")
    return db_metric


@router.delete(
    "/governance_metrics/{metric_id}", response_model=schemas.GovernanceMetric
)
def delete_governance_metric(metric_id: int, db: Session = Depends(get_db)):
    db_metric = crud.delete_governance_metric(db, metric_id=metric_id)
    if db_metric is None:
        raise HTTPException(status_code=404, detail="GovernanceMetric not found")
    return db_metric


# Goal endpoints
@router.post("/goals", response_model=schemas.Goal)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = crud.create_goal(db=db, goal=goal)
    if db_goal is None:
        raise HTTPException(status_code=400, detail="Goal creation failed")
    return db_goal


@router.get("/goals/", response_model=List[schemas.Goal])
def read_goals(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_goals(db, skip=skip, limit=limit)


@router.get("/goals/company/{company_id}", response_model=List[schemas.Goal])
def read_goals_by_company(company_id: int, db: Session = Depends(get_db)):
    return crud.get_goals_by_company(db, company_id=company_id)


@router.get("/goals/{goal_id}", response_model=schemas.Goal)
def read_goal(goal_id: int, db: Session = Depends(get_db)):
    return crud.get_goal(db, goal_id=goal_id)


@router.delete("/goals/{goal_id}", response_model=schemas.Goal)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    return crud.delete_goal(db=db, goal_id=goal_id)


@router.post("/companies/{company_id}/upload_pdf", response_model=schemas.Company)
async def upload_company_pdf(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    db_company = crud.get_company(db, company_id=company_id)
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")

    file_content = await file.read()
    db_company = crud.update_company_pdf(db, company_id, file_content)
    return {"message": "PDF uploaded successfully", "company_id": company_id}


@router.get("/companies/{company_id}/download_pdf", response_class=StreamingResponse)
def download_company_pdf(company_id: int, db: Session = Depends(get_db)):
    db_company = crud.get_company(db, company_id=company_id)
    if not db_company or not db_company.company_pdf:
        raise HTTPException(status_code=404, detail="PDF not found")

    return StreamingResponse(
        io.BytesIO(db_company.company_pdf), media_type="application/pdf"
    )


@router.delete("/companies/{company_id}/delete_pdf", response_model=schemas.Company)
def delete_company_pdf(company_id: int, db: Session = Depends(get_db)):
    db_company = crud.delete_company_pdf(db, company_id)
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return db_company


@router.post("/environmental_metrics/{metric_id}/upload_pdf")
async def upload_environmental_metric_pdf(
    metric_id: int,
    file: UploadFile = File(...),
    file_type: str = Query(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user),
):
    file_content = await file.read()
    if file_type not in [
        "electricity",
        "gas",
        "carDiesel",
        "carElectricity",
        "carFuel",
    ]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    crud.update_environmental_metric_pdf(
        db,
        metric_id,
        electricity_pdf=file_content if file_type == "electricity" else None,
        gas_pdf=file_content if file_type == "gas" else None,
        car_diesel_pdf=file_content if file_type == "carDiesel" else None,
        car_electricity_pdf=file_content if file_type == "carElectricity" else None,
        car_fuel_pdf=file_content if file_type == "carFuel" else None,
    )

    return {"message": "PDF uploaded successfully"}


@router.delete(
    "/environmental_metrics/{metric_id}/delete_pdf",
    response_model=schemas.EnvironmentalMetric,
)
def delete_environmental_metric_pdf(
    metric_id: int, file_type: str = Query(...), db: Session = Depends(get_db)
):
    if file_type not in [
        "electricity",
        "gas",
        "carDiesel",
        "carElectricity",
        "carFuel",
    ]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    db_metric = crud.delete_environmental_metric_pdf(db, metric_id, file_type)
    return db_metric


@router.get(
    "/environmental_metrics/{metric_id}/download_pdf", response_class=StreamingResponse
)
def download_environmental_metric_pdf(
    metric_id: int, file_type: str = Query(...), db: Session = Depends(get_db)
):
    db_metric = crud.get_environmental_metric(db, metric_id)
    if not db_metric:
        raise HTTPException(status_code=404, detail="Environmental metric not found")

    pdf_content = None
    if file_type == "electricity":
        pdf_content = db_metric.electricity_consumption_pdf
    elif file_type == "gas":
        pdf_content = db_metric.gas_consumption_pdf
    elif file_type == "carDiesel":
        pdf_content = db_metric.car_diesel_consumption_pdf
    elif file_type == "carElectricity":
        pdf_content = db_metric.car_electricity_consumption_pdf
    elif file_type == "carFuel":
        pdf_content = db_metric.car_fuel_consumption_pdf
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")

    if not pdf_content:
        raise HTTPException(status_code=404, detail="PDF not found")

    return StreamingResponse(io.BytesIO(pdf_content), media_type="application/pdf")


@router.get("/companies/{company_id}/available_years", response_model=List[int])
async def get_available_years(company_id: int, db: Session = Depends(get_db)):
    years = set()
    years.update(
        [
            metric.year
            for metric in crud.get_environmental_metrics_by_company(db, company_id)
        ]
    )
    years.update(
        [metric.year for metric in crud.get_social_metrics_by_company(db, company_id)]
    )
    years.update(
        [
            metric.year
            for metric in crud.get_governance_metrics_by_company(db, company_id)
        ]
    )
    return list(years)


@router.get("/companies/{company_id}/download_report")
async def download_company_pdf(
    company_id: int, year: int = Query(None), db: Session = Depends(get_db)
):
    db_company = crud.get_company(db, company_id=company_id)
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")

    metrics = {
        "environmental": crud.get_environmental_metrics_by_company_and_year(
            db, company_id, year
        ),
        "social": crud.get_social_metrics_by_company_and_year(db, company_id, year),
        "governance": crud.get_governance_metrics_by_company_and_year(
            db, company_id, year
        ),
    }

    pdf_buffer = generate_company_pdf(db_company, metrics)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=company_{company_id}_report_{year}.pdf"
        },
    )


@router.get(
    "/companies/{company_id}/hazardous_waste", response_model=List[Dict[str, float]]
)
def get_hazardous_waste_by_year(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    hazardous_waste_data = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            func.sum(models.EnvironmentalMetric.hazardous_waste).label(
                "total_hazardous_waste"
            ),
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {"year": year, "total_hazardous_waste": total_hazardous_waste}
        for year, total_hazardous_waste in hazardous_waste_data
    ]


@router.get("/companies/{company_id}/waste_data", response_model=List[Dict[str, float]])
def get_waste_data_by_year(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    waste_data = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            func.sum(models.EnvironmentalMetric.hazardous_waste).label(
                "total_hazardous_waste"
            ),
            func.sum(models.EnvironmentalMetric.non_hazardous_waste).label(
                "total_non_hazardous_waste"
            ),
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {
            "year": year,
            "total_hazardous_waste": total_hazardous_waste,
            "total_non_hazardous_waste": total_non_hazardous_waste,
        }
        for year, total_hazardous_waste, total_non_hazardous_waste in waste_data
    ]


@router.get("/companies/{company_id}/car_data", response_model=List[Dict[str, float]])
def get_car_data_by_year(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    car_data = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            func.sum(models.EnvironmentalMetric.car_diesel_consumption).label(
                "total_car_diesel_consumption"
            ),
            func.sum(models.EnvironmentalMetric.car_electricity_consumption).label(
                "total_car_electric_consumption"
            ),
            func.sum(models.EnvironmentalMetric.car_fuel_consumption).label(
                "total_car_fuel_consumption"
            ),
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {
            "year": year,
            "total_car_diesel_consumption": total_car_diesel_consumption,
            "total_car_electric": total_car_electric,
            "total_car_fuel": total_car_fuel,
        }
        for year, total_car_diesel_consumption, total_car_electric, total_car_fuel in car_data
    ]


@router.get(
    "/companies/{company_id}/consumption_data", response_model=List[Dict[str, float]]
)
def get_consumption_data_by_year(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    consumption_data = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            func.sum(models.EnvironmentalMetric.electricity_consumption).label(
                "total_electricity_consumption"
            ),
            func.coalesce(
                func.sum(models.EnvironmentalMetric.gas_consumption), 0
            ).label("total_gas_consumption"),
            func.sum(models.EnvironmentalMetric.car_diesel_consumption).label(
                "total_car_diesel_consumption"
            ),
            func.sum(models.EnvironmentalMetric.car_electricity_consumption).label(
                "total_car_electric_consumption"
            ),
            func.sum(models.EnvironmentalMetric.car_fuel_consumption).label(
                "total_car_fuel_consumption"
            ),
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {
            "year": year,
            "total_car_diesel_consumption": total_car_diesel_consumption,
            "total_car_electric_consumption": total_car_electric_consumption,
            "total_car_fuel_consumption": total_car_fuel_consumption,
            "total_electricity_consumption": total_electricity_consumption,
            "total_gas_consumption": total_gas_consumption,
        }
        for year, total_car_diesel_consumption, total_car_electric_consumption, total_car_fuel_consumption, total_electricity_consumption, total_gas_consumption in consumption_data
    ]


@router.get(
    "/companies/{company_id}/consumption_data_per_square_meter",
    response_model=List[Dict[str, float]],
)
def get_consumption_data_per_square_meter(
    company_id: int, db: Session = Depends(get_db)
):
    return crud.get_consumption_data_per_square_meter(db, company_id)


@router.get("/governance-metrics/percentage/{company_id}")
def get_governance_metrics_percentage(company_id: int, db: Session = Depends(get_db)):
    return crud.get_governance_metrics_percentage_by_year(db, company_id)


@router.get("/check_username/{username}", response_model=bool)
def check_username(username: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=username)
    return user is not None


@router.get("/check_email/{email}", response_model=bool)
def check_email(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    return user is not None


@router.get("/companies/{company_id}/gender_ratio")
def get_gender_ratio(company_id: int, year: int = Query(None), db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if year is not None:
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the selected year")
        return {
            "year": year,
            "male_employees": social_metric.male_employees,
            "female_employees": social_metric.female_employees,
        }
    else:
        last_year = (
            db.query(models.SocialMetric.year)
            .filter(models.SocialMetric.company_id == company_id)
            .order_by(models.SocialMetric.year.desc())
            .first()
        )
        if not last_year:
            raise HTTPException(status_code=404, detail="No metrics found for the company")
        last_year = last_year[0]
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == last_year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the last year")
        return {
            "year": last_year,
            "male_employees": social_metric.male_employees,
            "female_employees": social_metric.female_employees,
        }


@router.get("/companies/{company_id}/compensation_ratio")
def get_compensation_ratio(company_id: int, year: int = Query(None), db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if year is not None:
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the selected year")
        return {
            "year": year,
            "ceo_total_compensation": social_metric.ceo_total_compensation,
            "median_employee_total_compensation": social_metric.median_employee_total_compensation,
        }
    else:
        last_year = (
            db.query(models.SocialMetric.year)
            .filter(models.SocialMetric.company_id == company_id)
            .order_by(models.SocialMetric.year.desc())
            .first()
        )
        if not last_year:
            raise HTTPException(status_code=404, detail="No metrics found for the company")
        last_year = last_year[0]
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == last_year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the last year")
        return {
            "year": last_year,
            "ceo_total_compensation": social_metric.ceo_total_compensation,
            "median_employee_total_compensation": social_metric.median_employee_total_compensation,
        }


@router.get(
    "/companies/{company_id}/co2_emissions", response_model=List[Dict[str, float]]
)
def get_co2_emissions(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    co2_emissions = (
        db.query(
            models.EnvironmentalMetric.year.label("year"),
            func.sum(models.EnvironmentalMetric.car_diesel_consumption * 2.47).label(
                "car_diesel_co2"
            ),
            func.sum(
                models.EnvironmentalMetric.car_electricity_consumption * 0.285
            ).label("car_electric_co2"),
            func.sum(models.EnvironmentalMetric.car_fuel_consumption * 2.141).label(
                "car_fuel_co2"
            ),
            func.sum(models.EnvironmentalMetric.electricity_consumption * 0.285).label(
                "electricity_co2"
            ),
            func.sum(models.EnvironmentalMetric.gas_consumption * 2.20).label(
                "gas_co2"
            ),
        )
        .filter(models.EnvironmentalMetric.company_id == company_id)
        .group_by(models.EnvironmentalMetric.year)
        .all()
    )

    return [
        {
            "year": year,
            "car_diesel_co2": car_diesel_co2 or 0,
            "car_electric_co2": car_electric_co2 or 0,
            "car_fuel_co2": car_fuel_co2 or 0,
            "electricity_co2": electricity_co2 or 0,
            "gas_co2": gas_co2 or 0,
            "total_co2": (car_diesel_co2 or 0)
            + (car_electric_co2 or 0)
            + (car_fuel_co2 or 0)
            + (electricity_co2 or 0)
            + (gas_co2 or 0),
        }
        for year, car_diesel_co2, car_electric_co2, car_fuel_co2, electricity_co2, gas_co2 in co2_emissions
    ]


@router.get(
    "/companies/{company_id}/co2_per_person_by_year", response_model=List[Dict[str, float]]
)
def get_co2_per_person(company_id: int, db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    co2_data = crud.get_co2_consumption_per_person_by_year(db, company_id)
    return co2_data


@router.get("/companies/{company_id}/turnover_rate")
def get_turnover_rate(company_id: int, year: int = Query(None), db: Session = Depends(get_db)):
    company = crud.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if year is not None:
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the selected year")
        return {
            "year": year,
            "voluntary_turnover": social_metric.voluntary_turnover,
            "involuntary_turnover": social_metric.involuntary_turnover,
        }
    else:
        last_year = (
            db.query(models.SocialMetric.year)
            .filter(models.SocialMetric.company_id == company_id)
            .order_by(models.SocialMetric.year.desc())
            .first()
        )
        if not last_year:
            raise HTTPException(status_code=404, detail="No metrics found for the company")
        last_year = last_year[0]
        social_metric = (
            db.query(models.SocialMetric)
            .filter(
                models.SocialMetric.company_id == company_id,
                models.SocialMetric.year == last_year,
            )
            .first()
        )
        if not social_metric:
            raise HTTPException(status_code=404, detail="No social metrics found for the last year")
        return {
            "year": last_year,
            "voluntary_turnover": social_metric.voluntary_turnover,
            "involuntary_turnover": social_metric.involuntary_turnover,
        }


@router.get("/companies/{company_id}/esg_score")
def get_esg_score(company_id: int, year: int, db: Session = Depends(get_db)):
    # Get metrics for the year
    env = db.query(models.EnvironmentalMetric).filter(models.EnvironmentalMetric.company_id == company_id, models.EnvironmentalMetric.year == year).first()
    soc = db.query(models.SocialMetric).filter(models.SocialMetric.company_id == company_id, models.SocialMetric.year == year).first()
    gov = db.query(models.GovernanceMetric).filter(models.GovernanceMetric.company_id == company_id, models.GovernanceMetric.year == year).first()

    if not env and not soc and not gov:
        raise HTTPException(status_code=404, detail="No metrics found for this company and year")

    # --- Environmental Score (lower is better for all) ---
    # Normalize: 0 (bad) to 100 (good)
    def norm(val, minv, maxv):
        if val is None:
            return 50  # neutral if missing
        return max(0, min(100, 100 * (1 - (val - minv) / (maxv - minv)) if maxv > minv else 100))

    # Example normalization ranges (should be adjusted to your data/industry)
    co2 = env.electricity_consumption or 0 + env.gas_consumption or 0
    co2_score = norm(co2, 0, 1000000)
    hazardous_score = norm(env.hazardous_waste or 0, 0, 10000)
    env_score = (co2_score + hazardous_score) / 2 if env else 50

    # --- Social Score ---
    # Lower turnover is better, gender closer to 50/50 is better
    turnover_score = 100 - ((soc.voluntary_turnover or 0) + (soc.involuntary_turnover or 0)) if soc else 50
    gender_score = 100 - abs((soc.male_employees or 0) - (soc.female_employees or 0)) / max(1, (soc.male_employees or 0) + (soc.female_employees or 0)) * 100 if soc and (soc.male_employees or 0) + (soc.female_employees or 0) > 0 else 50
    social_score = (turnover_score + gender_score) / 2 if soc else 50

    # --- Governance Score ---
    # Use governance completion percentage if available
    gov_score = 50
    if gov:
        total_fields = 0
        true_fields = 0
        for field in ["anti_corruption", "whistleblowing", "corporate_culture", "business_conduct"]:
            status = getattr(gov, field, None)
            if status:
                total_fields += len(status)
                true_fields += sum(status.values())
        gov_score = (true_fields / total_fields) * 100 if total_fields > 0 else 50

    # --- Final ESG Score ---
    esg_score = round((env_score + social_score + gov_score) / 3, 1)
    # Label
    if esg_score >= 75:
        label = "Good"
    elif esg_score >= 50:
        label = "Average"
    else:
        label = "Needs Improvement"
    return {
        "year": year,
        "environmental": round(env_score, 1),
        "social": round(social_score, 1),
        "governance": round(gov_score, 1),
        "esg_score": esg_score,
        "label": label
    }
