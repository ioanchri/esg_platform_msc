from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text,
    JSON,
    Date,
    LargeBinary,
)
from sqlalchemy.orm import relationship
from .database import Base

# Define the models


# Company model
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True, nullable=False)
    industry = Column(String)
    contact_email = Column(String, unique=True)
    website = Column(String)
    phone_number = Column(String)
    year_founded = Column(Integer)
    number_of_buildings = Column(Integer)
    country = Column(String)
    city = Column(String)
    address = Column(String)
    postal_code = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    owner_id = Column(Integer)
    company_pdf = Column(LargeBinary)

    users = relationship("User", back_populates="company")
    environmental_metrics = relationship(
        "EnvironmentalMetric", back_populates="company", cascade="all, delete-orphan"
    )
    social_metrics = relationship(
        "SocialMetric", back_populates="company", cascade="all, delete-orphan"
    )
    governance_metrics = relationship(
        "GovernanceMetric", back_populates="company", cascade="all, delete-orphan"
    )
    goals = relationship("Goal", back_populates="company", cascade="all, delete-orphan")


# User model


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    role = Column(String, nullable=False)

    company = relationship("Company", back_populates="users")


# Environmental Metric model


class EnvironmentalMetric(Base):
    __tablename__ = "environmental_metrics"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    building_name = Column(String)
    square_meters = Column(Float)
    electricity_consumption = Column(Float)
    gas_consumption = Column(Float)
    car_diesel_consumption = Column(Float)
    car_fuel_consumption = Column(Float)
    car_electricity_consumption = Column(Float)
    hazardous_waste = Column(Float)
    non_hazardous_waste = Column(Float)
    turnover = Column(Float)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    electricity_consumption_pdf = Column(LargeBinary, nullable=True)
    gas_consumption_pdf = Column(LargeBinary, nullable=True)
    car_diesel_consumption_pdf = Column(LargeBinary, nullable=True)
    car_fuel_consumption_pdf = Column(LargeBinary, nullable=True)
    car_electricity_consumption_pdf = Column(LargeBinary, nullable=True)

    company = relationship("Company", back_populates="environmental_metrics")


# Social Metric model


class SocialMetric(Base):
    __tablename__ = "social_metrics"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    no_of_employees = Column(Integer)
    male_employees = Column(Integer)
    female_employees = Column(Integer)
    permanent_employees = Column(Integer)
    temporary_employees = Column(Integer)
    full_time_employees = Column(Integer)
    part_time_employees = Column(Integer)
    employees_under_30 = Column(Integer)
    employees_30_50 = Column(Integer)
    employees_over_50 = Column(Integer)
    new_employees = Column(Integer)
    employees_left = Column(Integer)
    voluntary_turnover = Column(Float)
    involuntary_turnover = Column(Float)
    avg_hourly_earnings_male = Column(Float)
    avg_hourly_earnings_female = Column(Float)
    ceo_total_compensation = Column(Float)
    median_employee_total_compensation = Column(Float)
    CEO = Column(Float)
    pay_ratio = Column(String)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    company = relationship("Company", back_populates="social_metrics")


# Governance Metric model


class GovernanceMetric(Base):
    __tablename__ = "governance_metrics"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    year = Column(Integer, nullable=False)
    anti_corruption_text = Column(String)
    anti_corruption = Column(JSON, nullable=False, default=dict)
    whistleblowing_text = Column(String)
    whistleblowing = Column(JSON, nullable=False, default=dict)
    corporate_culture_text = Column(String)
    corporate_culture = Column(JSON, nullable=False, default=dict)
    business_conduct_text = Column(String)
    business_conduct = Column(JSON, nullable=False, default=dict)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    company = relationship("Company", back_populates="governance_metrics")


# Goal model


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    environmental_metric_id = Column(Integer, ForeignKey("environmental_metrics.id"))
    social_metric_id = Column(Integer, ForeignKey("social_metrics.id"))
    governance_metric_id = Column(Integer, ForeignKey("governance_metrics.id"))
    target_year = Column(Integer, nullable=False)
    target_co2_percentage = Column(Float)
    target_male_percentage = Column(Float)
    target_female_percentage = Column(Float)
    target_co2 = Column(Float)
    goal_type = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)

    company = relationship("Company", back_populates="goals")
    user = relationship("User")
    environmental_metric = relationship("EnvironmentalMetric")
    social_metric = relationship("SocialMetric")
    governance_metric = relationship("GovernanceMetric")
