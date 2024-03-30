const { body, param } = require("express-validator");
const teacherSchema = require("./../../Model/teacherModel");
const childSchema = require("./../../Model/childModel");

exports.insertValidator = [
    // body("_id")
    //     .isInt()
    //     .withMessage("Class ID should be an integer"),
    body("name")
        .isString()
        .withMessage("Class name should be a string"),
    body("supervisor")
        .isMongoId()
        .withMessage("Supervisor (teacher ID) should be an Mongo ID").custom(async (value) => {
            const supervisor = await teacherSchema.findOne({ _id: value });
            if (!supervisor) {
                throw new Error("Supervisor not found");
            }
            return true;
        }),
    body("children")
        .isArray({ min: 1 })
        .withMessage("Children should be an array with at least one element"),
    body("children.*")
        .isInt()
        .withMessage("Children IDs should be integers").custom(async (value) => {
            const child = await childSchema.findOne({ _id: value });
            if (!child) {
                throw new Error("Child not found");
            }
            return true;
        })
];
exports.updateValidator = [
    body("_id")
        .isInt()
        .withMessage("Class ID should be an integer"),
    body("name").optional()
        .isString()
        .withMessage("Class name should be a string"),
    body("supervisor").optional()
        .isMongoId()
        .withMessage("Supervisor (teacher ID) should be an Mongo ID").custom(async (value) => {
            const supervisor = await teacherSchema.findOne({ _id: value });
            if (!supervisor) {
                throw new Error("Supervisor not found");
            }
            return true;
        }),
    body("children").optional()
        .isArray({ min: 1 })
        .withMessage("Children should be an array with at least one element"),
    body("children.*").optional()
        .isInt()
        .withMessage("Children IDs should be integers").custom(async (value) => {
            const child = await childSchema.findOne({ _id: value });
            if (!child) {
                throw new Error("Child not found");
            }
            return true;
        })
];
exports.validateTeacherId = [
    param("id")
        .isMongoId()
        .withMessage("student id should be Monjo Id"),
];
exports.validateChildId = [
    param("id")
        .isInt()
        .withMessage("student id should be integer"),
];
exports.classIdValidator = [
    param("id")
        .isInt()
        .withMessage("Class ID should be an integer"),
];