// Import the required modules
const express = require('express');
const router = express.Router();

// Controllers (assume these are imported or defined elsewhere in your code)
const { createUser, login } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
*               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid request data
 */
router.post("/register", createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User Logged In successfully.
 *       400:
 *         description: Invalid request data
 */
router.post("/login", login);

module.exports = router;