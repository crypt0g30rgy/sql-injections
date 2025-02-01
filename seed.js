const mysql = require('mysql2/promise');

async function setupDatabase() {
    // Create a connection to the MySQL database
    // const pool = await mysql.createPool({
    //     host: 'db',     // Replace with your host
    //     user: 'root',          // Replace with your database username
    //     password: 'passswd',  // Replace with your database password
    //     database: 'demo'  // Replace with your database name
    // });

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

    // const pool = await mysql.createPool({
    //     host: 'localhost',     // Replace with your host
    //     user: 'root',          // Replace with your database username
    //     database: 'demo'  // Replace with your database name
    // });

    // Create the users table
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Seed some user data
    const users = [
        { username: 'johndoe', email: 'johndoe@example.com', password: 'password123' },
        { username: 'janedoe', email: 'janedoe@example.com', password: 'password456' },
        { username: 'alice', email: 'alice@example.com', password: 'password789' }
    ];

    for (const user of users) {
        await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [user.username, user.email, user.password]
        );
    }

    console.log('Users table created and seeded successfully.');
    await pool.end();
}

setupDatabase().catch(err => console.error('Error setting up the database:', err));