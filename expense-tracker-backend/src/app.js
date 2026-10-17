import express from "express";
import cors from "cors";
import expenseRouter from "./routes/expense.route.js";
 const app  = express();
 app.use(cors());
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(express.static("public"))
 app.use("/api/v1/expenses", expenseRouter);
 app.get("/",(req,res)=>{
    res.json({message: "Expense Tracker API is running"})
 })
 export default app;