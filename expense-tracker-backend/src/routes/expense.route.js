import { Router } from "express";

import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    updateExpense
} from "../controllers/expense.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createExpense);

router.get("/", getAllExpenses);

router.patch("/:id", updateExpense);

router.delete("/:id", deleteExpense);

export default router;