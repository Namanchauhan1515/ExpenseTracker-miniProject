import mongoose from "mongoose";

const categoryBudgetSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: [0, "Category budget amount must be non-negative"]
        }
    },
    { _id: false }
);

const budgetSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        year: {
            type: Number,
            required: true
        },
        totalBudget: {
            type: Number,
            required: true,
            min: [0, "Total budget must be non-negative"],
            default: 0
        },
        categoryBudgets: {
            type: [categoryBudgetSchema],
            default: []
        }
    },
    { timestamps: true }
);

// Compound unique index ensuring one budget document per user per month
budgetSchema.index({ owner: 1, year: 1, month: 1 }, { unique: true });

export const Budget = mongoose.model("Budget", budgetSchema);
