const express = require("express");
const router = express.Router();

const { getRoot } = require("../controllers/indexController");

//Get Root

/**
 * @swagger
 * tags:
 *   name: Root
 *   description: the Root
 * /:
 *   get:
 *     summary: Return the Root Message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Root Message
 */

router.get("/", getRoot)

module.exports = router;