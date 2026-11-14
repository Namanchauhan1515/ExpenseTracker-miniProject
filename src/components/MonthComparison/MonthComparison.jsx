import "./MonthComparison.css";

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function MonthComparison({ monthlySpending = [] }) {
    if (!monthlySpending || monthlySpending.length === 0) {
        return null;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Prioritize actual current calendar month; fallback to last item in list
    const currentData =
        monthlySpending.find(
            (m) => m._id.year === currentYear && m._id.month === currentMonth
        ) || monthlySpending[monthlySpending.length - 1];

    if (!currentData) return null;

    // Determine previous month
    let targetPrevYear = currentData._id.year;
    let targetPrevMonth = currentData._id.month - 1;
    if (targetPrevMonth === 0) {
        targetPrevMonth = 12;
        targetPrevYear -= 1;
    }

    const prevData = monthlySpending.find(
        (m) => m._id.year === targetPrevYear && m._id.month === targetPrevMonth
    );

    const currAmount = currentData.totalAmount || 0;
    const prevAmount = prevData ? prevData.totalAmount : 0;
    const diff = currAmount - prevAmount;

    let pctChange = 0;
    if (prevAmount > 0) {
        pctChange = Math.round(((currAmount - prevAmount) / prevAmount) * 100);
    } else if (currAmount > 0) {
        pctChange = 100;
    }

    const isIncrease = diff > 0;
    const isDecrease = diff < 0;
    const isEqual = diff === 0;

    const currLabel = `${MONTH_NAMES[currentData._id.month - 1]} ${currentData._id.year}`;
    const prevLabel = `${MONTH_NAMES[targetPrevMonth - 1]} ${targetPrevYear}`;

    return (
        <div className="month-comparison-card glass-card">
            <div className="month-comp-left">
                <span className="month-comp-tag">Month-over-Month</span>
                <h4 className="month-comp-title">
                    {currLabel} vs {prevLabel}
                </h4>
                <p className="month-comp-desc">
                    {prevAmount === 0 ? (
                        <>Spent ₹{currAmount.toLocaleString("en-IN")} this month (no records for {prevLabel})</>
                    ) : isIncrease ? (
                        <>
                            Spending increased by <strong>₹{Math.abs(diff).toLocaleString("en-IN")}</strong> compared to last month.
                        </>
                    ) : isDecrease ? (
                        <>
                            Great job! Spending decreased by <strong>₹{Math.abs(diff).toLocaleString("en-IN")}</strong> compared to last month.
                        </>
                    ) : (
                        <>Spending remained exactly the same as last month.</>
                    )}
                </p>
            </div>

            <div className="month-comp-right">
                <div className={`comp-badge ${isIncrease ? "badge-up" : isDecrease ? "badge-down" : "badge-neutral"}`}>
                    <span className="comp-arrow">
                        {isIncrease ? "▲" : isDecrease ? "▼" : "•"}
                    </span>
                    <span className="comp-pct">
                        {isEqual ? "0%" : `${Math.abs(pctChange)}%`}
                    </span>
                </div>
                <div className="comp-amounts">
                    <span className="comp-curr">₹{currAmount.toLocaleString("en-IN")}</span>
                    <span className="comp-prev">from ₹{prevAmount.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>
    );
}

export default MonthComparison;
