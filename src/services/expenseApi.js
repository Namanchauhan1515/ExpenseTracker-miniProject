const BASE_URL = "http://localhost:3000/api/v1/expenses";

/**
 * Fetch all expenses with optional query params (page, limit, category, paymentMethod, startDate, endDate, sortBy, order)
 */
export const getExpenses = async (params) => {
    const query = params ? `?${params.toString()}` : "";
    return await fetch(`${BASE_URL}${query}`, {
        credentials: "include"
    });
};

/**
 * Fetch single expense by ID
 */
export const getExpenseById = async (id) => {
    return await fetch(`${BASE_URL}/${id}`, {
        credentials: "include"
    });
};

/**
 * Create a new expense
 */
export const createExpense = async (expenseData) => {
    return await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(expenseData)
    });
};

/**
 * Update an existing expense by ID
 */
export const updateExpense = async (id, expenseData) => {
    return await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(expenseData)
    });
};

/**
 * Delete an expense by ID
 */
export const deleteExpense = async (id) => {
    return await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
};
