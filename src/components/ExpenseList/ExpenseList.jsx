import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseList from "../../components/ExpenseList/ExpenseList";

function Expenses() {

    return (
        <div className="expenses-page">

            <Sidebar />

            <main>

                <h1>My Expenses</h1>

                <Link to="/expenses/add">
                    <button>
                        Add Expense
                    </button>
                </Link>

                <ExpenseList />

            </main>

        </div>
    );
}

export default Expenses;