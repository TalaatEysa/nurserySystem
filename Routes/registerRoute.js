/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API endpoints for managing teachers
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the teacher
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the teacher
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the teacher
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the teacher
 *     responses:
 *       '200':
 *         description: New teacher registered successfully
 *       '400':
 *         description: Bad request, invalid data provided or image is missing
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const controller = require('./../Controller/teacherController');
const {
    insertValidator
} = require("./../Middlewares/validations/teacherValidator");
const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const imageController = require("./../Controller/imageController");


router.post("/register", imageController.upload.single("image"),insertValidator, validatonResult, controller.registerTeacher);



module.exports = router;