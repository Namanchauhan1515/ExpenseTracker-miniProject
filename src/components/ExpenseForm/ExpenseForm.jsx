import { useState } from "react";
import { createExpense } from "../../services/expenseApi";
import "./ExpenseForm.css";

const CATEGORY_PRESETS = [
    { label: "Food", emoji: "🍔" },
    { label: "Shopping", emoji: "🛍️" },
    { label: "Travel", emoji: "🚗" },
    { label: "Bills", emoji: "💡" },
    { label: "Entertainment", emoji: "🎬" },
    { label: "Health", emoji: "🏥" },
    { label: "Groceries", emoji: "🛒" },
    { label: "Other", emoji: "🏷️" }
];

function ExpenseForm({ onExpenseAdded }) {
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "cash",
        date: today
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryPreset = (categoryName) => {
        setFormData((prev) => ({
            ...prev,
            category: categoryName
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const numAmount = Number(formData.amount);
        if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount greater than 0");
            return;
        }

        if (!formData.category.trim()) {
            setError("Category is required");
            return;
        }

        try {
            setLoading(true);

            const response = await createExpense({
                amount: numAmount,
                category: formData.category.trim(),
                description: formData.description.trim(),
                paymentMethod: formData.paymentMethod,
                date: formData.date || today
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create expense");
            }

            if (onExpenseAdded) {
                onExpenseAdded(data.data);
            }
        } catch (err) {
            console.error("Create expense error:", err);
            setError(err.message || "Failed to create expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="expense-form-card glass-card">
            {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit} className="expense-form">
                <div className="form-grid">
                    {/* Amount */}
                    <div className="form-group">
                        <label htmlFor="amount">Amount (₹) *</label>
                        <div className="currency-input-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                                id="amount"
                                type="number"
                                name="amount"
                                step="any"
                                min="0"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-control currency-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Payment Method</label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                            <option value="bank">Bank</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Category Input */}
                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <input
                            id="category"
                            type="text"
                            name="category"
                            placeholder="e.g. Food, Groceries, Travel"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                {/* Category Presets */}
                <div className="category-presets-row">
                    <span className="presets-label">Quick select:</span>
                    <div className="presets-chips">
                        {CATEGORY_PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                className={`preset-chip ${
                                    formData.category.toLowerCase() === preset.label.toLowerCase()
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleCategoryPreset(preset.label)}
                            >
                                <span>{preset.emoji}</span>
                                <span>{preset.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="form-group" style={{ marginTop: 14 }}>
                    <label htmlFor="description">Description (Optional)</label>
                    <input
                        id="description"
                        type="text"
                        name="description"
                        placeholder="Add note, store name, or details..."
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary submit-expense-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Save Expense"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ExpenseForm;