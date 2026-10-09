import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true

    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    Owner:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps: true})

export const Expense = mongoose.model("Expense",expenseSchema)