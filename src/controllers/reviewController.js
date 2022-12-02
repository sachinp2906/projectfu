const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const {isValidObjectId ,isValid , isValidName , isValidBookTitle , checkDate} = require('../validation/validation')
const moment = require('moment')

const createReview = async (req, res) => {
    try {       
        const bookId = req.params.bookId;
        req.body.bookId = bookId
        const bookData = await bookModel.findById(bookId).lean()
        if(!bookData){
            return res.status(404).send({ status: false , msg: 'Books not found !'})
        }
        if(bookData.isDeleted!==false){
            return res.status(404).send({ status: false , msg: 'Book Deleted  !'})
        }
               
        const countReviews = bookData.reviews + 1

        const updateBook = await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: countReviews } }, { new: true }).select({isDeleted:0, __v:0 , createdAt:0 ,updatedAt:0}).lean()
        
        const createReview =  await reviewModel.create(req.body)

        updateBook.reviewsData = createReview

        res.status(200).send({ status: true, message: 'Success', data: updateBook })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ******************************************************** Update Review 

const updateReview = async (req, res) => {

    try {
        const reviewId = req.params.reviewId;

        if(Object.keys(req.body).length==0){
            return res.status(400).send({ status: false, message: 'No Review Data Exist in Body for Update !' })
        }
        const  {reviewedBy ,reviewedAt, rating , review }  = req.body
        const data = {}

        if(reviewedBy){
            if (!isValidName(reviewedBy) || !isValid(reviewedBy)) {
                return res.status(400).send({status: false, message: "ReviewedBy Name Should be alphabets !" })
            }
        data.reviewedBy = reviewedBy
        }else{
            data.reviewedBy = 'Guest'
        }
        if(reviewedAt){
            if (!checkDate(releasedAt) || !isValid(reviewedAt)) {
                return res.status(400).send({ status: false, message: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" }) }
           data.reviewedAt = reviewedAt
        }else{
            data.reviewedAt = moment().format('YYYY-MM-DD')
        }
        if(rating){
            if(!rating || !isValid(rating)){
                return res.status(400).send({status: false, message: "Ratting Mandatory or Not be 0 -!" })
            }
            if(!/^[1-5]{1}$/.test(rating)){
               return res.status(400).send({status: false, message: "Ratting Should be Valid btw { 1 to 5 } only -!" })
            }
        data.rating = rating    
        }
        if(review){
            if(!isValid(review) || !isValidBookTitle(review)){
                return res.status(400).send({status: false, message: "inValid review !" })
            }
        data.review = review 
        }

      const updatedData = await reviewModel.findByIdAndUpdate(reviewId, { $set: data } , { new:true}).select({isDeleted:0, __v:0 , createdAt:0 ,updatedAt:0}).lean()

        res.status(200).send({ status: true, message: 'Success', data: updatedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }


}

// *************************************************************** DElete Review  *****************

const deleteReview = async (req, res) => {

    try {
        const bookId = req.params.bookId;
        const {bookData ,reviewsData} = req.body

        const reviewId = req.params.reviewId;

        const review = bookData.reviews-1

       const updateReviewData =  await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } })
       const updateReview = await bookModel.findByIdAndUpdate(bookId, {$set:{reviews:review}}, {new:true}).lean()

    res.status(200).send({ status: true, message: 'Success', data: 'Review Deleted Succesfully !' })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReview, updateReview, deleteReview }