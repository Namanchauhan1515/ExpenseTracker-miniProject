import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCard from "../../components/SummaryCard/SummaryCard";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalAmount: 0,
        averageAmount: 0,
        highestExpense: 0,
        lowestExpense: 0
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/dashboard/summary",
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                console.log("Summary response:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch summary"
                    );
                }

                setSummary(data.data.summary);

            } catch (error) {
                console.error("Summary error:", error);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="dashboard">

            <Sidebar />

            <main className="dashboard-content">

                <h1>Dashboard</h1>

                <section className="summary-section">

                    <SummaryCard
                        title="Total Expense"
                        amount={summary.totalAmount}
                    />

                    <SummaryCard
                        title="Average Expense"
                        amount={summary.averageAmount}
                    />

                    <SummaryCard
                        title="Highest Expense"
                        amount={summary.highestExpense}
                    />

                    <SummaryCard
                        title="Lowest Expense"
                        amount={summary.lowestExpense}
                    />

                </section>

            </main>

        </div>
    );
}

export default Dashboard;