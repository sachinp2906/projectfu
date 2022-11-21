const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

// { name: {mandatory}, email: {mandatory, valid email, unique}, mobile: {mandatory, valid mobile number, unique}, collegeId: {ObjectId, ref to college model, isDeleted: {boolean, default: false}}

const internSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            trim:true,
        },

        email: {
            type:String,
            lowercase:true,
            unique:true,
            required:true,
            trim:true,
        },

        mobile: {
            type: String,
            unique:true,
            trim:true,
            required:true,

        },
        collegeId :{
            type: ObjectId,
            ref: "collegeDetail",
            trim: true,

        },
        isDeleted:{
            type:Boolean,
            default:false,
        },

    },
    {timestamps:true}
);


module.exports = mongoose.model("intern" , internSchema)

