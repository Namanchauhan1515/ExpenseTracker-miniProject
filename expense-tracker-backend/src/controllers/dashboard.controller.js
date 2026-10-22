 
 
 import { asyncHandler } from "../utils/asyncHandler.js"
 import { Expense } from "../models/expense.model.js";
 import { apiResponse } from "../utils/apiResponse.js";
const getExpenseSummary = asyncHandler(async (req, res) => {
const {startDate,endDate}=req.query;
const matchStage = {
    owner:req.user._id
}
if(startDate ||endDate){
    matchStage.date={};
    if(startDate){
        matchStage.date.$gte=new Date(startDate)
    }
           if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            matchStage.date.$lte = end;
        }
    }


const summary = await Expense.aggregate([
    {
        $match: matchStage
        
    },
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
    const categoryWise = await Expense.aggregate([
        {
            $match:matchStage

        },
        {
            $group: {
                _id: "$category",
                totalAmount: {
                    $sum: "$amount"
                }
            }
        },  {
            $sort: {
                totalAmount: -1
            }
        }
    ]);

    const paymentMethodWise = await Expense.aggregate([
        {
          $match: matchStage

        },
        {
            $group: {
                _id: "$paymentMethod",
                totalAmount: {
                    $sum: "$amount"
                }
            }
        },  
        {
            $sort: {
                totalAmount: -1
            }
        }

    ]);
const monthlySpending = await Expense.aggregate([
    {
    $match: matchStage
    },{
        $group:{
            _id:{
                year:{$year:"$date"},
                month:{$month:"$date"}
            },
            totalAmount:{
                $sum:"$amount"
            }
        }
    },{
        $sort:{
            "_id.year":1,
            "_id.month":1

        }
    }
])
const dailySpending = await Expense.aggregate([
  {
   $match: matchStage
  },
  {
    $group:{
        _id:{
            year:{"$year":"$date"},
            month:{"$month":"$date"},
            date:{"$dayOfMonth":"$date"}

        },
        totalAmount:{
            $sum:"$amount"
        }
    }
  },  {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1
            }
        }

])

    return res.status(200).json(
        new apiResponse(
            200,
            {   summary:summaryData,
                categoryWise,
                paymentMethodWise,
                monthlySpending,
                dailySpending
            },
            "Expense summary fetched successfully"
        )
    );
});
 export {getExpenseSummary}