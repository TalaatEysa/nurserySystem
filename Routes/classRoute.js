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

router.route("/class")
    .get(controller.getAllClasses)
    .post(insertValidator, validationResult, controller.insertClass)
    .patch(updateValidator, validationResult, controller.updateClass)

router.route("/class/:id").
    get(classIdValidator, validationResult, controller.getClassById)
    .delete(classIdValidator, validationResult,controller.deleteClass);


router.get("/class/child/:id", validateChildId, validationResult, controller.getClassChildrenInfo);

router.get("/class/teacher/:id", validateTeacherId, validationResult, controller.getClassTeacherInfo);

module.exports = router;
