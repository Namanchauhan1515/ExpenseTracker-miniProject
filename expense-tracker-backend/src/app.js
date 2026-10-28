import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
 const app  = express();
 app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(express.static("public"))
 app.use(cookieParser());
 // expense routes
import expenseRouter from "./routes/expense.route.js";

 app.use("/api/v1/expenses", expenseRouter);
//  user routes

import userRouter from "./routes/user.route.js";

app.use("/api/v1/users", userRouter);

//Dashboard
import dashboardRouter from "./routes/dashboard.route.js";

app.use("/api/v1/dashboard", dashboardRouter);

 app.get("/",(req,res)=>{
    res.json({message: "Expense Tracker API is running"})
 })
 export default app;