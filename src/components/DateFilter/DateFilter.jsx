import { useState } from "react";
import "./DateFilter.css";

const PRESETS = [
    { label: "Today", key: "today" },
    { label: "Last 7 Days", key: "7days" },
    { label: "This Month", key: "thisMonth" },
    { label: "Last Month", key: "lastMonth" },
    { label: "Last 3 Months", key: "3months" },
    { label: "This Year", key: "thisYear" },
    { label: "All Time", key: "all" },
    { label: "Custom", key: "custom" }
];

function getPresetDates(key) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (key) {
        case "today":
            return {
                startDate: formatDate(today),
                endDate: formatDate(today)
            };
        case "7days": {
            const start = new Date(today);
            start.setDate(start.getDate() - 6);
            return { startDate: formatDate(start), endDate: formatDate(today) };
        }
        case "thisMonth": {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return { startDate: formatDate(start), endDate: formatDate(end) };
        }
        case "lastMonth": {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            return { startDate: formatDate(start), endDate: formatDate(end) };
        }
        case "3months": {
            const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return { startDate: formatDate(start), endDate: formatDate(end) };
        }
        case "thisYear": {
            const start = new Date(now.getFullYear(), 0, 1);
            const end = new Date(now.getFullYear(), 11, 31);
            return { startDate: formatDate(start), endDate: formatDate(end) };
        }
        case "all":
            return { startDate: "", endDate: "" };
        default:
            return { startDate: "", endDate: "" };
    }
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function DateFilter({ onFilterChange }) {
    const [activePreset, setActivePreset] = useState("all");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const handlePresetClick = (key) => {
        setActivePreset(key);
        if (key !== "custom") {
            const dates = getPresetDates(key);
            onFilterChange(dates);
        }
    };

    const handleCustomApply = () => {
        onFilterChange({ startDate: customStart, endDate: customEnd });
    };

    return (
        <div className="date-filter">
            <div className="date-filter-presets">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.key}
                        type="button"
                        className={`filter-preset-btn ${activePreset === preset.key ? "active" : ""}`}
                        onClick={() => handlePresetClick(preset.key)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {activePreset === "custom" && (
                <div className="date-filter-custom">
                    <input
                        type="date"
                        className="form-control"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                    />
                    <span className="date-filter-separator">to</span>
                    <input
                        type="date"
                        className="form-control"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={handleCustomApply}
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}

export default DateFilter;
