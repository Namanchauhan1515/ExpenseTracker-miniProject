import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. Protect all routes in this router at once
router.use(verifyJWT);

// 2. Base collection routes: GET (all) & POST (create)
router
  .route("/")
  .get(getAllExpenses)
  .post(createExpense);

// 3. Document-specific routes: GET, PATCH, DELETE by ID
router
  .route("/:id")
  .get(getExpenseById)
  .patch(updateExpense)
  .delete(deleteExpense);

export default router;