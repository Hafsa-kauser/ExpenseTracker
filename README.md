Expense Tracker

A simple full-stack expense tracker. Add, edit, and delete expenses, and see your total spending and category totals at a glance.

Features
Add an expense (amount, category, date, note)
Edit or delete existing expenses
Total spent and per-category totals (Food, Travel, Shopping, Bills)
Data saved permanently in a SQLite database
Amounts shown in Indian Rupees (₹)
Tech Stack

Frontend	React (Vite)
Backend	Python, FastAPI
Database	SQLite (expenses.db)
How to Run Locally

You need two terminals: one for the backend, one for the frontend.

1. Start the backend


# (optional but recommended) create a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# install dependencies
pip install fastapi uvicorn

# run the server
 python -m uvicorn main:app --reload

The API is now running at http://localhost:8000. Open http://localhost:8000/docs to see and test all endpoints in the browser.

If your file is not named main.py, replace main in main:app with your file name (without .py).

2. Start the frontend

npm install
npm run dev

Open the link shown in the terminal, usually http://localhost:5174.