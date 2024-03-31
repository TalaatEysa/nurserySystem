/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       required:
 *         - _id
 *         - fullName
 *         - age
 *         - level
 *         - address
 *       properties:
 *         _id:
 *           type: number
 *           description: The ID of the child
 *         fullName:
 *           type: string
 *           description: The full name of the child
 *         age:
 *           type: number
 *           description: The age of the child
 *         level:
 *           type: string
 *           description: The level of the child (PreKG, KG1, KG2)
 *         address:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *               description: The city where the child lives
 *             street:
 *               type: string
 *               description: The street where the child lives
 *             building:
 *               type: string
 *               description: The building where the child lives
 */
/**
 * @swagger
 * tags:
 *   name: Children
 *   description: API endpoints for managing Children
 */

/**
/**
 * @swagger
 * /child:
 *   get:
 *     tags:
 *       - Children
 *     summary: Get all children
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of all children
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Child'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags:
 *       - Children
 *     summary: Create a new child
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Child'
 *     responses:
 *       200:
 *         description: New child created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Child'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /child/{id}:
 *   get:
 *     tags:
 *       - Children
 *     summary: Get child by ID
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the child to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Child found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Child'
 *       404:
 *         description: Child not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Children
 *     summary: Delete child by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the child to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Child deleted successfully
 *       404:
 *         description: Child not found
 *       500:
 *         description: Internal server error
 */


const express = require("express");
const controller = require('./../Controller/childController');
const {
    insertValidator,
    updateValidator,
    childIdvalidator
} = require("./../Middlewares/validations/childValidator");

const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const { isAdmin, isTeacher, isAuthorized } = require("./../Middlewares/authenticationMW");


router
    .route("/child")
    .all(isAdmin)
    .get(controller.getAllChildren)
    .post(insertValidator, validatonResult, controller.insertChild)
    .patch(updateValidator, validatonResult, controller.updateChild)

router.route("/child/:id")
    .all(isAdmin)
    .get(childIdvalidator, validatonResult, controller.getChildById)
    .delete(childIdvalidator, validatonResult, controller.deleteChild)

module.exports = router;
