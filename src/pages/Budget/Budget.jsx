import Sidebar from "../../components/Sidebar/Sidebar";
import BudgetProgress from "../../components/BudgetProgress/BudgetProgress";
import "./Budget.css";

function Budget() {
    return (
        <div className="budget-page">
            <Sidebar />

            <main className="budget-main-content">
                <div className="budget-page-header">
                    <div>
                        <h1>Budget Management</h1>
                        <p className="budget-page-subtitle">
                            Set, track, and manage your overall and category-wise spending limits
                        </p>
                    </div>
                </div>

                <BudgetProgress />
            </main>
        </div>
    );
}

export default Budget;
