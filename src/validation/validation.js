const {isValidObjectId} = require("mongoose")

// validation for name 

const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z( \)]{1,20}$/
    return nameRegex.test(name)
}

// validation for title

const isValidTitle =function(title){
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

//Phone Validation
const isValidPhone =function(value){
    const  phoneRegex =/^[0-9]{10}$/
    return phoneRegex.test(value)
}


//Email Validation

const isValidEmail = function(email){
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,5})*$/ 
    return emailRegex.test(email)
}

//ObjectId Validation


const isValidPass= (value)=>{
    const passRegex = /^[a-zA-Z0-9@$]*$/
    return passRegex.test(value)
}


const  isValidObjectIds =function(id){
    const ObjectId = isValidObjectId(id);
    return ObjectId
}

//Boolean Validation

const isBoolean = function(value){
    if(value === true || value === false) return true
    return false
}

// Each Field has to Valid Means String

const isValid = function(value){
    if(typeof value ==='undefined' || value ===null)  return false
    if(typeof value ==='string' && value.trim().length > 0) return true
}
       
// Each Field has to Valid Means String and Number only not special Charactors
const isValidBookTitle = function(title){
    const bTitleregex = /^[A-Za-z0-9( \)]*$/
    return bTitleregex.test(title)
}
function checkDate(str) {     // 2022 - 11 - 29
    var re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/ 
    return re.test(str);
}


module.exports = { isValidName, isValidTitle,isValidPhone, isValidEmail,isValidPass, isValidObjectIds, isBoolean, isValid ,isValidBookTitle , checkDate}