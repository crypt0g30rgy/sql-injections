// Import the required modules
const express = require('express');
const router = express.Router();

// Controllers (assume these are imported or defined elsewhere in your code)
const { getUserByName, getAllUsers, getUserById, updateUserById, removeUserById } = require('../controllers/usersController');

const authMiddleware = require("../middlewares/jwtMiddleware");
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and retrieval
 */

/**
 * @swagger
 * /v1/me:
 *   get:
 *     summary: Get the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the current user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 */
router.get("/me", authMiddleware, getUserByName);

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get("/users/:id", getUserById);

/**
 * @swagger
 * /v1/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       description: User data to update
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
 *     responses:
 *       200:
 *         description: Successfully updated user data.
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: User not found
 */
router.patch("/users/:id", updateUserById);

/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found
 */
router.delete("/users/:id", removeUserById);

module.exports = router;