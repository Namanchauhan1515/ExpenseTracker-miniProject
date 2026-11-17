import { useState, useEffect, useCallback } from "react";
import {
    getMonthlyBudget,
    saveMonthlyBudget,
    deleteMonthlyBudget
} from "../../services/budgetApi";
import "./BudgetProgress.css";

const CATEGORY_PRESETS = [
    "Food",
    "Shopping",
    "Travel",
    "Bills",
    "Entertainment",
    "Health",
    "Groceries",
    "Other"
];

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function BudgetProgress({ onBudgetChange }) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state for managing/setting budget
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSaving, setModalSaving] = useState(false);

    // Form fields in modal
    const [totalBudgetInput, setTotalBudgetInput] = useState("");
    const [categoryInputs, setCategoryInputs] = useState([]);

    const fetchBudget = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getMonthlyBudget(selectedMonth, selectedYear);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load budget");
            }

            setBudgetData(data.data);
            if (onBudgetChange) {
                onBudgetChange(data.data);
            }
        } catch (err) {
            console.error("Budget fetch error:", err);
            setError(err.message || "Failed to load budget data");
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear, onBudgetChange]);

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);

    // Open modal populated with current budget or default state
    const handleOpenModal = () => {
        setModalError("");
        if (budgetData?.budget) {
            setTotalBudgetInput(String(budgetData.budget.totalBudget || ""));
            setCategoryInputs(
                (budgetData.budget.categoryBudgets || []).map((cb) => ({
                    category: cb.category,
                    amount: String(cb.amount)
                }))
            );
        } else {
            setTotalBudgetInput("");
            setCategoryInputs([
                { category: "Food", amount: "" },
                { category: "Shopping", amount: "" }
            ]);
        }
        setIsModalOpen(true);
    };

    const handleAddCategoryRow = () => {
        setCategoryInputs((prev) => [...prev, { category: "", amount: "" }]);
    };

    const handleCategoryChange = (index, field, value) => {
        setCategoryInputs((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveCategoryRow = (index) => {
        setCategoryInputs((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        setModalError("");

        const totalNum = Number(totalBudgetInput);
        if (totalBudgetInput === "" || isNaN(totalNum) || totalNum < 0) {
            setModalError("Please enter a valid overall budget amount (0 or more)");
            return;
        }

        const validCategories = [];
        for (const cat of categoryInputs) {
            if (cat.category.trim()) {
                const amt = Number(cat.amount);
                if (isNaN(amt) || amt < 0) {
                    setModalError(`Invalid amount for category "${cat.category}"`);
                    return;
                }
                validCategories.push({
                    category: cat.category.trim(),
                    amount: amt
                });
            }
        }

        try {
            setModalSaving(true);
            const payload = {
                month: selectedMonth,
                year: selectedYear,
                totalBudget: totalNum,
                categoryBudgets: validCategories
            };

            const res = await saveMonthlyBudget(payload);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save budget");
            }

            setIsModalOpen(false);
            await fetchBudget();
        } catch (err) {
            console.error("Save budget error:", err);
            setModalError(err.message || "Failed to save budget. Please try again.");
        } finally {
            setModalSaving(false);
        }
    };

    const handleDeleteBudget = async () => {
        if (!budgetData?.budget?._id) return;
        if (!window.confirm("Are you sure you want to remove the budget for this month?")) {
            return;
        }

        try {
            setModalSaving(true);
            const res = await deleteMonthlyBudget(budgetData.budget._id);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to delete budget");
            }

            setIsModalOpen(false);
            await fetchBudget();
        } catch (err) {
            console.error("Delete budget error:", err);
            setModalError(err.message || "Failed to delete budget");
        } finally {
            setModalSaving(false);
        }
    };

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear((y) => y - 1);
        } else {
            setSelectedMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear((y) => y + 1);
        } else {
            setSelectedMonth((m) => m + 1);
        }
    };

    const overall = budgetData?.overall || {
        totalBudget: 0,
        totalSpent: 0,
        remaining: 0,
        overspentAmount: 0,
        percentage: 0,
        isWarning: false,
        isExceeded: false
    };

    const hasBudget = Boolean(budgetData?.budget && budgetData.budget.totalBudget > 0);
    const categoryBreakdown = budgetData?.categoryBreakdown || [];

    const formatCurrency = (amt) =>
        Number(amt || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    return (
        <section className="budget-section glass-card">
            {/* Header with Month Selector and Manage Button */}
            <div className="budget-header">
                <div className="budget-title-area">
                    <span className="budget-badge-label">Budget Management</span>
                    <h2 className="budget-heading">🎯 Monthly Budget & Limits</h2>
                </div>

                <div className="budget-controls">
                    <div className="budget-month-nav">
                        <button
                            type="button"
                            className="btn-month-nav"
                            onClick={handlePrevMonth}
                            title="Previous Month"
                        >
                            ‹
                        </button>
                        <span className="current-month-display">
                            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                        </span>
                        <button
                            type="button"
                            className="btn-month-nav"
                            onClick={handleNextMonth}
                            title="Next Month"
                        >
                            ›
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={handleOpenModal}
                    >
                        {hasBudget ? "⚙️ Manage Budget" : "➕ Set Budget"}
                    </button>
                </div>
            </div>

            {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            {loading ? (
                <div className="budget-loading">
                    <div className="spinner"></div>
                    <span>Checking budget & spending status...</span>
                </div>
            ) : !hasBudget && overall.totalSpent === 0 ? (
                /* Empty state when no budget and no expenses */
                <div className="budget-empty-card">
                    <div className="budget-empty-icon">🎯</div>
                    <h3>No budget set for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}</h3>
                    <p>
                        Stay in control of your finances by setting monthly limits and tracking your spending.
                    </p>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleOpenModal}
                        style={{ marginTop: 12 }}
                    >
                        + Set Monthly Budget
                    </button>
                </div>
            ) : (
                <>
                    {/* Warning Alerts */}
                    {overall.isExceeded && (
                        <div className="budget-alert alert-exceeded">
                            <span className="alert-icon">🚨</span>
                            <div className="alert-content">
                                <strong>Budget Exceeded!</strong>
                                <span>
                                    You have exceeded your monthly budget by ₹
                                    {formatCurrency(overall.overspentAmount)} (
                                    {overall.percentage}% used).
                                </span>
                            </div>
                        </div>
                    )}

                    {overall.isWarning && (
                        <div className="budget-alert alert-warning">
                            <span className="alert-icon">⚠️</span>
                            <div className="alert-content">
                                <strong>Budget Warning: High Spending!</strong>
                                <span>
                                    You have reached {overall.percentage}% of your monthly budget. Only ₹
                                    {formatCurrency(overall.remaining)} remaining.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Overall Summary Cards */}
                    <div className="budget-summary-grid">
                        <div className="budget-stat-card">
                            <span className="stat-label">Total Budget</span>
                            <span className="stat-value">₹{formatCurrency(overall.totalBudget)}</span>
                            <span className="stat-subtext">Allocated for {MONTH_NAMES[selectedMonth - 1]}</span>
                        </div>

                        <div className="budget-stat-card">
                            <span className="stat-label">Amount Spent</span>
                            <span className="stat-value spent-value">
                                ₹{formatCurrency(overall.totalSpent)}
                            </span>
                            <span className="stat-subtext">
                                {overall.totalBudget > 0
                                    ? `${overall.percentage}% of total budget`
                                    : "No budget limit set"}
                            </span>
                        </div>

                        <div className="budget-stat-card">
                            <span className="stat-label">
                                {overall.isExceeded ? "Overspent" : "Remaining"}
                            </span>
                            <span
                                className={`stat-value ${
                                    overall.isExceeded
                                        ? "danger-value"
                                        : overall.isWarning
                                        ? "warning-value"
                                        : "success-value"
                                }`}
                            >
                                ₹
                                {formatCurrency(
                                    overall.isExceeded ? overall.overspentAmount : overall.remaining
                                )}
                            </span>
                            <span className="stat-subtext">
                                {overall.isExceeded ? "Crossed limit" : "Available to spend"}
                            </span>
                        </div>
                    </div>

                    {/* Overall Progress Bar */}
                    {overall.totalBudget > 0 && (
                        <div className="overall-progress-card">
                            <div className="progress-header">
                                <span className="progress-title">Overall Budget Utilization</span>
                                <span
                                    className={`progress-pct-badge ${
                                        overall.isExceeded
                                            ? "badge-exceeded"
                                            : overall.isWarning
                                            ? "badge-warning"
                                            : "badge-normal"
                                    }`}
                                >
                                    {overall.percentage}%
                                </span>
                            </div>

                            <div className="progress-track">
                                <div
                                    className={`progress-fill ${
                                        overall.isExceeded
                                            ? "fill-exceeded"
                                            : overall.isWarning
                                            ? "fill-warning"
                                            : "fill-normal"
                                    }`}
                                    style={{ width: `${Math.min(100, overall.percentage)}%` }}
                                />
                            </div>

                            <div className="progress-footer">
                                <span>₹0</span>
                                <span>Limit: ₹{formatCurrency(overall.totalBudget)}</span>
                            </div>
                        </div>
                    )}

                    {/* Category-wise Budgets */}
                    {categoryBreakdown.length > 0 && (
                        <div className="category-budgets-container">
                            <h3 className="category-budgets-title">Category-wise Budgets</h3>
                            <div className="category-budget-list">
                                {categoryBreakdown.map((cat) => {
                                    const hasCatBudget = cat.budget > 0;
                                    return (
                                        <div key={cat.category} className="cat-budget-row">
                                            <div className="cat-budget-info">
                                                <div className="cat-budget-name-row">
                                                    <span className="cat-name">{cat.category}</span>
                                                    {cat.isExceeded && (
                                                        <span className="cat-tag tag-exceeded">
                                                            Exceeded
                                                        </span>
                                                    )}
                                                    {cat.isWarning && (
                                                        <span className="cat-tag tag-warning">
                                                            Near Limit
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="cat-budget-amounts">
                                                    <span>
                                                        Spent: <strong>₹{formatCurrency(cat.spent)}</strong>
                                                    </span>
                                                    {hasCatBudget && (
                                                        <span>
                                                            Budget: <strong>₹{formatCurrency(cat.budget)}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {hasCatBudget ? (
                                                <div className="cat-progress-wrapper">
                                                    <div className="cat-progress-track">
                                                        <div
                                                            className={`cat-progress-fill ${
                                                                cat.isExceeded
                                                                    ? "fill-exceeded"
                                                                    : cat.isWarning
                                                                    ? "fill-warning"
                                                                    : "fill-normal"
                                                            }`}
                                                            style={{
                                                                width: `${Math.min(100, cat.percentage)}%`
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="cat-pct-label">
                                                        {cat.percentage}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="cat-no-budget">
                                                    <span>No category limit</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal Dialog for Setting / Updating Budget */}
            {isModalOpen && (
                <div className="budget-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="budget-modal-content glass-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="budget-modal-header">
                            <div>
                                <h3>
                                    {hasBudget ? "Update Budget" : "Set Monthly Budget"}
                                </h3>
                                <p className="budget-modal-subtitle">
                                    For {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {modalError && (
                            <div className="alert-error" style={{ marginBottom: 16 }}>
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSaveBudget} className="budget-form">
                            {/* Overall Monthly Budget */}
                            <div className="form-group">
                                <label htmlFor="overall-budget">
                                    Overall Monthly Budget (₹) *
                                </label>
                                <div className="currency-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input
                                        id="overall-budget"
                                        type="number"
                                        min="0"
                                        step="any"
                                        className="form-control currency-input"
                                        placeholder="e.g. 50000"
                                        value={totalBudgetInput}
                                        onChange={(e) => setTotalBudgetInput(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category Budgets */}
                            <div className="category-budget-editor">
                                <div className="editor-header">
                                    <label>Category-wise Limits (Optional)</label>
                                    <button
                                        type="button"
                                        className="btn-add-cat"
                                        onClick={handleAddCategoryRow}
                                    >
                                        + Add Category
                                    </button>
                                </div>

                                <div className="category-rows-container">
                                    {categoryInputs.map((row, idx) => (
                                        <div key={idx} className="cat-input-row">
                                            <input
                                                type="text"
                                                className="form-control cat-name-input"
                                                placeholder="Category (e.g. Food)"
                                                value={row.category}
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        idx,
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                                list="cat-presets"
                                            />
                                            <div className="currency-input-wrapper cat-amount-wrapper">
                                                <span className="currency-symbol">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    className="form-control currency-input"
                                                    placeholder="Limit (₹)"
                                                    value={row.amount}
                                                    onChange={(e) =>
                                                        handleCategoryChange(
                                                            idx,
                                                            "amount",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-remove-row"
                                                onClick={() => handleRemoveCategoryRow(idx)}
                                                title="Remove Category"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <datalist id="cat-presets">
                                        {CATEGORY_PRESETS.map((p) => (
                                            <option key={p} value={p} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="budget-modal-actions">
                                {hasBudget && (
                                    <button
                                        type="button"
                                        className="btn-danger btn-sm"
                                        onClick={handleDeleteBudget}
                                        disabled={modalSaving}
                                    >
                                        Delete Budget
                                    </button>
                                )}

                                <div className="actions-right">
                                    <button
                                        type="button"
                                        className="btn-secondary btn-sm"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={modalSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary btn-sm"
                                        disabled={modalSaving}
                                    >
                                        {modalSaving ? "Saving..." : "Save Budget"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default BudgetProgress;
