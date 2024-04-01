/**
 * @swagger
 *  tags:
 *   name: Authentication
 *   description: To Login Admin and Teacher
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as a teacher
 *     tags: [Authentication]
 *     description: Authenticate and generate a JWT token for the teacher.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the teacher.
 *               password:
 *                 type: string
 *                 description: The password of the teacher.
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: A message indicating successful authentication.
 *                   example: Authenticated
 *                 token:
 *                   type: string
 *                   description: JWT token for accessing protected routes.
 *       401:
 *         description: Unauthorized - Incorrect username or password.
 *       500:
 *         description: Internal server error.
 */

const express = require("express");
const router = express.Router();
const { login } = require("../Controller/authenticationController");

router.post("/login", login);

module.exports = router;