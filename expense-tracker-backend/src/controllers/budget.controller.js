import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Budget } from "../models/budget.model.js";
import { Expense } from "../models/expense.model.js";

/**
 * Fetch budget for a given month/year along with real-time spending calculations
 */
const getMonthlyBudget = asyncHandler(async (req, res) => {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    if (month < 1 || month > 12) {
        throw new apiError(400, "Invalid month. Must be between 1 and 12.");
    }

    if (year < 2000 || year > 2100) {
        throw new apiError(400, "Invalid year.");
    }

    // 1. Fetch user's budget document for this month/year
    const budgetDoc = await Budget.findOne({
        owner: req.user._id,
        month,
        year
    });

    // 2. Compute date range for the month
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 3. Aggregate real expenses for this user in this month
    const expenseAggregation = await Expense.aggregate([
        {
            $match: {
                owner: req.user._id,
                date: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            }
        },
        {
            $group: {
                _id: "$category",
                spent: { $sum: "$amount" }
            }
        }
    ]);

    const spentMap = {};
    let totalSpent = 0;

    expenseAggregation.forEach((item) => {
        const cat = item._id || "Uncategorized";
        const amt = item.spent || 0;
        spentMap[cat] = amt;
        totalSpent += amt;
    });

    const totalBudget = budgetDoc ? budgetDoc.totalBudget : 0;
    const overallRemaining = Math.max(0, totalBudget - totalSpent);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const overall = {
        totalBudget,
        totalSpent,
        remaining: overallRemaining,
        overspentAmount: totalSpent > totalBudget ? totalSpent - totalBudget : 0,
        percentage: Number(overallPercentage.toFixed(1)),
        isWarning: totalBudget > 0 && overallPercentage >= 80 && overallPercentage < 100,
        isExceeded: totalBudget > 0 && overallPercentage >= 100
    };

    // 4. Merge category budgets with actual spending
    const categoryBudgetsList = budgetDoc?.categoryBudgets || [];
    const allCategories = new Set([
        ...categoryBudgetsList.map((b) => b.category),
        ...Object.keys(spentMap)
    ]);

    const categoryBreakdown = Array.from(allCategories).map((categoryName) => {
        const budgetedItem = categoryBudgetsList.find(
            (b) => b.category.toLowerCase() === categoryName.toLowerCase()
        );
        const catBudget = budgetedItem ? budgetedItem.amount : 0;
        const catSpent = spentMap[categoryName] || 0;
        const catRemaining = Math.max(0, catBudget - catSpent);
        const catPercentage = catBudget > 0 ? (catSpent / catBudget) * 100 : 0;

        return {
            category: categoryName,
            budget: catBudget,
            spent: catSpent,
            remaining: catRemaining,
            overspentAmount: catSpent > catBudget ? catSpent - catBudget : 0,
            percentage: Number(catPercentage.toFixed(1)),
            isWarning: catBudget > 0 && catPercentage >= 80 && catPercentage < 100,
            isExceeded: catBudget > 0 && catPercentage >= 100
        };
    });

    // Sort by spent descending
    categoryBreakdown.sort((a, b) => b.spent - a.spent);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                budget: budgetDoc,
                month,
                year,
                overall,
                categoryBreakdown
            },
            "Monthly budget and spending fetched successfully"
        )
    );
});

/**
 * Create or update monthly budget
 */
const upsertBudget = asyncHandler(async (req, res) => {
    const { month, year, totalBudget, categoryBudgets } = req.body;

    const numMonth = Number(month);
    const numYear = Number(year);
    const numTotalBudget = Number(totalBudget);

    if (!numMonth || numMonth < 1 || numMonth > 12) {
        throw new apiError(400, "Valid month (1-12) is required");
    }

    if (!numYear || numYear < 2000 || numYear > 2100) {
        throw new apiError(400, "Valid year is required");
    }

    if (isNaN(numTotalBudget) || numTotalBudget < 0) {
        throw new apiError(400, "Total budget must be a non-negative number");
    }

    let sanitizedCategories = [];
    if (Array.isArray(categoryBudgets)) {
        sanitizedCategories = categoryBudgets
            .filter((item) => item && item.category && String(item.category).trim() && Number(item.amount) >= 0)
            .map((item) => ({
                category: String(item.category).trim(),
                amount: Number(item.amount)
            }));
    }

    const updatedBudget = await Budget.findOneAndUpdate(
        {
            owner: req.user._id,
            month: numMonth,
            year: numYear
        },
        {
            $set: {
                totalBudget: numTotalBudget,
                categoryBudgets: sanitizedCategories
            }
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new apiResponse(
            200,
            updatedBudget,
            "Monthly budget updated successfully"
        )
    );
});

/**
 * Delete a budget for a given month or by ID
 */
const deleteBudget = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let query = { owner: req.user._id };

    if (id && id !== "current") {
        query._id = id;
    } else {
        const { month, year } = req.query;
        if (!month || !year) {
            throw new apiError(400, "Month and year or budget ID are required to delete budget");
        }
        query.month = Number(month);
        query.year = Number(year);
    }

    const deleted = await Budget.findOneAndDelete(query);

    if (!deleted) {
        throw new apiError(404, "Budget not found");
    }

    return res.status(200).json(
        new apiResponse(200, null, "Budget deleted successfully")
    );
});

export { getMonthlyBudget, upsertBudget, deleteBudget };
