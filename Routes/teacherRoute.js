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
const {isAdmin, isTeacher,isAuthorized} = require("./../Middlewares/authenticationMW");

router
    .route("/teachers")
    .get(isAdmin, controller.getAllTeachers)
    .post(isAdmin, insertValidator, validatonResult, controller.insertTeacher)
    .patch(isAuthorized, updateValidator, validatonResult, controller.updateTeacher);

router.get("/teachers/supervisors", isAdmin, controller.getAllSupervisors);
router.patch("/teachers/changePassword/:id", isAuthorized, validateId, changePasswordValidator, validatonResult, controller.changePassword);

router.route("/teachers/:id")
    .all(isAdmin)
    .get(validateId, validatonResult, controller.getTeacherById)
    .delete(validateId, validatonResult, controller.deleteTeacher);




module.exports = router;