const express = require("express");
const controller = require('./../Controller/childController');
const {
    insertValidator,
    updateValidator,
    childIdvalidator
} = require("./../Middlewares/validations/childValidator");

const validatonResult = require("./../Middlewares/validations/validatorResult");
const router = express.Router();
const { isAdmin } = require("./../Middlewares/authenticationMW");


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
