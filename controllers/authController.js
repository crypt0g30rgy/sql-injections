const mysql = require("mysql2/promise"); // Using promise-based mysql for async/await support
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a MySQL connection pool (better than creating a single connection)
// const pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ Error: "Missing required fields." });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user with the hashed password
        const [rows] = await pool.execute(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword] // Store hashed password instead of plain text
        );

        // Return success response
        return res.status(201).json({ message: "User created successfully", userId: rows.insertId });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ Error: "Email and password are required." });
    }

    try {
        // Query to find user by email
        const [rows] = await pool.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        console.log(rows)

        // Check if user exists
        if (rows.length === 0) {
            return res.status(401).json({ Error: "Invalid email or password." });
        }

        const user = rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ Error: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Return success response with token
        return res.status(200).json({
            message: "Login successful",
            token: token,
        });

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

module.exports = { createUser, login };
