import { Router } from "express";

import {
    getExpenseSummary
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/summary",
    verifyJWT,
    getExpenseSummary
);

export default router;