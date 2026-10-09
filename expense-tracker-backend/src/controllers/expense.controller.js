import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Expense} from "../models/expense.model.js"

const createExpense = asyncHandler(async(req,res)=>{
const {title,amount} = req.body;
if(!title.trim() || amount<0){
    throw new apiError(400,"Invalid expense data")
}
const expense = await Expense.create({title,amount})
if(!expense){
    throw new apiError(500,"Failed to create expense")
}

return res.status(201).json(new apiResponse(201,"Expense created successfully",expense))

})
const deleteExpense = asyncHandler(async(req,res)=>{
const {id} = req.params;
const expense = await Expense.findByIdAndDelete(id);
if(!expense){
    throw new apiError(404,"Expense not found")
}
return res.status(200).json(new apiResponse(200,[],"Expense deleted successfully"))
}
)
const getAllExpenses = asyncHandler(async(req,res)=>{

}
)
export{createExpense, deleteExpense}