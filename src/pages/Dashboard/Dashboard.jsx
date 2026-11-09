import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import { getDashboardSummary } from "../../services/dashboardApi";
import "./Dashboard.css";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalAmount: 0,
        averageAmount: 0,
        highestExpense: 0,
        lowestExpense: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getDashboardSummary();

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch summary"
                    );
                }

                setSummary(data.data.summary);
            } catch (err) {
                console.error("Summary error:", err);
                setError(err.message || "Failed to load dashboard summary");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main-content">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Overview of your overall financial spending
                        </p>
                    </div>

                    <Link to="/expenses/add" className="btn-primary">
                        + Add Expense
                    </Link>
                </div>

                {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="spinner"></div>
                        <span>Loading summary...</span>
                    </div>
                ) : (
                    <section className="summary-section">
                        <SummaryCard
                            title="Total Expense"
                            amount={summary.totalAmount}
                        />

                        <SummaryCard
                            title="Average Expense"
                            amount={summary.averageAmount}
                        />

                        <SummaryCard
                            title="Highest Expense"
                            amount={summary.highestExpense}
                        />

                        <SummaryCard
                            title="Lowest Expense"
                            amount={summary.lowestExpense}
                        />
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;