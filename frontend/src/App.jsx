import React, { useEffect, useState } from "react";
import "./App.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
function App() {
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("Food");
const [date, setDate] = useState("2026-09-30");
const [note, setNote] = useState("");

const [expenses, setExpenses] = useState([]);
const [editId, setEditId] = useState(null);

useEffect(function () {
getExpenses();
}, []);

function getExpenses() {
fetch(API_URL + "/expenses")
.then(function (response) {
return response.json();
})
.then(function (data) {
setExpenses(data);
})
.catch(function (error) {
console.log(error);
});
}

function handleSubmit(event) {
event.preventDefault();

if (amount === "" || date === "") {
alert("Please enter amount and date");
return;
}

if (editId !== null) {
updateExpense();
} else {
addExpense();
}
}

function addExpense() {
const url =
API_URL + "/expenses"+
"amount=" +
encodeURIComponent(amount) +
"&category=" +
encodeURIComponent(category) +
"&date=" +
encodeURIComponent(date) +
"&note=" +
encodeURIComponent(note);

fetch(url, {
method: "POST"
})
.then(function (response) {
if (!response.ok) {
throw new Error("Could not add expense");
}

return response.json();
})
.then(function () {
getExpenses();
clearForm();
})
.catch(function (error) {
console.log(error);
alert("Could not add expense: " + error.message);
});
}

function updateExpense() {
const url =
API_URL + "/expenses"+
editId +
"?" +
"amount=" +
encodeURIComponent(amount) +
"&category=" +
encodeURIComponent(category) +
"&date=" +
encodeURIComponent(date) +
"&note=" +
encodeURIComponent(note);

fetch(url, {
method: "PUT"
})
.then(function (response) {
if (!response.ok) {
throw new Error("Could not update expense");
}

return response.json();
})
.then(function () {
getExpenses();
clearForm();
})
.catch(function (error) {
console.log(error);
alert("Could not update expense: " + error.message);
});
}

function editExpense(expense) {
setEditId(expense.id);
setAmount(expense.amount);
setCategory(expense.category);
setDate(expense.date);
setNote(expense.note);
}

function deleteExpense(id) {
const confirmDelete = window.confirm("Delete this expense?");

if (!confirmDelete) {
return;
}

fetch(API_URL + "/expenses" + id, {
method: "DELETE"
})
.then(function (response) {
return response.json();
})
.then(function () {
getExpenses();
})
.catch(function (error) {
console.log(error);
});
}

function clearForm() {
setAmount("");
setCategory("");
setDate("");
setNote("");
setEditId(null);
}

function calculateTotal() {
let total = 0;

expenses.forEach(function (expense) {
total = total + expense.amount;
});

return total;
}

function calculateCategoryTotal(categoryName) {
let total = 0;

expenses.forEach(function (expense) {
if (expense.category === categoryName) {
total = total + expense.amount;
}
});

return total;
}

function formatDate(dateValue) {
const dateObject = new Date(dateValue);

const options = {
month: "short",
day: "numeric"
};

return dateObject.toLocaleDateString("en-US", options);
}

return (
<div className="app">
<header className="header">
<div>
<h1>Expense Tracker</h1>
</div>
</header>

<main className="container">
<div className="topSection">

<div className="expenseFormCard">
<form onSubmit={handleSubmit}>

<div className="formgroup">
<label>Amount</label>

<div className="amountInput">
₹
<input
type="number"
placeholder="1,250"
value={amount}
onChange={function (event) {
setAmount(event.target.value);
}}
/>
</div>
</div>

<div className="formgroup">
<label>Category</label>

<select
value={category}
onChange={function (event) {
setCategory(event.target.value);
}}
>
<option value="Food">Food</option>
<option value="Travel">Travel</option>
<option value="Shopping">Shopping</option>
<option value="Bills">Bills</option>
<option value="Entertainment">Entertainment</option>
<option value="Other">Other</option>
</select>
</div>

<div className="formgroup">
<label>Date</label>

<input
type="date"
value={date}
onChange={function (event) {
setDate(event.target.value);
}}
/>
</div>

<div className="formgroup">
<label>Note</label>

<input
type="text"
placeholder="Lunch with friends"
value={note}
onChange={function (event) {
setNote(event.target.value);
}}
/>
</div>

<button
className="addButton"
type="submit"
>
{editId !== null
? "Update Expense"
: "+ Add Expense"}
</button>

{editId !== null && (
<button
className="cancelButton"
type="button"
onClick={clearForm}
>
Cancel
</button>
)}

</form>
</div>

<div className="summaryCard">
<h2>Monthly Summary</h2>

<div className="totalBox">
<p>Total Spent</p>

<h3>
₹{calculateTotal().toLocaleString("en-IN")}
</h3>
</div>

<div className="expenseCount">
<span>Monthly Expenses</span>

<strong>
{expenses.length}
</strong>
</div>

<div className="categoryList">

<div className="categoryRow">
<span>
<span className="dot food"></span>
Food
</span>

<strong>
₹
{calculateCategoryTotal("Food").toLocaleString("en-IN")}
</strong>
</div>

<div className="categoryRow">
<span>
<span className="dot travel"></span>
Travel
</span>

<strong>
₹
{calculateCategoryTotal("Travel").toLocaleString("en-IN")}
</strong>
</div>

<div className="categoryRow">
<span>
<span className="dot shopping"></span>
Shopping
</span>

<strong>
₹
{calculateCategoryTotal("Shopping").toLocaleString("en-IN")}
</strong>
</div>

<div className="categoryRow">
<span>
<span className="dot bills"></span>
Bills
</span>

<strong>
₹
{calculateCategoryTotal("Bills").toLocaleString("en-IN")}
</strong>
</div>

</div>
</div>

</div>

<div className="expensesSection">

<div className="sectionTitle">
<div>
<h2>Expenses</h2>
<p>Your recent transactions</p>
</div>

<span className="expenseNumber">
{expenses.length} expenses
</span>
</div>

<div className="expenseTable">

<div className="tableHeader">
<div>Date</div>
<div>Category</div>
<div>Note</div>
<div>Amount</div>
<div>Actions</div>
</div>

{expenses.map(function (expense) {
return (
<div
className="tableRow"
key={expense.id}
>

<div className="date">
{formatDate(expense.date)}
</div>

<div>
<span className="categoryBadge">
{expense.category}
</span>
</div>

<div className="note">
{expense.note || "No note"}
</div>

<div className="expenseAmount">
₹
{expense.amount.toLocaleString("en-IN")}
</div>

<div className="actions">

<button
className="editButton"
type="button"
onClick={function () {
editExpense(expense);
}}
>
Edit
</button>

<button
className="deleteButton"
type="button"
onClick={function () {
deleteExpense(expense.id);
}}
>
Delete
</button>

</div>
</div>
);
})}

{expenses.length === 0 && (
<div className="emptyState">
No expenses found.
</div>
)}

</div>
</div>

</main>
</div>
);
}

export default App;