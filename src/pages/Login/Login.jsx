import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    // Form data
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    // Error state
    const [error, setError] = useState("");

    // Loading state
    const [loading, setLoading] = useState(false);


    // =========================
    // Handle Input Change
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =========================
    // Handle Login
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Basic validation
        if (!formData.identifier || !formData.password) {
            setError("Username/email and password are required");
            return;
        }

        try {

            setLoading(true);

            /*
             * If identifier contains @
             * → treat it as email
             *
             * Otherwise
             * → treat it as username
             */

            const loginData = formData.identifier.includes("@")
                ? {
                    email: formData.identifier,
                    password: formData.password
                }
                : {
                    username: formData.identifier,
                    password: formData.password
                };


            // =========================
            // API Request
            // =========================

            const response = await fetch(
                "http://localhost:3000/api/v1/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify(loginData)
                }
            );


            const data = await response.json();

            console.log("Login response:", data);


            // =========================
            // Handle API Error
            // =========================

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }


            // =========================
            // Save User
            // =========================

            login(data.data.user);


            // =========================
            // Navigate Dashboard
            // =========================

            navigate("/dashboard");


        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.message || "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // UI
    // =========================

    return (
        <div className="login-container">

            <h1>Login</h1>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            <form onSubmit={handleSubmit}>

                {/* Identifier */}

                <div>
                    <label htmlFor="identifier">
                        Username or Email
                    </label>

                    <input
                        id="identifier"
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Enter username or email"
                    />
                </div>


                {/* Password */}

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                    />
                </div>


                {/* Login Button */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>


            {/* Register */}

            <p>
                Don't have an account?{" "}

                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>
    );
}

export default Login;