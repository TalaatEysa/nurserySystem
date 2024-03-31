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
const { isAdmin } = require("./../Middlewares/authenticationMW");


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
