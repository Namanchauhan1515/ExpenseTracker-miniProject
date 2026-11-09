import { useState } from "react";
import { getExpenseById, updateExpense, deleteExpense } from "../../services/expenseApi";
import "./ExpenseCard.css";

function ExpenseCard({ expense, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailExpense, setDetailExpense] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    const handleViewDetails = async () => {
        setShowDetailModal(true);
        setDetailLoading(true);
        setDetailError("");
        try {
            const response = await getExpenseById(expense._id);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch expense details");
            }

            setDetailExpense(data.data);
        } catch (err) {
            console.error("Fetch expense by ID error:", err);
            setDetailError(err.message || "Failed to load expense details");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setDetailError("");
    };

    const [formData, setFormData] = useState({
        amount: expense.amount,
        category: expense.category,
        description: expense.description || "",
        paymentMethod: expense.paymentMethod || "cash",
        date: expense.date
            ? new Date(expense.date).toISOString().split("T")[0]
            : ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setError("");
        setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description || "",
            paymentMethod: expense.paymentMethod || "cash",
            date: expense.date
                ? new Date(expense.date).toISOString().split("T")[0]
                : ""
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setError("");
        setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description || "",
            paymentMethod: expense.paymentMethod || "cash",
            date: expense.date
                ? new Date(expense.date).toISOString().split("T")[0]
                : ""
        });
        setIsEditing(false);
    };

    const handleUpdate = async () => {
        setError("");

        const numAmount = Number(formData.amount);
        if (formData.amount === "" || isNaN(numAmount) || numAmount < 0) {
            setError("Amount must be a valid non-negative number");
            return;
        }

        if (!formData.category.trim()) {
            setError("Category cannot be empty");
            return;
        }

        try {
            setLoading(true);

            const response = await updateExpense(expense._id, {
                amount: numAmount,
                category: formData.category.trim(),
                description: formData.description.trim(),
                paymentMethod: formData.paymentMethod,
                date: formData.date
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update expense");
            }

            if (onUpdate) {
                onUpdate(data.data);
            }

            setIsEditing(false);
        } catch (err) {
            console.error("Update expense error:", err);
            setError(err.message || "Could not update expense");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);

            const response = await deleteExpense(expense._id);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete expense");
            }

            if (onDelete) {
                onDelete(expense._id);
            }
        } catch (err) {
            console.error("Delete expense error:", err);
            alert(err.message || "Failed to delete expense");
            setLoading(false);
        }
    };

    const formattedAmount = Number(expense.amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formattedDate = expense.date
        ? new Date(expense.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
          })
        : "N/A";

    // ==========================================
    // INLINE EDIT MODE
    // ==========================================
    if (isEditing) {
        return (
            <div className="expense-card expense-card-editing">
                <div className="edit-card-title">
                    <h4>Editing Expense</h4>
                </div>

                {error && <div className="alert-error" style={{ marginBottom: 12 }}>{error}</div>}

                <div className="edit-form-grid">
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            className="form-control"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            className="form-control"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            name="paymentMethod"
                            className="form-control"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="cash">cash</option>
                            <option value="upi">upi</option>
                            <option value="card">card</option>
                            <option value="bank">bank</option>
                            <option value="other">other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: 10 }}>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add note..."
                    />
                </div>

                <div className="edit-actions-row">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // NORMAL DISPLAY MODE
    // ==========================================
    return (
        <div className="expense-card">
            <div className="expense-card-main">
                <div className="expense-card-info">
                    <div className="category-row">
                        <h3 className="expense-category">{expense.category}</h3>
                        <span className={`badge badge-${expense.paymentMethod || "cash"}`}>
                            {expense.paymentMethod || "cash"}
                        </span>
                    </div>

                    {expense.description ? (
                        <p className="expense-description">{expense.description}</p>
                    ) : (
                        <p className="expense-description empty-desc">No description</p>
                    )}

                    <span className="expense-date">📅 {formattedDate}</span>
                </div>

                <div className="expense-card-amount-actions">
                    <div className="amount-tag">
                        <span className="currency-symbol">₹</span>
                        <span className="amount-val">{formattedAmount}</span>
                    </div>

                    <div className="card-buttons">
                        <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={handleViewDetails}
                            title="View details"
                        >
                            View
                        </button>
                        <button
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn-danger btn-sm"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? "..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>

            {showDetailModal && (
                <div className="expense-modal-backdrop" onClick={handleCloseModal}>
                    <div className="expense-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="expense-modal-header">
                            <h3>Expense Details</h3>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="expense-modal-body">
                            {detailLoading && (
                                <div className="modal-loading-state">
                                    <p>Loading expense details...</p>
                                </div>
                            )}

                            {detailError && (
                                <div className="alert-error" style={{ marginBottom: 12 }}>
                                    <p>{detailError}</p>
                                    <button
                                        type="button"
                                        className="btn-secondary btn-sm"
                                        style={{ marginTop: 8 }}
                                        onClick={handleViewDetails}
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {!detailLoading && !detailError && detailExpense && (
                                <div className="expense-detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Amount</span>
                                        <span className="detail-val detail-amount">
                                            ₹{Number(detailExpense.amount || 0).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Category</span>
                                        <span className="detail-val">
                                            <span className="detail-category-badge">
                                                {detailExpense.category}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Payment Method</span>
                                        <span className="detail-val">
                                            <span className={`badge badge-${detailExpense.paymentMethod || "cash"}`}>
                                                {detailExpense.paymentMethod || "cash"}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Date</span>
                                        <span className="detail-val">
                                            📅 {detailExpense.date ? new Date(detailExpense.date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }) : "N/A"}
                                        </span>
                                    </div>

                                    <div className="detail-item full-width">
                                        <span className="detail-label">Description</span>
                                        <p className="detail-desc-text">
                                            {detailExpense.description || "No description provided"}
                                        </p>
                                    </div>

                                    <div className="detail-item full-width detail-metadata-row">
                                        <span className="detail-metadata-text">
                                            Expense ID: <code>{detailExpense._id}</code>
                                        </span>
                                        {detailExpense.createdAt && (
                                            <span className="detail-metadata-text">
                                                Created: {new Date(detailExpense.createdAt).toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="expense-modal-footer">
                            <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExpenseCard;