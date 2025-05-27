from app.database import engine
from app.models import Base

# Drop the tables if they exist
def drop_tables():
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped successfully.")

# Create the tables
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    drop_tables()
    create_tables()
