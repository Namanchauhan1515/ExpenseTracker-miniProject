import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <h2>Expense Tracker</h2>

            <nav>
                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/expenses">
                    Expenses
                </Link>
            </nav>

            <button onClick={handleLogout}>
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;