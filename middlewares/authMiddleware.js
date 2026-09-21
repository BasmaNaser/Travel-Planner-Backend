const jwt = require("jsonwebtoken");
const Apierror = require("../utils/apiError");
const util = require("util");

async function authentication(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new Apierror("Please log in to access this page", 401));
        }

        if (!authHeader.startsWith("Bearer ")) {
            return next(new Apierror("Invalid session. Please log in again", 401));
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(new Apierror("Please log in to access this page", 401));
        }

        const verifyToken = util.promisify(jwt.verify);

        const decoded = await verifyToken(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(
                new Apierror(
                    "Your session has expired. Please log in again",
                    401
                )
            );
        }

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

const protect = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Please login first",
      });
    }


    const token =
      authHeader.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    req.user = decoded;


    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });

  }
};

module.exports = protect;

module.exports = authentication;