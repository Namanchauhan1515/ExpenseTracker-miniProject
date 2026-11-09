import "./SummaryCard.css";

function SummaryCard({ title, amount }) {
    const formattedAmount = Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className="summary-card">
            <h3 className="summary-title">{title}</h3>
            <p className="summary-amount">₹{formattedAmount}</p>
        </div>
    );
}

export default SummaryCard;