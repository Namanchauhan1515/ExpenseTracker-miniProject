import "./SummaryCard.css";

const ICON_MAP = {
    "Total Expense": "💰",
    "Average Expense": "📊",
    "Highest Expense": "🔺",
    "Lowest Expense": "🔻"
};

function SummaryCard({ title, amount, icon }) {
    const formattedAmount = Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const displayIcon = icon || ICON_MAP[title] || "💳";

    return (
        <div className="summary-card">
            <div className="summary-card-top">
                <h3 className="summary-title">{title}</h3>
                <span className="summary-icon">{displayIcon}</span>
            </div>
            <p className="summary-amount">₹{formattedAmount}</p>
        </div>
    );
}

export default SummaryCard;
