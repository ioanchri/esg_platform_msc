# ESG Reporting Tool

This project consists of a frontend built with Angular and a backend built with FastAPI.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Python](https://www.python.org/)
- [pip](https://pip.pypa.io/en/stable/)

## Initializing the Project

### Backend

1. Navigate to the `backend` directory:

   cd backend

2. Install the required Python libraries:

   pip install -r requirements.txt

3. Initialize the database:

   python create_tables.py

4. (Optional) Populate the database with dummy data:
   python populate_dummy_data.py

5. Start the FastAPI server:

   python -m uvicorn app.main:app --reload

### Frontend

1. Navigate to the `frontend` directory

   cd frontend

2. Install the required npm packages:

   npm install  

3. Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
