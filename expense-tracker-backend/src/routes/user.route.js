import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    updateUser,
    updateUserAvatar
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();


// ================= PUBLIC ROUTES =================

// Register
router.post(
    "/register",
    upload.single("avatar"),
    registerUser
);

// Login
router.post(
    "/login",
    loginUser
);

// Refresh access token
router.post(
    "/refresh-token",
    refreshAccessToken
);


// ================= PROTECTED ROUTES =================

router.use(verifyJWT);

// Logout
router.post(
    "/logout",
    logoutUser
);

// Get current user
router.get(
    "/current-user",
    getCurrentUser
);

// Update username/email
router.patch(
    "/update",
    updateUser
);

// Change password
router.patch(
    "/change-password",
    changePassword
);

// Update avatar
router.patch(
    "/avatar",
    upload.single("avatar"),
    updateUserAvatar
);


export default router;