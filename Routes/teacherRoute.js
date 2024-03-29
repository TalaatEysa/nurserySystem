const express = require("express");
const controller = require('./../Controller/teacherController');
const {
    insertValidator,
    updateValidator,
    validateId
} = require("./../Middlewares/validations/teacherValidator");
const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const {isAdmin, isTeacher} = require("./../Middlewares/authenticationMW");

router
    .route("/teachers")
    .get(isAdmin,controller.getAllTeachers)
    .post(isTeacher,insertValidator, validatonResult, controller.insertTeacher)
    .patch(isTeacher,updateValidator, validatonResult, controller.updateTeacher)
    // .delete(controller.deleteTeacher)

// router.get("/teachers/:id", validateId, validatonResult, controller.getTeacherById)
router.route("/teachers/:id")
    .all(isAdmin)
    .get(validateId, validatonResult, controller.getTeacherById)
    .delete(validateId, validatonResult, controller.deleteTeacher)

router.get("/teachers/supervisors",isAdmin, controller.getAllSupervisors)


module.exports = router;