import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import DateFilter from "../../components/DateFilter/DateFilter";
import MonthlyBarChart from "../../components/Charts/MonthlyBarChart";
import CategoryPieChart from "../../components/Charts/CategoryPieChart";
import DailyTrendChart from "../../components/Charts/DailyTrendChart";
import PaymentMethodChart from "../../components/Charts/PaymentMethodChart";
import MonthComparison from "../../components/MonthComparison/MonthComparison";
import RecentTransactions from "../../components/RecentTransactions/RecentTransactions";
import { getDashboardSummary } from "../../services/dashboardApi";
import { getExpenses } from "../../services/expenseApi";
import "./Dashboard.css";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalAmount: 0,
        averageAmount: 0,
        highestExpense: 0,
        lowestExpense: 0
    });
    const [categoryWise, setCategoryWise] = useState([]);
    const [paymentMethodWise, setPaymentMethodWise] = useState([]);
    const [monthlySpending, setMonthlySpending] = useState([]);
    const [dailySpending, setDailySpending] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);

    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [loading, setLoading] = useState(true);
    const [recentLoading, setRecentLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSummary = useCallback(async (filter) => {
        try {
            setLoading(true);
            setError("");

            const response = await getDashboardSummary(filter || {});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch summary");
            }

            if (data.data) {
                setSummary(data.data.summary || {
                    totalAmount: 0,
                    averageAmount: 0,
                    highestExpense: 0,
                    lowestExpense: 0
                });
                setCategoryWise(data.data.categoryWise || []);
                setPaymentMethodWise(data.data.paymentMethodWise || []);
                setMonthlySpending(data.data.monthlySpending || []);
                setDailySpending(data.data.dailySpending || []);
            }
        } catch (err) {
            console.error("Dashboard summary error:", err);
            setError(err.message || "Failed to load dashboard summary");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecentExpenses = useCallback(async () => {
        try {
            setRecentLoading(true);
            const params = new URLSearchParams({
                page: "1",
                limit: "5",
                sortBy: "date",
                order: "desc"
            });
            const res = await getExpenses(params);
            const data = await res.json();
            if (res.ok && data.data?.expense) {
                setRecentExpenses(data.data.expense);
            }
        } catch (err) {
            console.error("Fetch recent expenses error:", err);
        } finally {
            setRecentLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary(dateRange);
    }, [fetchSummary, dateRange]);

    useEffect(() => {
        fetchRecentExpenses();
    }, [fetchRecentExpenses]);

    const handleDateFilterChange = (newRange) => {
        setDateRange(newRange);
    };

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main-content">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Financial Analytics Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Real-time analytics and breakdown of your spending habits
                        </p>
                    </div>

                    <div className="dashboard-header-actions">
                        <Link to="/expenses/add" className="btn-primary">
                            + Add Expense
                        </Link>
                    </div>
                </div>

                {/* Date Filter Toolbar */}
                <div className="dashboard-filter-bar glass-card">
                    <span className="filter-bar-label">Time Period:</span>
                    <DateFilter onFilterChange={handleDateFilterChange} />
                </div>

                {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="spinner"></div>
                        <span>Calculating analytics...</span>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
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

                        {/* Month-over-Month Comparison */}
                        <MonthComparison monthlySpending={monthlySpending} />

                        {/* Charts Grid */}
                        <section className="charts-grid">
                            <MonthlyBarChart data={monthlySpending} />
                            <CategoryPieChart data={categoryWise} />
                            <DailyTrendChart data={dailySpending} />
                            <PaymentMethodChart data={paymentMethodWise} />
                        </section>

                        {/* Recent Transactions */}
                        <RecentTransactions
                            expenses={recentExpenses}
                            loading={recentLoading}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
