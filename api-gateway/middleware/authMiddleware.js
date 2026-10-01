const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.JWT_SECRET || "floodwatch-development-secret";

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: "ERROR",
            message: "Access token required"
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {

        if (error) {
            return res.status(403).json({
                status: "ERROR",
                message: "Invalid or expired token"
            });
        }

        req.user = user;

        next();
    });
};

module.exports = authenticateToken;