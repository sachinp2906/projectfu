const mongoose=require('mongoose')
// { name: { mandatory, unique, example iith}, fullName: {mandatory, example `Indian Institute of Technology, Hyderabad`}, logoLink: {mandatory}, isDeleted: {boolean, default: false}

const collegeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullname : {
        type : String,
        required : true,
        trim : true
    },
    logoLink : {
        type : String,
        required : true,
        trim : true
    },
    isDeleted : {
        type : Boolean,
        default : false,
        trim : true,
    } ,
},
    {timestamps:true}
);


module.exports = mongoose.model('collegeDetail' , collegeSchema)