/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - fullname
 *         - password
 *         - email
 *         - image
 *         - role
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: The ID of the teacher
 *         fullname:
 *           type: string
 *           description: The full name of the teacher
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the teacher
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the teacher
 *         image:
 *           type: string
 *           description: The filename of the teacher's image
 *         role:
 *           type: string
 *           enum: [admin, teacher]
 *           description: The role of the teacher (admin or teacher)
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get all teachers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags:
 *       - Teachers
 *     summary: Register a new teacher
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, teacher]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: New teacher added successfully
 *       400:
 *         description: Bad request, invalid data provided
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     tags:
 *       - Teachers
 *     summary: Update teacher information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID of the teacher to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, teacher]
 *               image:
 *                 type: string
 *                 format: binary
 * 
 *     responses:
 *       200:
 *         description: Teacher information updated successfully
 *       400:
 *         description: Bad request, invalid data provided
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 *
 * /teachers/{id}:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get teacher by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID of the teacher to retrieve
 *     responses:
 *       200:
 *         description: Teacher found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags:
 *       - Teachers
 *     summary: Delete teacher by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID of the teacher to delete
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 *
 * /teachers/supervisors:
 *   get:
 *     tags:
 *       - Teachers
 *     summary: Get all supervisors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all supervisors
 *       404:
 *         description: No supervisors found
 *       500:
 *         description: Internal server error
 *
 * /teachers/changePassword/{id}:
 *   patch:
 *     tags:
 *       - Teachers
 *     summary: Change teacher password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID of the teacher to change password for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request, invalid data provided
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const controller = require('./../Controller/teacherController');
const {
    insertValidator,
    updateValidator,
    validateId,
    changePasswordValidator
} = require("./../Middlewares/validations/teacherValidator");
const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const { isAdmin, isTeacher, isAuthorized } = require("./../Middlewares/authenticationMW");
const imageController = require("./../Controller/imageController");


router
    .route("/teachers")
    .all(isAdmin)
    .get( controller.getAllTeachers)
    .post(imageController.upload.single("image"), insertValidator, validatonResult, controller.insertTeacher)

    .patch( imageController.upload.single("image"),updateValidator, validatonResult, controller.updateTeacher);

router.get("/teachers/supervisors", isAdmin ,controller.getAllSupervisors);
router.patch("/teachers/changePassword/:id",isAuthorized , validateId, changePasswordValidator, validatonResult, controller.changePassword);

router.route("/teachers/:id")
    .get(isAuthorized,validateId, validatonResult, controller.getTeacherById)
    .delete(isAdmin,validateId, validatonResult, controller.deleteTeacher);




module.exports = router;