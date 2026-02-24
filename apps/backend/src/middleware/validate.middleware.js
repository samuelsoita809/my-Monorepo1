import { EVENTS, createLogSignal } from "@inventory/shared";

/**
 * Generic middleware to validate request against a Zod schema
 * @param {z.ZodSchema} schema 
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => async (req, res, next) => {
    try {
        const validatedData = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Attach validated data to the request object
        req.validatedBody = validatedData.body;
        req.validatedQuery = validatedData.query;
        req.validatedParams = validatedData.params;

        next();
    } catch (error) {
        const errorDetails = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
        }));

        console.error(createLogSignal(EVENTS.REQUEST_ERROR, {
            action: "VALIDATION_FAILED",
            details: errorDetails
        }));

        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errorDetails
        });
    }
};
