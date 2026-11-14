import "./PaymentMethodChart.css";

const METHOD_COLORS = {
    cash: "#10b981",
    upi: "#6366f1",
    card: "#f59e0b",
    bank: "#06b6d4",
    other: "#94a3b8"
};

const METHOD_LABELS = {
    cash: "Cash",
    upi: "UPI",
    card: "Card",
    bank: "Bank",
    other: "Other"
};

const ALL_METHODS = ["cash", "upi", "card", "bank", "other"];

function PaymentMethodChart({ data = [] }) {
    const totalSpending = (data || []).reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    const chartData = ALL_METHODS.map((methodKey) => {
        const found = (data || []).find(
            (item) => item._id?.toLowerCase() === methodKey
        );
        const amount = found ? Math.round(found.totalAmount) : 0;
        const percentage = totalSpending > 0
            ? ((amount / totalSpending) * 100).toFixed(1)
            : "0.0";

        return {
            name: METHOD_LABELS[methodKey],
            amount,
            method: methodKey,
            percentage
        };
    });

    if (!data || data.length === 0 || totalSpending === 0) {
        return (
            <div className="chart-card">
                <div className="chart-header">
                    <h3 className="chart-title">💳 Payment Method Breakdown</h3>
                </div>
                <div className="chart-empty">No payment data recorded for this period</div>
            </div>
        );
    }

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">💳 Payment Method Breakdown</h3>
                <span className="chart-highlight">
                    Total: ₹{Math.round(totalSpending).toLocaleString("en-IN")}
                </span>
            </div>

            <div className="payment-stats">
                {chartData.map((item, index) => (
                    <div key={index} className="payment-stat-item">
                        <div className="payment-stat-header">
                            <span
                                className="payment-stat-dot"
                                style={{ backgroundColor: METHOD_COLORS[item.method] || "#94a3b8" }}
                            />
                            <span className="payment-stat-label">{item.name}</span>
                        </div>
                        <div className="payment-stat-bar-wrapper">
                            <div
                                className="payment-stat-bar"
                                style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: METHOD_COLORS[item.method] || "#94a3b8"
                                }}
                            />
                        </div>
                        <div className="payment-stat-values">
                            <span className="payment-stat-amount">
                                ₹{item.amount.toLocaleString("en-IN")}
                            </span>
                            <span className="payment-stat-pct">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentMethodChart;
