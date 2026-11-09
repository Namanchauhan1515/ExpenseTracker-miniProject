import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ExpenseCard from "../ExpenseCard/ExpenseCard";
import { getExpenses } from "../../services/expenseApi";
import "./ExpenseList.css";

function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters matching backend query parameters exactly
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalExpenses: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                sortBy,
                order
            });

            if (category.trim()) {
                params.append("category", category.trim());
            }

            if (paymentMethod) {
                params.append("paymentMethod", paymentMethod);
            }

            if (startDate) {
                params.append("startDate", startDate);
            }

            if (endDate) {
                params.append("endDate", endDate);
            }

            const response = await getExpenses(params);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load expenses");
            }

            setExpenses(data.data?.expense || []);
            if (data.data?.pagination) {
                setPagination(data.data.pagination);
            }
        } catch (err) {
            console.error("Fetch expenses error:", err);
            setError(err.message || "Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, [page, category, paymentMethod, startDate, endDate, sortBy, order]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleDelete = (deletedId) => {
        setExpenses((prev) => prev.filter((item) => item._id !== deletedId));
        setPagination((prev) => ({
            ...prev,
            totalExpenses: Math.max(0, prev.totalExpenses - 1)
        }));
    };

    const handleUpdate = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((item) =>
                item._id === updatedExpense._id ? updatedExpense : item
            )
        );
    };

    const handleResetFilters = () => {
        setCategory("");
        setPaymentMethod("");
        setStartDate("");
        setEndDate("");
        setSortBy("createdAt");
        setOrder("desc");
        setPage(1);
    };

    const hasActiveFilters =
        Boolean(category) ||
        Boolean(paymentMethod) ||
        Boolean(startDate) ||
        Boolean(endDate) ||
        sortBy !== "createdAt" ||
        order !== "desc";

    return (
        <section className="expense-list-section">
            {/* Filter Toolbar */}
            <div className="list-toolbar glass-card">
                <div className="filters-row">
                    {/* Category Filter */}
                    <div className="filter-item">
                        <label htmlFor="filter-cat">Category</label>
                        <input
                            id="filter-cat"
                            type="text"
                            className="form-control"
                            placeholder="Filter by category..."
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Payment Method Filter */}
                    <div className="filter-item">
                        <label htmlFor="filter-pm">Payment Method</label>
                        <select
                            id="filter-pm"
                            className="form-control"
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">All Methods</option>
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                            <option value="bank">Bank</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="filter-item">
                        <label htmlFor="filter-start">From</label>
                        <input
                            id="filter-start"
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* End Date */}
                    <div className="filter-item">
                        <label htmlFor="filter-end">To</label>
                        <input
                            id="filter-end"
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <div className="filter-item">
                        <label htmlFor="filter-sort">Sort By</label>
                        <select
                            id="filter-sort"
                            className="form-control"
                            value={`${sortBy}-${order}`}
                            onChange={(e) => {
                                const [sb, ord] = e.target.value.split("-");
                                setSortBy(sb);
                                setOrder(ord);
                                setPage(1);
                            }}
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="amount-desc">Amount: High to Low</option>
                            <option value="amount-asc">Amount: Low to High</option>
                            <option value="date-desc">Expense Date: Recent</option>
                            <option value="date-asc">Expense Date: Oldest</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <div className="filter-item filter-reset-item">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleResetFilters}
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                <div className="toolbar-status">
                    <span>
                        Total Expenses: <strong>{pagination.totalExpenses}</strong>
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            {/* Loading State */}
            {loading && (
                <div className="list-loading">
                    <div className="spinner"></div>
                    <span>Loading expenses...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && expenses.length === 0 && (
                <div className="empty-state glass-card">
                    <div className="empty-icon">💸</div>
                    <h3>No expenses found</h3>
                    <p>
                        {hasActiveFilters
                            ? "No expenses matched your filter criteria."
                            : "You haven't recorded any expenses yet."}
                    </p>
                    <Link to="/expenses/add" className="btn-primary" style={{ marginTop: 16 }}>
                        + Add Your First Expense
                    </Link>
                </div>
            )}

            {/* Expense Cards */}
            {!loading && expenses.length > 0 && (
                <div className="expense-cards-container">
                    {expenses.map((expense) => (
                        <ExpenseCard
                            key={expense._id}
                            expense={expense}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination-bar">
                    <button
                        type="button"
                        className="btn-secondary"
                        disabled={!pagination.hasPreviousPage}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        ← Previous
                    </button>

                    <span className="pagination-text">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        className="btn-secondary"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </section>
    );
}

export default ExpenseList;