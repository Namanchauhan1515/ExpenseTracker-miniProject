import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Expense} from "../models/expense.model.js"

const createExpense = asyncHandler(async(req,res)=>{
const {title,amount} = req.body;
if(!title.trim() || amount<0){
    throw new apiError(400,"Invalid expense data")
}
const expense = await Expense.create({title,
    amount:Number(amount),
    owner:req.user._id
})
if(!expense){
    throw new apiError(500,"Failed to create expense")
}

return res.status(201).json(new apiResponse(201,"Expense created successfully",expense))

})
const deleteExpense = asyncHandler(async(req,res)=>{
const {id} = req.params;
const expense = await Expense.findOneAndDelete({
    _id:id,
    owner:req.user._id
});
if(!expense){
    throw new apiError(404,"Expense not found")
}
return res.status(200).json(new apiResponse(200,[],"Expense deleted successfully"))
}
)
const getAllExpenses = asyncHandler(async (req, res) => {

    const expenses = await Expense.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                expenses,
                "Expenses fetched successfully"
            )
        );
});
const updateExpense = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, amount } = req.body;

    const expense = await Expense.findOne({
        _id: id,
        owner: req.user._id
    });

    if (!expense) {
        throw new apiError(404, "Expense not found");
    }

    if (title !== undefined) {
        if (!title.trim()) {
            throw new apiError(400, "Title cannot be empty");
        }

        expense.title = title;
    }

    if (amount !== undefined) {
        if (Number(amount) < 0) {
            throw new apiError(400, "Amount cannot be negative");
        }

        expense.amount = Number(amount);
    }

    await expense.save();

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                expense,
                "Expense updated successfully"
            )
        );
});
export{createExpense, deleteExpense, getAllExpenses, updateExpense}