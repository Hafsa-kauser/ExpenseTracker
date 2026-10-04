from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:3000",
           "http://localhost:5173",
           "https://expense-tracker-hazel-sigma-30.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = os.path.join(
    os.path.dirname(__file__),
    "expenses.db"
)


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


# Create database/table
def create_table():
    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            note TEXT
        )
    """)

    connection.commit()
    connection.close()


create_table()


# GET all expenses
@app.get("/expenses")
def get_expenses():

    connection = get_db()

    expenses = connection.execute("""
        SELECT id, amount, category, date, note
        FROM expenses
        ORDER BY date DESC, id DESC
    """).fetchall()

    connection.close()

    return [dict(expense) for expense in expenses]


# ADD expense
@app.post("/expenses")
def add_expense(
    amount: float,
    category: str,
    date: str,
    note: str = ""
):

    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

    connection = get_db()

    cursor = connection.execute("""
        INSERT INTO expenses
        (amount, category, date, note)
        VALUES (?, ?, ?, ?)
    """, (amount, category, date, note))

    connection.commit()

    expense_id = cursor.lastrowid

    expense = connection.execute("""
        SELECT id, amount, category, date, note
        FROM expenses
        WHERE id = ?
    """, (expense_id,)).fetchone()

    connection.close()

    return dict(expense)


# UPDATE expense
@app.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    amount: float,
    category: str,
    date: str,
    note: str = ""
):

    connection = get_db()

    existing = connection.execute(
        "SELECT id FROM expenses WHERE id = ?",
        (expense_id,)
    ).fetchone()

    if existing is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    connection.execute("""
        UPDATE expenses
        SET amount = ?,
            category = ?,
            date = ?,
            note = ?
        WHERE id = ?
    """, (amount, category, date, note, expense_id))

    connection.commit()

    expense = connection.execute("""
        SELECT id, amount, category, date, note
        FROM expenses
        WHERE id = ?
    """, (expense_id,)).fetchone()

    connection.close()

    return dict(expense)


# DELETE expense
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):

    connection = get_db()

    existing = connection.execute(
        "SELECT id FROM expenses WHERE id = ?",
        (expense_id,)
    ).fetchone()

    if existing is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    connection.execute(
        "DELETE FROM expenses WHERE id = ?",
        (expense_id,)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Expense deleted successfully"
    }