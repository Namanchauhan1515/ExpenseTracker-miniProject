import { Router } from "express";
import { createExpense ,deleteExpense} from "../controllers/expense.controller.js";

const router = Router();

router.post("/", createExpense);
router.delete("/:id", deleteExpense);

export default router;