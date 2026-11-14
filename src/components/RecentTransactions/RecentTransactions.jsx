import { Link } from "react-router-dom";
import "./RecentTransactions.css";

function RecentTransactions({ expenses = [], loading = false }) {
    if (loading) {
        return (
            <div className="recent-tx-card glass-card">
                <div className="recent-tx-header">
                    <h3>🕒 Recent Transactions</h3>
                </div>
                <div className="recent-tx-loading">
                    <div className="spinner"></div>
                    <span>Loading recent transactions...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-tx-card glass-card">
            <div className="recent-tx-header">
                <div>
                    <h3>🕒 Recent Transactions</h3>
                    <p className="recent-tx-subtitle">Your latest 5 expense entries</p>
                </div>
                <Link to="/expenses" className="recent-tx-view-all">
                    View All →
                </Link>
            </div>

            {expenses.length === 0 ? (
                <div className="recent-tx-empty">
                    <p>No recent transactions recorded yet.</p>
                    <Link to="/expenses/add" className="btn-primary btn-sm">
                        + Add Expense
                    </Link>
                </div>
            ) : (
                <div className="recent-tx-list">
                    {expenses.map((expense) => {
                        const formattedAmount = Number(expense.amount || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                        const formattedDate = expense.date
                            ? new Date(expense.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short"
                              })
                            : "N/A";

                        return (
                            <div key={expense._id} className="recent-tx-item">
                                <div className="recent-tx-left">
                                    <span className="recent-tx-category">{expense.category}</span>
                                    <span className="recent-tx-desc">
                                        {expense.description || "No description"}
                                    </span>
                                </div>
                                <div className="recent-tx-meta">
                                    <span className={`badge badge-${expense.paymentMethod || "cash"}`}>
                                        {expense.paymentMethod || "cash"}
                                    </span>
                                    <span className="recent-tx-date">📅 {formattedDate}</span>
                                </div>
                                <div className="recent-tx-amount">
                                    - ₹{formattedAmount}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default RecentTransactions;
