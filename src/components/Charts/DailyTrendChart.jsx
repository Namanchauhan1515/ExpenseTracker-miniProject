import { useState, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "./DailyTrendChart.css";

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function DailyTrendChart({ data = [] }) {
    const [viewMode, setViewMode] = useState("daily"); // "daily" | "weekly" | "monthly"

    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        if (viewMode === "daily") {
            return data.map((item) => ({
                name: `${item._id.date} ${MONTH_NAMES[item._id.month - 1] || item._id.month}`,
                amount: Math.round(item.totalAmount)
            }));
        }

        if (viewMode === "weekly") {
            // Group by approximate week (day 1-7, 8-14, 15-21, 22-end)
            const weekMap = {};
            data.forEach((item) => {
                const day = item._id.date;
                const weekNum = Math.min(4, Math.floor((day - 1) / 7) + 1);
                const monthName = MONTH_NAMES[item._id.month - 1] || item._id.month;
                const key = `${monthName} W${weekNum}`;
                weekMap[key] = (weekMap[key] || 0) + item.totalAmount;
            });
            return Object.entries(weekMap).map(([name, amount]) => ({
                name,
                amount: Math.round(amount)
            }));
        }

        if (viewMode === "monthly") {
            const monthMap = {};
            data.forEach((item) => {
                const key = `${MONTH_NAMES[item._id.month - 1] || item._id.month} '${String(item._id.year).slice(-2)}`;
                monthMap[key] = (monthMap[key] || 0) + item.totalAmount;
            });
            return Object.entries(monthMap).map(([name, amount]) => ({
                name,
                amount: Math.round(amount)
            }));
        }

        return [];
    }, [data, viewMode]);

    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <div className="chart-header">
                    <h3 className="chart-title">📈 Daily Spending Trends</h3>
                </div>
                <div className="chart-empty">No spending trend data recorded for this period</div>
            </div>
        );
    }

    const totalDays = data.length;
    const totalSpent = data.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
    const avgDaily = totalDays > 0 ? Math.round(totalSpent / totalDays) : 0;

    const formatTooltip = (value) => {
        return [`₹${Number(value).toLocaleString("en-IN")}`, "Spent"];
    };

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div className="chart-header-left">
                    <h3 className="chart-title">📈 Daily Spending Trends</h3>
                    <span className="chart-highlight">
                        Avg/day: ₹{avgDaily.toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="trend-view-selector">
                    <button
                        type="button"
                        className={`trend-view-btn ${viewMode === "daily" ? "active" : ""}`}
                        onClick={() => setViewMode("daily")}
                    >
                        Daily
                    </button>
                    <button
                        type="button"
                        className={`trend-view-btn ${viewMode === "weekly" ? "active" : ""}`}
                        onClick={() => setViewMode("weekly")}
                    >
                        Weekly
                    </button>
                    <button
                        type="button"
                        className={`trend-view-btn ${viewMode === "monthly" ? "active" : ""}`}
                        onClick={() => setViewMode("monthly")}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                        />
                        <Tooltip
                            formatter={formatTooltip}
                            contentStyle={{
                                background: "#1e293b",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                color: "#f8fafc",
                                fontSize: "0.85rem"
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#8b5cf6"
                            strokeWidth={2.5}
                            fill="url(#dailyGradient)"
                            dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 2, stroke: "#8b5cf6" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DailyTrendChart;
