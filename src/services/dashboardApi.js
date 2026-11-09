const BASE_URL = "http://localhost:3000/api/v1/dashboard";

/**
 * Fetch dashboard expense summary and breakdown
 */
export const getDashboardSummary = async () => {
    return await fetch(`${BASE_URL}/summary`, {
        credentials: "include"
    });
};
