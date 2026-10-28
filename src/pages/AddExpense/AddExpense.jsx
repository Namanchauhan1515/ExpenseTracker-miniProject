import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";

function AddExpense() {

    const navigate = useNavigate();

    const handleExpenseAdded = (expenseData) => {

        console.log("New Expense:", expenseData);

        navigate("/expenses");
    };

    return (
        <div className="add-expense-page">

            <Sidebar />

            <main>

                <h1>Add Expense</h1>

                <ExpenseForm
                    onExpenseAdded={handleExpenseAdded}
                />

            </main>

        </div>
    );
}

export default AddExpense;