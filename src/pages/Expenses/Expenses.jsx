import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseList from "../../components/ExpenseList/ExpenseList";
import "./Expenses.css";

function Expenses() {
    return (
        <div className="expenses-page">
            <Sidebar />

            <main className="expenses-main-content">
                <div className="expenses-header">
                    <div>
                        <h1>My Expenses</h1>
                        <p className="expenses-subtitle">
                            View, manage, edit, and filter all your recorded expenses
                        </p>
                    </div>

                    <Link to="/expenses/add" className="btn-primary">
                        + Add Expense
                    </Link>
                </div>

                <ExpenseList />
            </main>
        </div>
    );
}

export default Expenses;
