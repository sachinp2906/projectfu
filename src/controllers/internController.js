const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")

const {isValidBody,isValidEmail,isValidMobile,isValid,isValidintern} = require("../validation/validation")


// create intern data

const createIntern = async(req,res) => {

    const data = req.body
    let {name,email,mobile,collegeName} = data

    if (!isValidBody(data)){
        return res.status(400).send({status:false, message:"Interns details required"})

    }
    if (!name)
        return res.status(400).send({status:false, message:"Please enter your name"})
    if(!isValidintern(name))
        return res.status(400).send({status:false,message:"Please enter valid name"})

    if(!email)
        return res.status(400).send({status:false,msg:"please enter email id"})
    if(!isValidEmail(email))
        return res.status(400).send({status:false, msg:"enter valid email id"})
}