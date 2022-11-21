const collegeModel = require("../models/collegeModel")

const { isValid, isValidBody } = require("../validation/validation")

const createCollege = async (req, res) => {

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
            return res.status(400).send({ status: false, message: "College name is required" });
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






