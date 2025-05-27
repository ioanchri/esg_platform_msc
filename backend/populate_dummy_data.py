from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import (
    Base,
    Company,
    User,
    EnvironmentalMetric,
    SocialMetric,
    GovernanceMetric,
    Goal,
)
from datetime import datetime, timezone
from passlib.context import CryptContext

# Create the database tables
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def populate_data():
    db = SessionLocal()

    # Create dummy users
    user1 = User(
        username="owner1",
        email="owner1@example.com",
        hashed_password=pwd_context.hash("123"),
        role="owner",
        company_id=1,
    )
    user2 = User(
        username="owner2",
        email="owner2@example.com",
        hashed_password=pwd_context.hash("1234"),
        role="owner",
        company_id=2,
    )
    user3 = User(
        username="admin1",
        email="admin1@example.com",
        hashed_password=pwd_context.hash("1234"),
        role="admin",
    )
    user4 = User(
        username="giannisc",
        email="giannis@chris.com",
        hashed_password=pwd_context.hash("4321"),
        role="owner",
        company_id=3,
    )
    user5 = User(
        username="athtech",
        email="info@athenstech.gr",
        hashed_password=pwd_context.hash("athetech123"),
        role="owner",
        company_id=4,
    )

    # Create dummy companies
    company1 = Company(
        name="Hellenic Telecom",
        industry="Telecommunications",
        contact_email="contact@hellenictelecom.gr",
        website="http://www.hellenictelecom.gr",
        phone_number="+30 210 123 4567",
        number_of_buildings=5,
        year_founded=1985,
        country="Greece",
        city="Athens",
        address="123 Telecom St, Athens",
        postal_code="10558",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        owner_id=1,
    )

    company2 = Company(
        name="Athens Automotive",
        industry="Automotive Manufacturing",
        contact_email="info@athensautomotive.gr",
        website="http://www.athensautomotive.gr",
        phone_number="+30 2310 654 321",
        number_of_buildings=3,
        year_founded=1995,
        country="Greece",
        city="Thessaloniki",
        address="456 Auto Ave, Thessaloniki",
        postal_code="54624",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        owner_id=2,
    )

    company3 = Company(
        name="Tech Innovators",
        industry="Technology",
        contact_email="contact@techinnovators.com",
        website="http://www.techinnovators.com",
        phone_number="+30 210 987 6543",
        number_of_buildings=2,
        year_founded=2000,
        country="Greece",
        city="Patras",
        address="789 Tech St, Patras",
        postal_code="26223",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        owner_id=3,
    )
    company4 = Company(
        name="Green Energy Solutions",
        industry="Renewable Energy",
        contact_email="info@greenenergy.com",
        website="http://www.greenenergy.com",
        phone_number="+30 2310 123 456",
        number_of_buildings=4,
        year_founded=2010,
        country="Greece",
        city="Heraklion",
        address="321 Green Ave, Heraklion",
        postal_code="71307",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        owner_id=4,
    )

    db.add(company1)
    db.add(company2)
    db.add(company3)
    db.add(company4)
    db.commit()

    db.add(user1)
    db.add(user2)
    db.add(user3)
    db.add(user4)
    db.add(user5)
    db.commit()

    # Create dummy environmental metrics for company1
    env_metrics_2021 = EnvironmentalMetric(
        company_id=company1.id,
        electricity_consumption=500000,
        car_diesel_consumption=2000,
        car_fuel_consumption=1500,
        car_electricity_consumption=1000,
        hazardous_waste=100,
        non_hazardous_waste=200,
        year=2021,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    env_metrics_2022 = EnvironmentalMetric(
        company_id=company1.id,
        building_name="Building A",
        square_meters=1000,
        electricity_consumption=450000,
        car_diesel_consumption=1800,
        car_fuel_consumption=1300,
        car_electricity_consumption=1200,
        hazardous_waste=90,
        non_hazardous_waste=180,
        turnover=110000,
        year=2022,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    # Social Metrics for Company 1
    soc_metrics_2021 = SocialMetric(
        company_id=company1.id,
        no_of_employees=100,
        male_employees=60,
        female_employees=40,
        permanent_employees=80,
        temporary_employees=20,
        full_time_employees=90,
        part_time_employees=10,
        employees_under_30=30,
        employees_30_50=50,
        employees_over_50=20,
        new_employees=10,
        employees_left=5,
        voluntary_turnover=2.5,
        involuntary_turnover=2.5,
        avg_hourly_earnings_male=20,
        avg_hourly_earnings_female=18,
        ceo_total_compensation=200000,
        median_employee_total_compensation=50000,
        CEO=1,
        pay_ratio="4:1",
        year=2021,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    soc_metrics_2022 = SocialMetric(
        company_id=company1.id,
        no_of_employees=110,
        male_employees=65,
        female_employees=45,
        permanent_employees=90,
        temporary_employees=20,
        full_time_employees=100,
        part_time_employees=10,
        employees_under_30=35,
        employees_30_50=55,
        employees_over_50=20,
        new_employees=15,
        employees_left=5,
        voluntary_turnover=2.0,
        involuntary_turnover=2.0,
        avg_hourly_earnings_male=22,
        avg_hourly_earnings_female=20,
        ceo_total_compensation=220000,
        median_employee_total_compensation=55000,
        CEO=1,
        pay_ratio="4:1",
        year=2022,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    # Governance Metrics for Company 1
    gov_metrics_2021 = GovernanceMetric(
        company_id=company1.id,
        anti_corruption={
            "introduction": True,
            "started": True,
            "maturity": True,
            "licenced": False,
        },
        anti_corruption_text="The anti corruption procedures have started",
        whistleblowing={
            "introduction": True,
            "started": True,
            "maturity": False,
            "licenced": False,
        },
        whistleblowing_text="Whistleblowing policies are being introduced",
        corporate_culture={
            "introduction": True,
            "started": True,
            "maturity": False,
            "licenced": False,
        },
        corporate_culture_text="Corporate culture initiatives for 2021 are ongoing",
        business_conduct={
            "introduction": False,
            "started": True,
            "maturity": True,
            "licenced": False,
        },
        business_conduct_text="Business conduct guidelines for 2021 are in place",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        year=2021,
    )

    gov_metrics_2022 = GovernanceMetric(
        company_id=company1.id,
        anti_corruption={
            "introduction": False,
            "started": True,
            "maturity": True,
            "licenced": False,
        },
        whistleblowing={
            "introduction": False,
            "started": True,
            "maturity": True,
            "licenced": False,
        },
        corporate_culture={
            "introduction": False,
            "started": False,
            "maturity": True,
            "licenced": False,
        },
        business_conduct={
            "introduction": False,
            "started": False,
            "maturity": True,
            "licenced": False,
        },
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        year=2022,
    )

    db.add(env_metrics_2021)
    db.add(env_metrics_2022)
    db.add(soc_metrics_2021)
    db.add(soc_metrics_2022)
    db.add(gov_metrics_2021)
    db.add(gov_metrics_2022)

    env_metrics1 = EnvironmentalMetric(
        company_id=company1.id,
        building_name="Headquarters",
        square_meters=5000.0,
        electricity_consumption=2000000.0,
        gas_consumption=800000.0,
        car_diesel_consumption=80000.0,
        car_fuel_consumption=40000.0,
        car_electricity_consumption=20000.0,
        hazardous_waste=500.0,
        non_hazardous_waste=2000.0,
        turnover=1000000.0,
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    env_metrics2 = EnvironmentalMetric(
        company_id=company1.id,
        building_name="Branch Office",
        square_meters=3000.0,
        electricity_consumption=1800000.0,
        gas_consumption=700000.0,
        car_diesel_consumption=70000.0,
        car_fuel_consumption=35000.0,
        car_electricity_consumption=18000.0,
        hazardous_waste=400.0,
        non_hazardous_waste=1800.0,
        turnover=800000.0,
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    # Create dummy social metrics for company1
    soc_metrics1 = SocialMetric(
        company_id=company1.id,
        no_of_employees=5000,
        male_employees=3000,
        female_employees=2000,
        permanent_employees=4500,
        temporary_employees=500,
        full_time_employees=4800,
        part_time_employees=200,
        employees_under_30=1000,
        employees_30_50=3000,
        employees_over_50=1000,
        new_employees=200,
        employees_left=150,
        voluntary_turnover=2.5,
        involuntary_turnover=1.0,
        avg_hourly_earnings_male=25.0,
        avg_hourly_earnings_female=23.0,
        ceo_total_compensation=500000.0,
        median_employee_total_compensation=50000.0,
        CEO=500000.0,
        pay_ratio="10:1",
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    soc_metrics2 = SocialMetric(
        company_id=company1.id,
        no_of_employees=5200,
        male_employees=3100,
        female_employees=2100,
        permanent_employees=4600,
        temporary_employees=600,
        full_time_employees=4900,
        part_time_employees=300,
        employees_under_30=1100,
        employees_30_50=3100,
        employees_over_50=1000,
        new_employees=250,
        employees_left=180,
        voluntary_turnover=2.8,
        involuntary_turnover=1.2,
        avg_hourly_earnings_male=26.0,
        avg_hourly_earnings_female=24.0,
        ceo_total_compensation=520000.0,
        median_employee_total_compensation=52000.0,
        CEO=520000.0,
        pay_ratio="10:1",
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    # Create dummy governance metrics for company1
    gov_metrics1 = GovernanceMetric(
        company_id=company1.id,
        year=2023,
        anti_corruption={
            "started": True,
            "growth": False,
            "reviewed": False,
            "licenced": False,
        },
        anti_corruption_text="Anti-corruption measures for 2023",
        whistleblowing={
            "introduction": True,
            "growth": True,
            "maturity": False,
            "licenced": False,
        },
        whistleblowing_text="Whistleblowing policies for 2023",
        corporate_culture={
            "introduction": False,
            "growth": True,
            "maturity": True,
            "licenced": False,
        },
        corporate_culture_text="Corporate culture initiatives for 2023",
        business_conduct={
            "introduction": False,
            "growth": False,
            "maturity": True,
            "licenced": False,
        },
        business_conduct_text="Business conduct guidelines for 2023",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    gov_metrics2 = GovernanceMetric(
        company_id=company1.id,
        year=2024,
        anti_corruption={
            "introduction": False,
            "growth": True,
            "maturity": False,
            "licenced": True,
        },
        whistleblowing={
            "introduction": True,
            "growth": False,
            "maturity": True,
            "licenced": False,
        },
        corporate_culture={
            "introduction": True,
            "growth": False,
            "maturity": False,
            "licenced": True,
        },
        business_conduct={
            "introduction": False,
            "growth": True,
            "maturity": False,
            "licenced": False,
        },
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    # Create dummy environmental metrics for company2
    env_metrics3 = EnvironmentalMetric(
        company_id=company2.id,
        building_name="Manufacturing Plant",
        square_meters=7000.0,
        electricity_consumption=2500000.0,
        gas_consumption=1000000.0,
        car_diesel_consumption=100000.0,
        car_fuel_consumption=50000.0,
        car_electricity_consumption=25000.0,
        hazardous_waste=700.0,
        non_hazardous_waste=3000.0,
        turnover=1500000.0,
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    env_metrics4 = EnvironmentalMetric(
        company_id=company2.id,
        building_name="Research Lab",
        square_meters=4000.0,
        electricity_consumption=2300000.0,
        gas_consumption=900000.0,
        car_diesel_consumption=90000.0,
        car_fuel_consumption=45000.0,
        car_electricity_consumption=22000.0,
        hazardous_waste=600.0,
        non_hazardous_waste=2500.0,
        turnover=1200000.0,
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    # Create dummy social metrics for company2
    soc_metrics3 = SocialMetric(
        company_id=company2.id,
        no_of_employees=5200,
        male_employees=3100,
        female_employees=2100,
        permanent_employees=4600,
        temporary_employees=600,
        full_time_employees=4900,
        part_time_employees=300,
        employees_under_30=1100,
        employees_30_50=3100,
        employees_over_50=1000,
        new_employees=250,
        employees_left=180,
        voluntary_turnover=2.8,
        involuntary_turnover=1.0,
        avg_hourly_earnings_male=25.0,
        avg_hourly_earnings_female=23.0,
        ceo_total_compensation=500000.0,
        median_employee_total_compensation=50000.0,
        CEO=1,
        pay_ratio="10:1",
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    soc_metrics4 = SocialMetric(
        company_id=company2.id,
        no_of_employees=5300,
        male_employees=3200,
        female_employees=2100,
        permanent_employees=4700,
        temporary_employees=600,
        full_time_employees=5000,
        part_time_employees=300,
        employees_under_30=1150,
        employees_30_50=3150,
        employees_over_50=1000,
        new_employees=260,
        employees_left=190,
        voluntary_turnover=2.9,
        involuntary_turnover=1.1,
        avg_hourly_earnings_male=26.0,
        avg_hourly_earnings_female=24.0,
        ceo_total_compensation=520000.0,
        median_employee_total_compensation=52000.0,
        CEO=1,
        pay_ratio="10:1",
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    # Create dummy governance metrics for company2
    gov_metrics3 = GovernanceMetric(
        company_id=company2.id,
        anti_corruption={
            "introduction": False,
            "growth": True,
            "maturity": False,
            "licenced": True,
        },
        whistleblowing={
            "introduction": True,
            "growth": False,
            "maturity": True,
            "licenced": False,
        },
        corporate_culture={
            "introduction": True,
            "growth": False,
            "maturity": False,
            "licenced": True,
        },
        business_conduct={
            "introduction": False,
            "growth": True,
            "maturity": False,
            "licenced": False,
        },
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        year=2023,
    )

    gov_metrics4 = GovernanceMetric(
        company_id=company2.id,
        anti_corruption={
            "introduction": True,
            "started": False,
            "maturity": False,
            "licenced": False,
        },
        whistleblowing={
            "introduction": True,
            "started": True,
            "maturity": False,
            "licenced": False,
        },
        corporate_culture={
            "introduction": False,
            "started": True,
            "maturity": True,
            "licenced": False,
        },
        business_conduct={
            "introduction": False,
            "started": False,
            "maturity": True,
            "licenced": False,
        },
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        year=2024,
    )

    # Create dummy environmental metrics for company3
    env_metrics5 = EnvironmentalMetric(
        company_id=company3.id,
        building_name="Tech Hub",
        square_meters=3000.0,
        electricity_consumption=1800000.0,
        gas_consumption=700000.0,
        car_diesel_consumption=70000.0,
        car_fuel_consumption=35000.0,
        car_electricity_consumption=18000.0,
        hazardous_waste=400.0,
        non_hazardous_waste=1800.0,
        turnover=800000.0,
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    env_metrics6 = EnvironmentalMetric(
        company_id=company3.id,
        building_name="Innovation Center",
        square_meters=4000.0,
        electricity_consumption=2000000.0,
        gas_consumption=800000.0,
        car_diesel_consumption=80000.0,
        car_fuel_consumption=40000.0,
        car_electricity_consumption=20000.0,
        hazardous_waste=500.0,
        non_hazardous_waste=2000.0,
        turnover=1000000.0,
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(env_metrics5)
    db.add(env_metrics6)

    # Create dummy social metrics for company3
    soc_metrics5 = SocialMetric(
        company_id=company3.id,
        no_of_employees=300,
        male_employees=180,
        female_employees=120,
        permanent_employees=250,
        temporary_employees=50,
        full_time_employees=270,
        part_time_employees=30,
        employees_under_30=90,
        employees_30_50=150,
        employees_over_50=60,
        new_employees=30,
        employees_left=20,
        voluntary_turnover=2.0,
        involuntary_turnover=1.0,
        avg_hourly_earnings_male=30.0,
        avg_hourly_earnings_female=28.0,
        ceo_total_compensation=300000.0,
        median_employee_total_compensation=60000.0,
        CEO=1,
        pay_ratio="5:1",
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    soc_metrics6 = SocialMetric(
        company_id=company3.id,
        no_of_employees=320,
        male_employees=190,
        female_employees=130,
        permanent_employees=270,
        temporary_employees=50,
        full_time_employees=290,
        part_time_employees=30,
        employees_under_30=100,
        employees_30_50=160,
        employees_over_50=60,
        new_employees=35,
        employees_left=25,
        voluntary_turnover=2.1,
        involuntary_turnover=1.1,
        avg_hourly_earnings_male=32.0,
        avg_hourly_earnings_female=30.0,
        ceo_total_compensation=320000.0,
        median_employee_total_compensation=64000.0,
        CEO=1,
        pay_ratio="5:1",
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    soc_metrics7 = SocialMetric(
        company_id=company4.id,
        no_of_employees=400,
        male_employees=240,
        female_employees=160,
        permanent_employees=350,
        temporary_employees=50,
        full_time_employees=380,
        part_time_employees=20,
        employees_under_30=120,
        employees_30_50=200,
        employees_over_50=80,
        new_employees=40,
        employees_left=30,
        voluntary_turnover=2.5,
        involuntary_turnover=1.5,
        avg_hourly_earnings_male=35.0,
        avg_hourly_earnings_female=33.0,
        ceo_total_compensation=400000.0,
        median_employee_total_compensation=70000.0,
        CEO=1,
        pay_ratio="6:1",
        year=2023,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    soc_metrics8 = SocialMetric(
        company_id=company4.id,
        no_of_employees=420,
        male_employees=250,
        female_employees=170,
        permanent_employees=370,
        temporary_employees=50,
        full_time_employees=400,
        part_time_employees=20,
        employees_under_30=130,
        employees_30_50=210,
        employees_over_50=80,
        new_employees=45,
        employees_left=35,
        voluntary_turnover=2.6,
        involuntary_turnover=1.6,
        avg_hourly_earnings_male=37.0,
        avg_hourly_earnings_female=35.0,
        ceo_total_compensation=420000.0,
        median_employee_total_compensation=74000.0,
        CEO=1,
        pay_ratio="6:1",
        year=2024,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.add(soc_metrics5)
    db.add(soc_metrics6)
    db.add(soc_metrics7)
    db.add(soc_metrics8)

    db.add(env_metrics1)
    db.add(env_metrics2)
    db.add(soc_metrics1)
    db.add(soc_metrics2)
    db.add(gov_metrics1)
    db.add(gov_metrics2)
    db.add(env_metrics3)
    db.add(env_metrics4)
    db.add(soc_metrics3)
    db.add(soc_metrics4)
    db.add(gov_metrics3)
    db.add(gov_metrics4)
    db.add(env_metrics_2021)
    db.add(env_metrics_2022)
    db.add(soc_metrics_2021)
    db.add(soc_metrics_2022)
    db.add(gov_metrics_2021)
    db.add(gov_metrics_2022)
    db.commit()

    db.close()


if __name__ == "__main__":
    populate_data()
    print("Dummy data were populated successfully.")
