import { AuthService } from "../services/auth.service.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await AuthService.verifyToken(token);

        if (!decoded) {
            console.warn(createLogSignal(EVENTS.ABUSE_TRIGGERED, {
                reason: "INVALID_TOKEN_ATTEMPT",
                path: req.path
            }));
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
};
