import { useMemo } from "react";
import "./FinancialInsights.css";

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function FinancialInsights({
    summary = {},
    highestExpenseRecord = null,
    categoryWise = [],
    paymentMethodWise = [],
    monthlySpending = [],
    dailySpending = []
}) {
    const totalAmount = summary.totalAmount || 0;

    const insights = useMemo(() => {
        if (!totalAmount || totalAmount <= 0) return null;

        // 1. Highest Spending Category
        const topCat = categoryWise.length > 0 ? categoryWise[0] : null;
        const topCatPct = topCat && totalAmount > 0
            ? ((topCat.totalAmount / totalAmount) * 100).toFixed(1)
            : "0.0";

        // 2. Highest Single Expense
        const highestAmt = highestExpenseRecord?.amount || summary.highestExpense || 0;
        const highestCat = highestExpenseRecord?.category || "Expense";
        const highestDesc = highestExpenseRecord?.description || "";
        const highestDate = highestExpenseRecord?.date
            ? new Date(highestExpenseRecord.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short"
              })
            : "";

        // 3. Average Daily Spending (across recorded days)
        const activeDaysCount = Math.max(1, dailySpending.length);
        const avgDaily = Math.round(totalAmount / activeDaysCount);

        // 4. Month-over-Month Comparison
        let momText = "";
        let momStatus = "neutral";
        if (monthlySpending.length >= 2) {
            const curr = monthlySpending[monthlySpending.length - 1].totalAmount;
            const prev = monthlySpending[monthlySpending.length - 2].totalAmount;
            if (prev > 0) {
                const diffPct = Math.round(((curr - prev) / prev) * 100);
                if (diffPct > 0) {
                    momText = `+${diffPct}% higher than prior month`;
                    momStatus = "increased";
                } else if (diffPct < 0) {
                    momText = `${Math.abs(diffPct)}% lower than prior month`;
                    momStatus = "decreased";
                } else {
                    momText = "Equal to prior month";
                }
            }
        }

        // 5. Unusual Spending Spikes (days where spending is >= 1.8x the daily average)
        const spikes = [];
        if (dailySpending.length > 1 && avgDaily > 0) {
            dailySpending.forEach((day) => {
                if (day.totalAmount >= avgDaily * 1.8 && day.totalAmount > 500) {
                    const ratio = (day.totalAmount / avgDaily).toFixed(1);
                    const monthName = MONTH_NAMES[day._id.month - 1] || day._id.month;
                    spikes.push({
                        date: `${day._id.date} ${monthName}`,
                        amount: day.totalAmount,
                        ratio
                    });
                }
            });
            spikes.sort((a, b) => b.amount - a.amount);
        }

        // 6. Top Spending Categories (up to 4)
        const topCategories = categoryWise.slice(0, 4).map((c) => ({
            name: c._id,
            amount: c.totalAmount,
            percentage: totalAmount > 0 ? ((c.totalAmount / totalAmount) * 100).toFixed(1) : 0
        }));

        // 7. Personalized Saving Suggestions based on real calculations
        const suggestions = [];

        // Rule A: Concentration in top category
        if (topCat && Number(topCatPct) >= 30) {
            const potSavings = Math.round(topCat.totalAmount * 0.1);
            suggestions.push({
                icon: "💡",
                title: `Reduce ${topCat._id} by 10%`,
                text: `${topCat._id} takes ${topCatPct}% of your budget (₹${topCat.totalAmount.toLocaleString("en-IN")}). Trimming this by just 10% saves you ₹${potSavings.toLocaleString("en-IN")} next month.`
            });
        }

        // Rule B: Cash spending awareness
        const cashObj = paymentMethodWise.find((p) => p._id === "cash");
        if (cashObj && cashObj.totalAmount > 0) {
            const cashPct = ((cashObj.totalAmount / totalAmount) * 100).toFixed(1);
            if (Number(cashPct) >= 20) {
                suggestions.push({
                    icon: "💵",
                    title: "Track Cash Micro-expenses",
                    text: `₹${cashObj.totalAmount.toLocaleString("en-IN")} (${cashPct}%) was spent in cash. Logging cash receipts immediately prevents unaccounted leakage.`
                });
            }
        }

        // Rule C: Spending spike mitigation
        if (spikes.length > 0) {
            const topSpike = spikes[0];
            suggestions.push({
                icon: "⚡",
                title: "Apply 24-Hour Rule for Big Purchases",
                text: `You had an unusual spike of ₹${topSpike.amount.toLocaleString("en-IN")} (${topSpike.ratio}× daily avg) on ${topSpike.date}. A 24-hour cooling-off rule on purchases above ₹2,000 helps prevent impulse spending.`
            });
        } else {
            suggestions.push({
                icon: "🎯",
                title: "Consistent Daily Cadence",
                text: `Your daily spending of ~₹${avgDaily.toLocaleString("en-IN")}/day is well-balanced without major erratic spikes. Keep maintaining this steady discipline.`
            });
        }

        return {
            topCat,
            topCatPct,
            highestAmt,
            highestCat,
            highestDesc,
            highestDate,
            avgDaily,
            momText,
            momStatus,
            spikes,
            topCategories,
            suggestions
        };
    }, [
        totalAmount,
        summary,
        highestExpenseRecord,
        categoryWise,
        paymentMethodWise,
        monthlySpending,
        dailySpending
    ]);

    if (!insights) {
        return (
            <div className="insights-card glass-card">
                <div className="insights-header">
                    <div>
                        <span className="insights-tag">Financial Intelligence</span>
                        <h3 className="insights-title">💡 Smart Financial Insights</h3>
                    </div>
                </div>
                <div className="insights-empty">
                    <p>Record your expenses to generate personalized spending insights and saving recommendations.</p>
                </div>
            </div>
        );
    }

    return (
        <section className="insights-section glass-card">
            <div className="insights-header">
                <div>
                    <span className="insights-tag">Data-Driven Financial Intelligence</span>
                    <h2 className="insights-title">💡 Smart Financial Insights</h2>
                </div>
                <span className="insights-badge-verified">
                    ✓ Calculated from your records
                </span>
            </div>

            {/* 4 Metric Quick Badges */}
            <div className="insights-metrics-grid">
                {/* 1. Top Category */}
                <div className="insight-metric-item">
                    <span className="metric-icon">🏷️</span>
                    <div className="metric-details">
                        <span className="metric-label">Top Spending Category</span>
                        <span className="metric-value">{insights.topCat?._id || "N/A"}</span>
                        <span className="metric-subtext">
                            ₹{insights.topCat?.totalAmount.toLocaleString("en-IN")} ({insights.topCatPct}% of total)
                        </span>
                    </div>
                </div>

                {/* 2. Highest Single Expense */}
                <div className="insight-metric-item">
                    <span className="metric-icon">💎</span>
                    <div className="metric-details">
                        <span className="metric-label">Largest Single Expense</span>
                        <span className="metric-value">
                            ₹{insights.highestAmt.toLocaleString("en-IN")}
                        </span>
                        <span className="metric-subtext">
                            {insights.highestCat}
                            {insights.highestDesc ? ` — "${insights.highestDesc}"` : ""}
                            {insights.highestDate ? ` on ${insights.highestDate}` : ""}
                        </span>
                    </div>
                </div>

                {/* 3. Average Daily Spending */}
                <div className="insight-metric-item">
                    <span className="metric-icon">📅</span>
                    <div className="metric-details">
                        <span className="metric-label">Average Daily Outflow</span>
                        <span className="metric-value">
                            ₹{insights.avgDaily.toLocaleString("en-IN")}
                        </span>
                        <span className="metric-subtext">
                            Across {dailySpending.length} active spending day{dailySpending.length === 1 ? "" : "s"}
                        </span>
                    </div>
                </div>

                {/* 4. Month-over-Month Comparison */}
                <div className="insight-metric-item">
                    <span className="metric-icon">📈</span>
                    <div className="metric-details">
                        <span className="metric-label">Monthly Momentum</span>
                        <span className={`metric-value ${insights.momStatus === "increased" ? "text-danger" : insights.momStatus === "decreased" ? "text-success" : ""}`}>
                            {insights.momText || "Steady trend"}
                        </span>
                        <span className="metric-subtext">Compared to previous period</span>
                    </div>
                </div>
            </div>

            {/* Spike Detector Banner (if any) */}
            {insights.spikes.length > 0 && (
                <div className="insights-spike-banner">
                    <span className="spike-icon">⚡</span>
                    <div className="spike-info">
                        <strong>Spending Spike Alert Detected:</strong>
                        <span>
                            On <strong>{insights.spikes[0].date}</strong>, you spent{" "}
                            <strong>₹{insights.spikes[0].amount.toLocaleString("en-IN")}</strong>{" "}
                            which is <strong>{insights.spikes[0].ratio}× higher</strong> than your daily average (₹{insights.avgDaily.toLocaleString("en-IN")}).
                        </span>
                    </div>
                </div>
            )}

            {/* Bottom Row: Top Categories Breakdown + Personalized Recommendations */}
            <div className="insights-bottom-grid">
                {/* Top Spending Categories Breakdown */}
                <div className="insights-subcard">
                    <h4 className="subcard-title">🏆 Top Expense Categories</h4>
                    <div className="top-cats-list">
                        {insights.topCategories.map((cat, idx) => (
                            <div key={idx} className="top-cat-row">
                                <div className="top-cat-info">
                                    <span className="top-cat-rank">#{idx + 1}</span>
                                    <span className="top-cat-name">{cat.name}</span>
                                </div>
                                <div className="top-cat-bar-wrapper">
                                    <div
                                        className="top-cat-bar"
                                        style={{ width: `${cat.percentage}%` }}
                                    />
                                </div>
                                <div className="top-cat-values">
                                    <span className="top-cat-amt">
                                        ₹{cat.amount.toLocaleString("en-IN")}
                                    </span>
                                    <span className="top-cat-pct">{cat.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Personalized Saving Suggestions */}
                <div className="insights-subcard">
                    <h4 className="subcard-title">💡 Personalized Saving Suggestions</h4>
                    <div className="suggestions-list">
                        {insights.suggestions.map((item, idx) => (
                            <div key={idx} className="suggestion-item">
                                <span className="sugg-icon">{item.icon}</span>
                                <div className="sugg-content">
                                    <strong className="sugg-title">{item.title}</strong>
                                    <p className="sugg-text">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FinancialInsights;
