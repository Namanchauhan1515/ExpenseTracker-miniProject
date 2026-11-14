import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import "./CategoryPieChart.css";

const COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#06b6d4",
    "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
    "#14b8a6", "#f97316", "#a855f7", "#84cc16"
];

function CategoryPieChart({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <h3 className="chart-title">🍩 Category-wise Spending</h3>
                <div className="chart-empty">No category data available</div>
            </div>
        );
    }

    const totalSpending = data.reduce((sum, item) => sum + item.totalAmount, 0);

    const chartData = data.map((item) => ({
        name: item._id,
        value: Math.round(item.totalAmount),
        percentage: totalSpending > 0
            ? ((item.totalAmount / totalSpending) * 100).toFixed(1)
            : "0.0"
    }));

    const highestCategory = chartData[0];

    const formatTooltip = (value) => {
        const pct = totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(1) : "0.0";
        return [`₹${Number(value).toLocaleString("en-IN")} (${pct}%)`, "Spent"];
    };

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="pie-legend">
                {payload.map((entry, index) => (
                    <li key={index} className="pie-legend-item">
                        <span
                            className="pie-legend-dot"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="pie-legend-label">{entry.value}</span>
                        <span className="pie-legend-pct">{chartData[index]?.percentage}%</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 className="chart-title">🍩 Category-wise Spending</h3>
                {highestCategory && (
                    <span className="chart-highlight">
                        Top: {highestCategory.name} — ₹{highestCategory.value.toLocaleString("en-IN")}
                    </span>
                )}
            </div>
            <div className="chart-container pie-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
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
                        <Legend content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CategoryPieChart;
