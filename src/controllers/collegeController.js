// ..............................ImportModules.............................................
const { rawListeners } = require("../models/collegeModel");
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const { isValid, isValidBody } = require("../validation/validation")


// ..................................CreateCollegeDetail...................................


exports.createCollege = async (req, res) => {

    try {
        let data = req.body;
        const { name, fullName, logoLink, isDeleted } = data;

        if (!isValidBody(data))
            return res.status(400).send({ status: false, message: "Data is required to create college" });

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "College name is required" });
        }

        let duplicateName = await collegeModel.findOne({ name: name });
        if (duplicateName) {
            return res.status(400).send({ status: false, message: "College name already exists" })
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "College  fullName is required" });
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "Logo is required" });
        }

        const newCollege = await collegeModel.create({ name, fullName, logoLink, isDeleted });

        return res.status(201).send({ status: true, data: newCollege });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

// .................................FetchingInternDetailWithCollegeDetail..................


exports.getDetails = async function (req, res) {
    let collegeName = req.query.name
    if (!collegeName) return res.status(400).send({ status: false, msg: "please provide college name in query" })
    let collegeDetail = await collegeModel.findOne({ name: collegeName })
    if (collegeDetail.isDeleted == true) return res.status(400).send({ status: false, msg: "college data is deleted" })
    if (!collegeDetail) return res.status(404).send({ status: false, msg: "no collegeName found" })
    const cDetail = { name: collegeDetail.name, fullName: collegeDetail.fullName, logoLink: collegeDetail.logoLink }
    let Name = collegeDetail._id
    let internDetail = await internModel.find({ collegeId: Name }).select({ name: 1, email: 1, mobile: 1 })
    if (internDetail.length === 0) return res.status(404).send({ status: false, msg: "no intern found" })
    res.send({ data: cDetail, intern: internDetail })
}





