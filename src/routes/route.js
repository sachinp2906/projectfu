const express = require('express')
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")


// create college api

router.post("/functionup/colleges",collegeController.createCollege)
//--- Create Intern Api -----------
router.post("/functionup/interns", internController.createIntern);



module.exports = router