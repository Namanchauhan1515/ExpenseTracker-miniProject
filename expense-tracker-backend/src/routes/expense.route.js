import { Router } from "express";
import { createExpense } from "../controllers/expense.controller.js";

const router = Router();

router.post("/", createExpense);

export default router;