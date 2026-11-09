import { useState, createContext } from "react";
import { getCurrentUser, logoutUser, refreshAccessToken as refreshAccessTokenApi } from "../services/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("expense_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("expense_user");
    });

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        try {
            localStorage.setItem("expense_user", JSON.stringify(userData));
        } catch (err) {
            console.error("Storage error:", err);
        }
    };

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const updated = { ...prev, ...updatedData };
            try {
                localStorage.setItem("expense_user", JSON.stringify(updated));
            } catch (err) {
                console.error("Storage error:", err);
            }
            return updated;
        });
    };

    const refreshAccessToken = async () => {
        try {
            const res = await refreshAccessTokenApi();

            if (!res.ok) {
                return false;
            }

            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Refresh access token error:", err);
            return false;
        }
    };

    const refreshUser = async () => {
        try {
            let res = await getCurrentUser();

            // If access token is expired (401), attempt to refresh token
            if (res.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    res = await getCurrentUser();
                } else {
                    logout();
                    return null;
                }
            }

            const data = await res.json();
            if (res.ok && data.data) {
                updateUser(data.data);
                return data.data;
            }
        } catch (err) {
            console.error("Refresh user error:", err);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("expense_user");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                updateUser,
                refreshUser,
                refreshAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};