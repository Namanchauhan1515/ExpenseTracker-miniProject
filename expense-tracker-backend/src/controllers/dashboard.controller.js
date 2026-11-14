import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const getExpenseSummary = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    const matchStage = {
        owner: req.user._id
    };

    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            matchStage.date.$gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchStage.date.$lte = end;
        }
    }

    // 1. Overall Summary (Total, Avg, Max, Min)
    const summary = await Expense.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                averageAmount: { $avg: "$amount" },
                highestExpense: { $max: "$amount" },
                lowestExpense: { $min: "$amount" }
            }
        }
    ]);

    const summaryData = summary[0] || {
        totalAmount: 0,
        averageAmount: 0,
        highestExpense: 0,
        lowestExpense: 0
    };

    // 2. Category-wise Spending
    const categoryWise = await Expense.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);

    // 3. Payment Method Spending
    const paymentMethodWise = await Expense.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$paymentMethod",
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);

    // 4. Monthly Spending (historical for user to support 6M/12M trend & MoM comparison)
    const monthlySpending = await Expense.aggregate([
        {
            $match: { owner: req.user._id }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    // 5. Daily Spending Trends
    const dailySpending = await Expense.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    date: { $dayOfMonth: "$date" }
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.date": 1
            }
        }
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                summary: summaryData,
                categoryWise,
                paymentMethodWise,
                monthlySpending,
                dailySpending
            },
            "Expense summary fetched successfully"
        )
    );
});

export { getExpenseSummary };
