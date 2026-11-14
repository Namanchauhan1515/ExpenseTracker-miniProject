import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import "./MonthlyBarChart.css";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function MonthlyBarChart({ data = [] }) {
    const [rangeLimit, setRangeLimit] = useState(12); // 6 | 12 | 0 (all)
    const [selectedMonth, setSelectedMonth] = useState(null);

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (rangeLimit === 0) return data;
        return data.slice(-rangeLimit);
    }, [data, rangeLimit]);

    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <div className="chart-header">
                    <h3 className="chart-title">📊 Monthly Spending</h3>
                </div>
                <div className="chart-empty">No monthly spending data recorded yet</div>
            </div>
        );
    }

    const chartData = filteredData.map((item) => ({
        name: `${MONTHS[item._id.month - 1]} '${String(item._id.year).slice(-2)}`,
        fullName: `${MONTHS[item._id.month - 1]} ${item._id.year}`,
        amount: Math.round(item.totalAmount),
        month: item._id.month,
        year: item._id.year
    }));

    const maxAmount = chartData.length > 0 ? Math.max(...chartData.map((d) => d.amount)) : 0;
    const highestMonth = chartData.find((d) => d.amount === maxAmount);

    const formatTooltip = (value) => {
        return [`₹${Number(value).toLocaleString("en-IN")}`, "Spending"];
    };

    const handleBarClick = (entry) => {
        if (entry && entry.fullName) {
            setSelectedMonth(selectedMonth?.fullName === entry.fullName ? null : entry);
        }
    };

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div className="chart-header-left">
                    <h3 className="chart-title">📊 Monthly Spending</h3>
                    {highestMonth && (
                        <span className="chart-highlight">
                            Peak: {highestMonth.name} (₹{maxAmount.toLocaleString("en-IN")})
                        </span>
                    )}
                </div>

                <div className="trend-view-selector">
                    <button
                        type="button"
                        className={`trend-view-btn ${rangeLimit === 6 ? "active" : ""}`}
                        onClick={() => setRangeLimit(6)}
                    >
                        6M
                    </button>
                    <button
                        type="button"
                        className={`trend-view-btn ${rangeLimit === 12 ? "active" : ""}`}
                        onClick={() => setRangeLimit(12)}
                    >
                        12M
                    </button>
                    <button
                        type="button"
                        className={`trend-view-btn ${rangeLimit === 0 ? "active" : ""}`}
                        onClick={() => setRangeLimit(0)}
                    >
                        All
                    </button>
                </div>
            </div>

            {selectedMonth && (
                <div className="selected-month-banner">
                    <span>
                        Selected Month: <strong>{selectedMonth.fullName}</strong> — Total Expenses:{" "}
                        <strong>₹{selectedMonth.amount.toLocaleString("en-IN")}</strong>
                    </span>
                    <button
                        type="button"
                        className="selected-month-clear"
                        onClick={() => setSelectedMonth(null)}
                        title="Clear selection"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        onClick={(e) => {
                            if (e && e.activePayload && e.activePayload[0]) {
                                handleBarClick(e.activePayload[0].payload);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                        />
                        <Tooltip
                            formatter={formatTooltip}
                            cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                            contentStyle={{
                                background: "#1e293b",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                color: "#f8fafc",
                                fontSize: "0.85rem"
                            }}
                        />
                        <Bar
                            dataKey="amount"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                            cursor="pointer"
                        >
                            {chartData.map((entry, index) => {
                                const isSelected = selectedMonth?.fullName === entry.fullName;
                                const isPeak = entry.amount === maxAmount;
                                return (
                                    <Cell
                                        key={index}
                                        fill={isSelected ? "#ec4899" : isPeak ? "#8b5cf6" : "#6366f1"}
                                        fillOpacity={isSelected ? 1 : isPeak ? 0.95 : 0.75}
                                        onClick={() => handleBarClick(entry)}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default MonthlyBarChart;
