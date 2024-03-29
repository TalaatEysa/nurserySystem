// File 2: teacherValidator.js
const { body, param } = require("express-validator");

exports.insertValidator = [
    // body("_id")
    //     .isMongoId()
    //     .withMessage("Teacher id should be Monjo Id"),
    body("fullname")
        .isString()
        .withMessage("Teache fullname should be string"),
    body("password")
        .isLength({ min: 5 })
        .withMessage("Teacher password length should be greater than 5"),
    body("email")
        .isEmail()
        .withMessage("Teacher email should be valid email"),
    body("image")
        .isString()
        .withMessage("Teacher image should be string"),
    body("role")
        .isIn(["admin", "teacher"])
        .withMessage("Teacher role should be admin or teacher"),
];

exports.updateValidator = [
    // body("_id")
    //     .isInt()
    //     .withMessage("Teacher id should be integer"),
    body("fullname").optional()
        .isString()
        .withMessage("Teache fullname should be string"),
    body("password").optional()
        .isLength({ min: 5 })
        .withMessage("Teacher password length should be greater than 5"),
    body("email").optional()
        .isEmail()
        .withMessage("Teacher email should be valid email"),
    body("image").optional()
        .isString()
        .withMessage("Teacher image should be string"),
    body("role")
        .isIn(["admin", "teacher"])
        .withMessage("Teacher role should be admin or teacher"),
];
exports.validateId = [
    param("id")
        .isMongoId()
        .withMessage("Teacher id should be Monjo Id"),
];
