/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for authentication
 */

/**
 * @swagger
 * /authentication/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the teacher
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the teacher
 *     responses:
 *       '200':
 *         description: Authentication successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Message indicating successful authentication
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '400':
 *         description: Bad request, invalid data provided
 *       '401':
 *         description: Unauthorized, teacher not found or password does not match
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const { login } = require("../Controller/authenticationController");

router.post("/login", login);

module.exports = router;