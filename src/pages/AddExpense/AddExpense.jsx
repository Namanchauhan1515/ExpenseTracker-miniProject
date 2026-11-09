import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import "./AddExpense.css";

function AddExpense() {
    const navigate = useNavigate();

    const handleExpenseAdded = (expenseData) => {
        console.log("New Expense created:", expenseData);
        navigate("/expenses");
    };

    return (
        <div className="add-expense-page">
            <Sidebar />

            <main className="add-expense-main-content">
                <div className="add-expense-header">
                    <div>
                        <div className="breadcrumb">
                            <Link to="/expenses" className="breadcrumb-link">
                                ← Back to Expenses
                            </Link>
                        </div>
                        <h1>Add Expense</h1>
                        <p className="add-expense-subtitle">
                            Enter the details of your new transaction below
                        </p>
                    </div>
                </div>

                <div className="add-expense-form-container">
                    <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                </div>
            </main>
        </div>
    );
}

export default AddExpense;