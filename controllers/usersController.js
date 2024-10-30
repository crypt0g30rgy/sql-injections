const mysql = require("mysql2/promise");

// MySQL connection pool
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

// Get user by Name
// Vulnerable function to secondary sql injections
const getUserByName = async (req, res) => {
    try {

        // Access user info via req.user
        const { username, email } = req.user;

        console.log(username)
        console.log(email)

        // const username ="test1111"

        // Query the database for the user with the extracted username
        const [rows] = await pool.execute(
            'SELECT id, username, email FROM users WHERE username = \'' + username + '\''
        );

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(404).json({ Error: "User not found." });
        }

        // Return the user data
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ Error: "Invalid token." });
        }
        return res.status(500).json({ Error: "Server Error." });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT id, username, email FROM users");
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute("SELECT id, username, email FROM users WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ Error: "User not found." });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

// Update user by ID
const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const [result] = await pool.execute(
            "UPDATE users SET username = ?, email = ? WHERE id = ?",
            [username, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "User not found." });
        }

        return res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

// Remove user by ID
const removeUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "User not found." });
        }

        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ Error: "Server Error." });
    }
};

module.exports = { getUserByName, getAllUsers, getUserById, updateUserById, removeUserById }