import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank", "other"],
      default: "cash"
    },

    date: {
      type: Date,
      default: Date.now
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },{timestamps: true})

export const Expense = mongoose.model("Expense",expenseSchema)