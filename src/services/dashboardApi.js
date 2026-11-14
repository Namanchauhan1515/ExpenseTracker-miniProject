const BASE_URL = "http://localhost:3000/api/v1/dashboard";

/**
 * Fetch dashboard expense summary and breakdown
 * @param {Object} params - Optional date filter params
 * @param {string} params.startDate - Start date (YYYY-MM-DD)
 * @param {string} params.endDate - End date (YYYY-MM-DD)
 */
export const getDashboardSummary = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.startDate) query.append("startDate", params.startDate);
    if (params.endDate) query.append("endDate", params.endDate);
    const queryString = query.toString();
    const url = queryString ? `${BASE_URL}/summary?${queryString}` : `${BASE_URL}/summary`;
    return await fetch(url, {
        credentials: "include"
    });
};
