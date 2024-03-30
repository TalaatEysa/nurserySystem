const express = require("express");
const controller = require('./../Controller/childController');
const {
    insertValidator,
    updateValidator,
    childIdvalidator
} = require("./../Middlewares/validations/childValidator");

const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();

router
    .route("/child")
    .get(controller.getAllChildren)
    .post(insertValidator, validatonResult, controller.insertChild)
    .patch(updateValidator, validatonResult, controller.updateChild)

router.route("/child/:id")
    .get(childIdvalidator, validatonResult, controller.getChildById)
    .delete(childIdvalidator, validatonResult, controller.deleteChild)

module.exports = router;
