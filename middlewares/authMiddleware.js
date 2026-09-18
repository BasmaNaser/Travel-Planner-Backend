const jwt = require("jsonwebtoken");
const Apierror = require("../utils/apiError");
const util = require('util');

async function authentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new Apierror('Please log in to access this page', 401));
        }

        if (!authHeader.startsWith('Bearer ')) {
            return next(new Apierror('Invalid session. Please log in again', 401));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new Apierror('Please log in to access this page', 401));
        }

        let verifyToken = util.promisify(jwt.verify);
        const decode = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new Apierror('Your session has expired. Please log in again', 401));
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new Apierror('Invalid access token. Please log in again', 401));
        }
        next(error);
    }
}

module.exports = authentication;