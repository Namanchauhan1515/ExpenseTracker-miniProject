import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        avatar: null
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // =========================
    // Handle Text Input
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =========================
    // Handle Avatar
    // =========================

    const handleAvatarChange = (e) => {

        const file = e.target.files[0];

        setFormData((prev) => ({
            ...prev,
            avatar: file
        }));
    };


    // =========================
    // Handle Register
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !formData.username ||
            !formData.email ||
            !formData.password
        ) {
            setError("All fields are required");
            return;
        }

        if (!formData.avatar) {
            setError("Please select an avatar");
            return;
        }

        try {

            setLoading(true);

            // Create FormData
            const data = new FormData();

            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("avatar", formData.avatar);


            const response = await fetch(
                "http://localhost:3000/api/v1/users/register",
                {
                    method: "POST",

                    credentials: "include",

                    body: data
                }
            );


            const result = await response.json();

            console.log("Register response:", result);


            if (!response.ok) {

                throw new Error(
                    result.message || "Registration failed"
                );
            }


            // Registration successful

            alert("Registration successful!");

            navigate("/login");


        } catch (error) {

            console.error("Register error:", error);

            setError(
                error.message || "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="register-container">

            <h1>Create Account</h1>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            <form onSubmit={handleSubmit}>

                {/* Username */}

                <div>
                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                    />
                </div>


                {/* Email */}

                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
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


                {/* Avatar */}

                <div>
                    <label htmlFor="avatar">
                        Avatar
                    </label>

                    <input
                        id="avatar"
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>


                {/* Register Button */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Register"
                    }
                </button>

            </form>


            <p>
                Already have an account?{" "}

                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Register;