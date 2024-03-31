/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - name
 *         - supervisor
 *         - children
 *       properties:
 *         _id:
 *           type: integer
 *           description: The ID of the class
 *         name:
 *           type: string
 *           description: The name of the class
 *         supervisor:
 *           type: string
 *           format: objectId
 *           description: The ID of the teacher supervising the class
 *         children:
 *           type: array
 *           items:
 *             type: number
 *           description: Array of IDs of children in the class
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: API endpoints for managing classes
 */

/**
 * @swagger
 * /class:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     responses:
 *       '200':
 *         description: A list of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       '500':
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       '200':
 *         description: New class created
 *       '400':
 *         description: Bad request, invalid data provided
 *       '404':
 *         description: Teacher or children not found
 *       '500':
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update class information
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       '200':
 *         description: Class information updated
 *       '400':
 *         description: Bad request, invalid data provided
 *       '404':
 *         description: Class not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /class/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the class to retrieve
 *     responses:
 *       '200':
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       '404':
 *         description: Class not found
 *       '500':
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the class to delete
 *     responses:
 *       '200':
 *         description: Class deleted successfully
 *       '404':
 *         description: Class not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /class/child/{id}:
 *   get:
 *     summary: Get class information by child ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID of the child
 *     responses:
 *       '200':
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       '404':
 *         description: Class not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /class/teacher/{id}:
 *   get:
 *     summary: Get class information by teacher ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the teacher
 *     responses:
 *       '200':
 *         description: Class found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       '404':
 *         description: Class not found
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const controller = require('./../Controller/classController');
const {
    insertValidator,
    updateValidator,
    validateChildId,
    validateTeacherId,
    classIdValidator
} = require("./../Middlewares/validations/classValidator");
const validationResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const { isAdmin, isTeacher, isAuthorized } = require("./../Middlewares/authenticationMW");


router.route("/class")
    .all(isAdmin)
    .get(controller.getAllClasses)
    .post(insertValidator, validationResult, controller.insertClass)
    .patch(updateValidator, validationResult, controller.updateClass)

router.route("/class/:id")
    .all(isAdmin)
    .get(classIdValidator, validationResult, controller.getClassById)
    .delete(classIdValidator, validationResult,controller.deleteClass);


router.get("/class/child/:id", isAdmin, validateChildId, validationResult, controller.getClassChildrenInfo);

router.get("/class/teacher/:id", isAdmin, validateTeacherId, validationResult, controller.getClassTeacherInfo);

module.exports = router;
