import { useState } from "react";
import "./App.css";

function App(){
  const [title,setTitle] = useState('');
  const [amount,setAmount]= useState('');
  const [expenses,setExpenses] = useState([]);

  const handleExpenseAdd = ()=>{
    if(title.trim()===''||amount.trim()==='') return;
    setExpenses(prev=>[...prev,{id:Date.now(),title:title,amount:Number(amount)}])
    setTitle('');
    setAmount('');
  }

  function handleDelete(DeleteExpenseId){
    setExpenses(prev=>prev.filter((expense)=>expense.id!==DeleteExpenseId))
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
                <li className="expense-item" key={expense.id}>
                  <strong>{expense.title}</strong>: ₹{expense.amount}
                  <button className="delete-button" onClick={()=>handleDelete(expense.id)}>Delete</button>
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