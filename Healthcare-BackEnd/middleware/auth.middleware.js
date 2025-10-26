// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

// 🚨 IMPORTANT: Replace 'YOUR_JWT_SECRET_KEY' with a long, complex, random string 
// and move it to your .env file (e.g., JWT_SECRET=...)
const JWT_SECRET = process.env.JWT_SECRET || 'a_default_secret_for_development'; 

// 1. JWT Verification Middleware (Validates token and attaches user info)
const verifyToken = (req, res, next) => {
    // 1. Get token from header (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized - Authentication required/failed [cite: 304]
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Authentication failed: No token provided or token format is incorrect."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Attach decoded user info (id, role) to the request object
        req.user = decoded; // decoded will contain { id, role, iat, exp }
        
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        // 401 Unauthorized - Token is invalid or expired
        return res.status(401).json({
            status: "error",
            code: 401,
            message: "Authentication failed: Invalid or expired token."
        });
    }
};

// 2. Role-Based Access Control (RBAC) Middleware
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the user's role (from verifyToken) is in the list of allowed roles
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            // 403 Forbidden - Insufficient permissions [cite: 305]
            return res.status(403).json({
                status: "error",
                code: 403,
                message: `Forbidden: Access restricted to roles: ${allowedRoles.join(', ')}.`
            });
        }
        next();
    };
};


module.exports = {
    verifyToken,
    restrictTo,
    // Note: You will need to implement a separate middleware for 'Own data only'
    // where you check req.params.id against req.user.id
};