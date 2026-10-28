import { useState } from "react";

function ExpenseForm({ onExpenseAdded }) {

    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: "",
        paymentMethod: "cash",
        date: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:3000/api/v1/expenses",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            console.log("Create Expense Response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create expense"
                );
            }

            onExpenseAdded(data.data);

        } catch (error) {
            console.error("Create Expense Error:", error);
        }
    };

    return (
        <div>

            <h2>Add Expense</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="amount">
                        Amount
                    </label>

                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="category">
                        Category
                    </label>

                    <input
                        id="category"
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="description">
                        Description
                    </label>

                    <input
                        id="description"
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="paymentMethod">
                        Payment Method
                    </label>

                    <select
                        id="paymentMethod"
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
                    <label htmlFor="date">
                        Date
                    </label>

                    <input
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    Add Expense
                </button>

            </form>

        </div>
    );
}

export default ExpenseForm;