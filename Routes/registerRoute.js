const express = require("express");
const controller = require('./../Controller/teacherController');
const {
    insertValidator
} = require("./../Middlewares/validations/teacherValidator");
const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();


router.post("/register",insertValidator, validatonResult, controller.registerTeacher);



module.exports = router;