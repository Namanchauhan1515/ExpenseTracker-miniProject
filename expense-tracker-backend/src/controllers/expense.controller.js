import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Expense} from "../models/expense.model.js"

const createExpense = asyncHandler(async(req,res)=>{
const {
        amount,
        category,
        description,
        paymentMethod,
        date
    } = req.body;

    // Validate amount
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
        throw new apiError(400, "Invalid amount");
    }

    // Validate category
    if (!category || !category.trim()) {
        throw new apiError(400, "Category is required");
    }

    // Create expense
    const expense = await Expense.create({
        amount: numericAmount,
        category: category.trim(),
        description: description?.trim(),
        paymentMethod,
        date,
        owner: req.user._id
    });

    if (!expense) {
        throw new apiError(500, "Failed to create expense");
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                expense,
                "Expense created successfully"
            )
        );
});
const getAllExpenses = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
  if (page < 1 || limit < 1) {
        throw new apiError(
            400,
            "Page and limit must be greater than 0"
        );
    }
     const skip = (page - 1) * limit;

    const {category,paymentMethod,startDate,endDate} = req.query
    console.log("category:",category) 
const match={
    owner:req.user._id
}
console.log("User ID:", req.user._id);
console.log("User ID type:", typeof req.user._id);
console.log("Match:", match);
if(category){
    match.category=category
}
if(paymentMethod){
    match.paymentMethod = paymentMethod
}
 if (startDate || endDate) {

        match.date = {};

        if (startDate) {
            match.date.$gte = new Date(startDate);
        }

        if (endDate) {
            match.date.$lte = new Date(endDate);
        }
    }
    const allowedSortFields = [
        "createdAt",
        "date",
        "amount"
    ];
     const sortBy = allowedSortFields.includes(req.query.sortBy)
        ? req.query.sortBy
        : "createdAt";

    const order = req.query.order === "asc" ? 1 : -1;


    const result = await Expense.aggregate([
        {
            $match:match
        },
        {
            $sort: {
               [sortBy] : order
            }
        },
         {
            $project: {
                amount: 1,
                category: 1,
                description: 1,
                paymentMethod: 1,
                date: 1,
                createdAt: 1
            }
        },
          {
            $facet: {
                data:[
                    {
                        $skip:skip
                    },
                    {
                        $limit:limit
                    }
                ],
                totalCount:[
                    {
                        $count:"count"
                    }
                ]
            }
        }
    ]);
    // console.log(result);

    const expense =  result[0].data;
   

    // console.log("expense:",expense)
    const totalExpenses = result[0].totalCount[0]?.count ||0;
    // console.log("totalExpense:",totalExpenses)
    const totalPage = Math.ceil(totalExpenses/limit)
    // console.log("totalPage:",totalPage)
    return res
        .status(200)
        .json(
            new apiResponse(
                200,{
                expense,
                pagination: {
                    currentPage: page,
                    limit: limit,
                    totalExpenses: totalExpenses,
                    totalPages: totalPage,

                    hasNextPage: page < totalPage,

                    hasPreviousPage: page > 1
                 }
                },
            

                "Expenses fetched successfully"
            )
        );
});
const getExpenseById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const expense = await Expense.findOne({
        _id: id,
        owner: req.user._id
    });

    if (!expense) {
        throw new apiError(404, "Expense not found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                expense,
                "Expense fetched successfully"
            )
        );
});
const updateExpense = asyncHandler(async (req, res) => {

    const { amount, category, description, paymentMethod, date } = req.body;

    if (amount === undefined &&
        category === undefined &&
        description === undefined &&
        paymentMethod === undefined &&
        date === undefined) {
        throw new apiError(400, "At least one field is required");
    }

    if (amount !== undefined) {
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 0) {
            throw new apiError(400, "Invalid amount");
        }
    }

    if (category !== undefined && !category.trim()) {
        throw new apiError(400, "Category cannot be empty");
    }

    const expense = await Expense.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.user._id
        },
        {
            $set: {
                ...(amount !== undefined && {
                    amount: Number(amount)
                }),

                ...(category !== undefined && {
                    category: category.trim()
                }),

                ...(description !== undefined && {
                    description: description.trim()
                }),

                ...(paymentMethod !== undefined && {
                    paymentMethod
                }),

                ...(date !== undefined && {
                    date
                })
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!expense) {
        throw new apiError(404, "Expense not found");
    }

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
export{createExpense, getAllExpenses,getExpenseById,updateExpense,deleteExpense}