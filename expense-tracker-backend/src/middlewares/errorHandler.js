import { apiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof apiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new apiError(statusCode, message, error?.errors || error?.error || []);
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || "Something went wrong",
        errors: error.error || error.errors || []
    });
};

export { errorHandler };
export default errorHandler;
