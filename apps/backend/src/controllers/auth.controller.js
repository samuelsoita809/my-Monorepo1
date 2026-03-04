import { AuthService } from "../services/auth.service.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

export const AuthController = {
    async register(req, res, next) {
        try {
            const { email, password, role } = req.body;

            // Check if user exists
            const existingUser = await AuthService.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: "Email already registered" });
            }

            const data = await AuthService.register(email, password, role);

            console.log(createLogSignal(EVENTS.REQUEST_SUCCESS, {
                action: "USER_REGISTERED",
                email: data.user.email
            }));

            res.status(201).json(data);
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const data = await AuthService.login(email, password);

            console.log(createLogSignal(EVENTS.REQUEST_SUCCESS, {
                action: "USER_LOGGED_IN",
                email: data.user.email
            }));

            res.json(data);
        } catch (error) {
            if (error.message === "Invalid credentials") {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            next(error);
        }
    },

    async getMe(req, res, next) {
        try {
            // User is already attached to req by authMiddleware
            res.json({ user: req.user });
        } catch (error) {
            next(error);
        }
    }
};
