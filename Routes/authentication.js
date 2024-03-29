const express = require("express");
const router = express.Router();
const { login } = require("../Controller/authenticationController");

router.post("/login", login);

module.exports = router;