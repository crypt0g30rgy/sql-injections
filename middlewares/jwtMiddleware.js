const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// localhost

// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Extract token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ Error: "Authorization token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user information from the database
    const [rows] = await pool.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId]
    );

    // Check if user exists
    if (rows.length === 0) {
      return res.status(404).json({ Error: "User not found." });
    }

    // Attach user information to the request object
    req.user = rows[0]; // Attach user data (username, email, etc.)

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ Error: "Invalid token." });
    }
    return res.status(500).json({ Error: "Server Error." });
  }
};

module.exports = authMiddleware;