const express = require('express')
const router = express.Router();
const collegeController = require("../controllers/collegeController")
// const internController = require("../controllers/internController")


// create college api

router.post("/functionup/colleges",collegeController.createCollege)





module.exports = router