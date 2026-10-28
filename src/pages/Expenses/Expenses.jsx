import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseList from "../../components/ExpenseList/ExpenseList";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";

function Expenses() {
   const [newExpense, setNewExpense] = useState(null);
   const [editingExpense, setEditingExpense] = useState(null);
const handleExpenseAdded = (expenseData) => {
    console.log("New Expense:", expenseData);
    setNewExpense(expenseData);
};

    return (
        <div className="expenses-page">

            <Sidebar />

         <main>
                <h1>My Expenses</h1>

     <ExpenseForm onExpenseAdded={handleExpenseAdded} editingExpense={editingExpense}
/>
  <ExpenseList newExpense={newExpense} onEdit={setEditingExpense}/>          
  </main>

        </div>
    );
}

export default Expenses;
