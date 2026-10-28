import { useState } from "react";

function ExpenseCard({ expense, onDelete, onUpdate }) {

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        paymentMethod: expense.paymentMethod,
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
        setIsEditing(true);
    };

    const handleCancel = () => {

        setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            paymentMethod: expense.paymentMethod,
            date: expense.date
                ? new Date(expense.date).toISOString().split("T")[0]
                : ""
        });

        setIsEditing(false);
    };

    const handleUpdate = async () => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/expenses/${expense._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            console.log("Update Expense Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update expense"
                );
            }

            onUpdate(data.data);

            setIsEditing(false);

        } catch (error) {
            console.error("Update Expense Error:", error);
        }
    };

    const handleDelete = async () => {

        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/expenses/${expense._id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            console.log("Delete Expense Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete expense"
                );
            }

            onDelete(expense._id);

        } catch (error) {
            console.error("Delete Expense Error:", error);
        }
    };

    if (isEditing) {

        return (
            <div className="expense-card">

                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Payment Method</label>

                    <select
                        name="paymentMethod"
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

                <div>
                    <label>Date</label>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <button onClick={handleUpdate}>
                    Save
                </button>

                <button onClick={handleCancel}>
                    Cancel
                </button>

            </div>
        );
    }

    return (
        <div className="expense-card">

            <h3>{expense.category}</h3>

            <p>{expense.description}</p>

            <p>₹{expense.amount}</p>

            <p>{expense.paymentMethod}</p>

            <p>
                {new Date(expense.date).toLocaleDateString()}
            </p>

            <button onClick={handleEdit}>
                Edit
            </button>

            <button onClick={handleDelete}>
                Delete
            </button>

        </div>
    );
}

export default ExpenseCard;