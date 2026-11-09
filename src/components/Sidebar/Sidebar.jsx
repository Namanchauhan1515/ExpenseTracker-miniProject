import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <h2>Expense Tracker</h2>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/expenses"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>💳</span>
                        <span>Expenses</span>
                    </NavLink>

                    <NavLink
                        to="/expenses/add"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>➕</span>
                        <span>Add Expense</span>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span>👤</span>
                        <span>Profile & Security</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-bottom">
                {user && (
                    <Link to="/profile" className="sidebar-user-info-link" title="View Profile">
                        <div className="sidebar-user-info">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.username || "Avatar"}
                                    className="sidebar-avatar"
                                />
                            ) : (
                                <div className="sidebar-avatar-placeholder">
                                    {(user.username?.[0] || "U").toUpperCase()}
                                </div>
                            )}
                            <div className="sidebar-user-details">
                                <span className="sidebar-username">{user.username}</span>
                                <span className="sidebar-email">{user.email}</span>
                            </div>
                        </div>
                    </Link>
                )}

                <button
                    type="button"
                    className="sidebar-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;