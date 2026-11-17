import { Router } from "express";
import {
    getMonthlyBudget,
    upsertBudget,
    deleteBudget
} from "../controllers/budget.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all budget routes with verifyJWT
router.use(verifyJWT);

router
    .route("/")
    .get(getMonthlyBudget)
    .post(upsertBudget)
    .delete(deleteBudget);

router.route("/:id").delete(deleteBudget);

export default router;
