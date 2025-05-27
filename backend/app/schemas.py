from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Dict, List, Optional

# Environmental Metric schema


class EnvironmentalMetricBase(BaseModel):
    building_name: Optional[str] = None
    square_meters: Optional[float] = None
    electricity_consumption: Optional[float] = None
    gas_consumption: Optional[float] = None
    car_diesel_consumption: Optional[float] = None
    car_fuel_consumption: Optional[float] = None
    car_electricity_consumption: Optional[float] = None
    hazardous_waste: Optional[float] = None
    non_hazardous_waste: Optional[float] = None
    turnover: Optional[float] = None
    year: int


class EnvironmentalMetricCreate(EnvironmentalMetricBase):
    company_id: int
    created_at: datetime


class EnvironmentalMetricUpdate(EnvironmentalMetricBase):
    pass


class EnvironmentalMetric(EnvironmentalMetricBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Social Metric schema


class SocialMetricBase(BaseModel):
    no_of_employees: Optional[int] = None
    male_employees: Optional[int] = None
    female_employees: Optional[int] = None
    permanent_employees: Optional[int] = None
    temporary_employees: Optional[int] = None
    full_time_employees: Optional[int] = None
    part_time_employees: Optional[int] = None
    employees_under_30: Optional[int] = None
    employees_30_50: Optional[int] = None
    employees_over_50: Optional[int] = None
    new_employees: Optional[int] = None
    employees_left: Optional[int] = None
    voluntary_turnover: Optional[float] = None
    involuntary_turnover: Optional[float] = None
    avg_hourly_earnings_male: Optional[float] = None
    avg_hourly_earnings_female: Optional[float] = None
    ceo_total_compensation: Optional[float] = None
    median_employee_total_compensation: Optional[float] = None
    CEO: Optional[float] = None
    pay_ratio: Optional[str] = None
    year: int


class SocialMetricCreate(SocialMetricBase):
    company_id: int
    created_at: datetime


class SocialMetricUpdate(SocialMetricBase):
    pass


class SocialMetric(SocialMetricBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Governance Metric schema


class GovernanceMetricBase(BaseModel):
    anti_corruption: Optional[Dict[str, bool]] = None
    anti_corruption_text: Optional[str] = None
    whistleblowing: Optional[Dict[str, bool]] = None
    whistleblowing_text: Optional[str] = None
    business_conduct: Optional[Dict[str, bool]] = None
    business_conduct_text: Optional[str] = None
    corporate_culture: Optional[Dict[str, bool]] = None
    corporate_culture_text: Optional[str] = None
    year: int


class GovernanceMetricCreate(GovernanceMetricBase):
    company_id: int
    created_at: Optional[datetime] = None


class GovernanceMetricUpdate(GovernanceMetricBase):
    pass


class GovernanceMetric(GovernanceMetricBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Company schema
class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    contact_email: EmailStr
    website: Optional[str] = None
    phone_number: Optional[str] = None
    number_of_buildings: Optional[int] = None
    year_founded: Optional[int] = None
    country: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    owner_id: Optional[int] = None
    # company_pdf: Optional[bytes] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(CompanyBase):
    pass


class Company(CompanyBase):
    id: int
    environmental_metrics: List[EnvironmentalMetric] = []
    social_metrics: List[SocialMetric] = []
    governance_metrics: List[GovernanceMetric] = []

    class Config:
        from_attributes = True
        exlude = {"company_pdf"}


class CompanyMetrics(BaseModel):
    environmental: List[EnvironmentalMetric]
    social: List[SocialMetric]
    governance: List[GovernanceMetric]

    class Config:
        from_attributes = True


class CompanyWithPdf(Company):
    company_pdf: Optional[bytes] = None

    class Config:
        from_attributes = True


# User schema


class UserBase(BaseModel):
    username: str
    email: EmailStr
    company_id: Optional[int] = None


class UserCreate(UserBase):
    password: str
    role: str = "user"


class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True


class ChangePassword(BaseModel):
    username: str
    currentPassword: str
    newPassword: str


# Goal schema


class GoalBase(BaseModel):
    target_year: int
    target_co2_percentage: Optional[float] = None
    target_male_percentage: Optional[float] = None
    target_female_percentage: Optional[float] = None
    target_co2: Optional[float] = None
    goal_type: Optional[str] = None
    company_id: int
    environmental_metric_id: Optional[int] = None
    social_metric_id: Optional[int] = None
    governance_metric_id: Optional[int] = None
    created_by: Optional[int] = None
    created_at: Optional[datetime] = None


class GoalCreate(GoalBase):
    pass


class Goal(GoalBase):
    id: int

    class Config:
        from_attributes = True


# Token schema


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str


class TokenData(BaseModel):
    username: str
