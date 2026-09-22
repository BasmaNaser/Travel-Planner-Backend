
const jwt = require("jsonwebtoken");
const Apierror = require("../utils/apiError");
const util = require("util");

async function authentication(req, res, next) {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(
                new Apierror(
                    "Please log in to access this page",
                    401
                )
            );
        }

        // 2. Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return next(
                new Apierror(
                    "Invalid session. Please log in again",
                    401
                )
            );
        }

        // 3. Get token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(
                new Apierror(
                    "Please log in to access this page",
                    401
                )
            );
        }

        // 4. Verify token
        const verifyToken = util.promisify(jwt.verify);

        const decoded = await verifyToken(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // 5. Save decoded user inside request
        req.user = decoded;

        // Temporary debugging
        console.log("Decoded User:", decoded);

        // 6. Continue to controller
        next();

    } catch (error) {

        // Token expired
        if (error.name === "TokenExpiredError") {
            return next(
                new Apierror(
                    "Your session has expired. Please log in again",
                    401
                )
            );
        }

        // Invalid token
        if (error.name === "JsonWebTokenError") {
            return next(
                new Apierror(
                    "Invalid access token. Please log in again",
                    401
                )
            );
        }

        next(error);
    }
}

module.exports = authentication;
