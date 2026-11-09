const BASE_URL = "http://localhost:3000/api/v1/users";

/**
 * Register a new user with FormData (username, email, password, avatar)
 */
export const registerUser = async (formData) => {
    return await fetch(`${BASE_URL}/register`, {
        method: "POST",
        credentials: "include",
        body: formData
    });
};

/**
 * Log in user with credentials (email/username, password)
 */
export const loginUser = async (loginData) => {
    return await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(loginData)
    });
};

/**
 * Fetch current authenticated user profile
 */
export const getCurrentUser = async () => {
    return await fetch(`${BASE_URL}/current-user`, {
        credentials: "include"
    });
};

/**
 * Log out user session
 */
export const logoutUser = async () => {
    return await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });
};

/**
 * Refresh access token using refreshToken cookie
 */
export const refreshAccessToken = async () => {
    return await fetch(`${BASE_URL}/refresh-token`, {
        method: "POST",
        credentials: "include"
    });
};

/**
 * Update user profile details (username, email)
 */
export const updateUserProfile = async (userData) => {
    return await fetch(`${BASE_URL}/update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(userData)
    });
};

/**
 * Update user avatar image with FormData (avatar)
 */
export const updateUserAvatar = async (formData) => {
    return await fetch(`${BASE_URL}/avatar`, {
        method: "PATCH",
        credentials: "include",
        body: formData
    });
};

/**
 * Change user password
 */
export const changeUserPassword = async (passwordData) => {
    return await fetch(`${BASE_URL}/change-password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(passwordData)
    });
};
