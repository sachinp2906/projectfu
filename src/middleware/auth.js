const jwt = require("jsonwebtoken")
const moment = require("moment/moment")
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { isValidName, isValidTitle, isValidPhone, isValidEmail, isValidPass, isValid, isValidBookTitle, isValidObjectIds, checkDate } = require('../validation/validation')

const userCreateValidation = function (req, res, next) {
try {
    if (Object.keys(req.body).length == 0){
        return res.status(400).send({ status: false, message: 'No User Data Exist in Body' })
    }
    const { title, name, phone, email, password, address } = req.body
    if (!isValid(name)) {
        return res.status(400).send({status: false, message: "Enter User Name" })
    }
    if (!isValidName(name)) {
        return res.status(400).send({status: false, message: "Name only take alphabets"})
    }
    if (!isValid(title)) {
        return res.status(400).send({status: false, message: "Enter Title Name" })
    }
    if (!isValidTitle(title)) {
        return res.status(400).send({status: false, message: "Enter title from this ['Mr', 'Mrs', 'Miss']" })
    }
    if (!isValid(email)) {
        return res.status(400).send({status: false, message: "Enter Email-Id" })
    }
    if (!isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "enter valid email" })
    }
    if (!password) {
        return res.status(400).send({ status: false, message: 'Password Mandatory !' })
    }
    if (password.length < 8 || password.length > 15){
        return res.status(400).send({ status: false, message: 'Password Must be Contain Min 8 or Max 15 Charactors !' })
    }
    if (!isValidPass(password)){
         return res.status(400).send({ status: false, message: 'inValid Password !' })
    }
    if (!phone){
        return res.status(400).send({status: false, message: "Enter The Phone Number !" })
    } 
    if (!isValidPhone(phone)){
        return res.status(400).send({status: false, message: "Please Enter valid Phone Number !" })
    } 
    if (address) {
        const { street, city, pincode } = address
        if (street) {
            if (!isValidName(street)) {
                return res.status(400).send({status: false, message: "Please Enter valid Street Name !" })
            }   }
        if (city) {
            if (!isValidName(city)) {
                return res.status(400).send({status: false, message: "Please Enter valid City Name !" })
            } }
        if (pincode) {
            if (!/^[0-9]{6}$/.test(pincode)) {
                return res.status(400).send({ status: false, message: "Please Enter valid Pin-Code !" })
            } } }

    next()
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//  **********************************************************  Book Creation  Validation *****************

const bookCreateValidation = function (req, res, next) {
    
    try {
        console.log(req.body)
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: 'No User Data Exist in Body' })
        const { title , excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body
        if (!isValid(excerpt)) {
            return res.status(400).send({status: false, msg: "Enter User Excerpts !" })
        }
        if (!isValidName(excerpt)) {
            return res.status(400).send({status: false, msg: "excerpt only take alphabets !" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Enter Title Name for Book !" })
        }
        if (!isValidBookTitle(title)) {
            return res.status(400).send({ status: false, msg: "Enter a Valid title ! " })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Enter User-Id !" })
        }
        if (!isValidObjectIds(userId)) {
            return res.status(400).send({ status: false, msg: "enter a Valid User Id !" })
        }
        if (!ISBN){
            return res.status(400).send({ status: false, message: 'ISBN is Mandatory !' })
        } 
        if (!category){
            return res.status(400).send({ status: false, msg: "Enter The Category !" })
        } 
        if (!isValidBookTitle(category)){
            return res.status(400).send({ status: false, msg: "Please Enter valid Category !" })
        } 
        if (!subcategory){
            return res.status(400).send({ status: false, msg: "Enter The Sub-Category !" })
        } 
        if (!isValidBookTitle(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Sub-Category !" })
        }    
        if (!ISBN){
            return res.status(400).send({ status: false, msg: "Please Enter ISBN Number !" })
        } 
        if (!/^[0-9]{13}$/.test(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid ISBN Number !" })
        }
        if (!checkDate(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" })
        }
   next()
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// ******************************************** AuthentiCation ********************************?

const authentication = (req, res, next) => {
try {
    const token = req.headers['x-api-key']

    if(!token)  return res.status(400).send({ status: false, message: "Token is missing" })

    if (token) {
        jwt.verify(token, "book management", (error, decode) => {
            if (error) {
                if (error.message == 'jwt expired') {
                    return res.status(400).send({ status: false, message: 'Your Token has been expired login Again' })
                }else{
                    return res.status(401).send({ status: false, message: "Authenitication failed" })
                } 
            }
            req.body.decodedToken = decode  
            next()
        })  
    }   
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message }) 
    }
}

// *************************************************** Authorisation *************************

const autherisation = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Enter book Id" })
        }
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const book = await bookModel.findById(bookId)
        if (!book){
            return res.status(404).send({ status: false, message: "no book with this id !" })
        } 
        if (book.isDeleted == true){
            return res.status(400).send({ status: false, message: "Book Already Deleted !" })
        }
        if (book.userId.toString() !== req.body.decodedToken.userId) {
            return res.status(403).send({ status: false, message: "Not Authorized !" })
        }
    
    next()

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


// ********************************* Review Create ***************************************

const reviewCreateValidation = function(req , res , next ){
    try {
        const bookId = req.params.bookId
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        if(Object.keys(req.body).length==0){
            return res.status(400).send({ status: false, message: 'No Review Data Exist in Body' })
        }
        const {reviewedBy ,reviewedAt, rating , review } = req.body

        if(reviewedBy){
            if (!isValidName(reviewedBy) || !isValid(reviewedBy)) {
                return res.status(400).send({status: false, message: "ReviewedBy Name Should be alphabets !" })
            }
        }else{
            req.body.reviewedBy = 'Guest'
        }
        if(reviewedAt){
            if (!checkDate(releasedAt) || !isValid(reviewedAt)) {
                return res.status(400).send({ status: false, message: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" }) }
        }else{
            req.body.reviewedAt = moment().format('YYYY-MM-DD')
        }
        if(!rating || !isValid(rating)){
            return res.status(400).send({status: false, message: "Rating Mandatory or Not be 0 !" })
        }
        if(!/^[1-5]{1}$/.test(rating)){
            return res.status(400).send({status: false, message: "Rating Should be Valid btw { 1 to 5 } only -!" })
        }
        if(review){
            if(!isValid(review) || !isValidBookTitle(review)){
                return res.status(400).send({status: false, message: "inValid review !" })
            }
        }
    
    next()
    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}

const putDeeleteReview =  async (req,res ,next)=>{
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const bookData = await bookModel.findById(bookId).lean()
        if(!bookData){
            return res.status(404).send({ status: false , msg: 'Books not found !'})
        }
        if(bookData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: ' your Book is Deleted !'})
        }    
        const reviewId = req.params.reviewId;
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const reviewsData = await reviewModel.findById(reviewId).lean()
        if(!reviewsData){
            return res.status(404).send({ status: false , msg: 'no review found !'})
        }
        if(reviewsData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: 'review is Already Deleted !'})
        }
        
        req.body.bookData = bookData
        //console.log(bookData) , req.Body
        req.body.reviewsData = reviewsData

    next()

    } catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


module.exports = { authentication, userCreateValidation, bookCreateValidation,reviewCreateValidation, autherisation ,putDeeleteReview }