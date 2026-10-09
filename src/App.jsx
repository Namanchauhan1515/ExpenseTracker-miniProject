import { useState } from "react";
import { createExpense, deleteExpense } from "./api/expenseApi.js";
import "./App.css";

function App(){
  const [title,setTitle] = useState('');
  const [amount,setAmount]= useState('');
  const [expenses,setExpenses] = useState([]);

  async function handleExpenseAdd() {
  if (title.trim() === "" || amount.trim() === "") return;

  try {
    const data = await createExpense({
      title,
      amount: Number(amount)
    });

    setExpenses(prev => [...prev, data.data]);

    setTitle("");
    setAmount("");

  } catch (error) {
    console.error("Error adding expense:", error.message);
  }
}
async function handleDelete(id) {
  try {
    await deleteExpense(id);

    setExpenses(prev =>
      prev.filter(expense => expense._id !== id)
    );

  } catch (error) {
    console.error(error.message);
  }
}

    const total = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

     return(
      <div className="expense-tracker">
        <div className="expense-card">
          <h1 className="app-title">Expense Tracker</h1>
          <div className="input-group">
            <input className="expense-input" type="text" placeholder="Enter the title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input className="expense-input" type="number" placeholder="Enter the amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
          </div>
          <button className="add-button" onClick={()=>{handleExpenseAdd()}}>Add Expense</button>

          {
            <ul className="expense-list">{
              expenses.map((expense)=>(
                <li className="expense-item" key={expense._id}>
                  <strong>{expense.title}</strong>: ₹{expense.amount}
                  <button className="delete-button" onClick={()=>handleDelete(expense._id)}>Delete</button>
                </li>
              ))
            }</ul>
          }

          <h1 className="total-expense">Total Expense: ₹{total}</h1>
        </div>
      </div>
    )
}
export default App;