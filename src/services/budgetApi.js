const BASE_URL = "http://localhost:3000/api/v1/budgets";

/**
 * Fetch monthly budget and actual spending progress for a specific month and year
 * @param {number} month - 1 to 12
 * @param {number} year - e.g. 2026
 */
export const getMonthlyBudget = async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);
    const query = params.toString() ? `?${params.toString()}` : "";

    return await fetch(`${BASE_URL}${query}`, {
        credentials: "include"
    });
};

/**
 * Save or update monthly budget
 * @param {Object} budgetData - { month, year, totalBudget, categoryBudgets: [{ category, amount }] }
 */
export const saveMonthlyBudget = async (budgetData) => {
    return await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(budgetData)
    });
};

/**
 * Delete a budget document
 * @param {string} id - Budget document ID or "current" with month/year params
 * @param {number} month - optional
 * @param {number} year - optional
 */
export const deleteMonthlyBudget = async (id = "current", month, year) => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);
    const query = params.toString() ? `?${params.toString()}` : "";

    return await fetch(`${BASE_URL}/${id}${query}`, {
        method: "DELETE",
        credentials: "include"
    });
};
