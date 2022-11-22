const express = require('express')
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")


//....................................... create college api...............................

router.post("/functionup/colleges", collegeController.createCollege)


//..........................................Create Intern Api................................
router.post("/functionup/interns", internController.createIntern);

// .........................................GET API..............................................................

router.get("/functionup/collegeDetails", collegeController.getDetails)


// .....................................checkingCompleteAPIPath............................
router.all('/*', function (req, res) {
    return res.status(400).send({ status: false, msg: "Please give right path" })
})

module.exports = router