const bookModel = require("../models/bookModel")
const reviewModel = require('../models/reviewModel')
const {isValid , isValidObjectIds ,checkDate , isValidBookTitle } = require("../validation/validation")
const moment = require('moment')
const aws = require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

const createBook = async (req, res) => {
    try {
        let files= req.files
        console.log(files)
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            //res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
            req.body.cover = uploadedFileURL
        }
        //console.log(req.files)
        // else{
        //     res.status(400).send({ msg: "No file found" })
        // }
        const {title , ISBN , userId , decodedToken , cover} = req.body
        if(userId !== decodedToken.userId) {
            return res.status(401).send({ status: false, message: "Not Authorized to Create Book!" })  
        }
        const checkTitle =await bookModel.findOne({title:title})

        if(checkTitle){
            return res.status(400).send({status: false, message :"Title Already Exist !"})
        } 
        const isbn=await bookModel.findOne({ISBN:ISBN})
        if(isbn){
            return res.status(400).send({status: false, message :"ISBN Should be Unique !"})
        } 
        const result = await bookModel.create(req.body)
        return res.status(201).send({ status: true, message: 'Success', data: result })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// ************************************  Get Book ***********************************************

const getBook = async (req, res) => {
    try {
        const { category, subcategory, userId } = req.query
        req.query.isDeleted = false 

        if(subcategory){
            if (!isValid(subcategory)) {
                return res.status(400).send({status :false , msg: "Enter A Valid Sub-Category !" })
             }}        
        if(category){
            if (!isValid(category)) {
                return res.status(400).send({status :false , msg: "Enter A Valid Category ! " }) 
            }}                  
        if(userId){
             if (!isValidObjectIds(userId)) {
                return res.status(400).send({status :false , msg: "Enter Valid User-Id !" }) 
            }}        
    const getAllBooks = await bookModel.find(req.query).select(
        { ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 }).sort({title:1})                          
        
        if (getAllBooks.length == 0) {
            return res.status(404).send({ status: false , msg: 'Books not found !'})
        }
        res.status(200).send({ status: true, message: 'Success', data: getAllBooks })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// **************************************************** get book by bookid ***********************************

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Enter book Id" })
        }
        if (!isValidObjectIds(bookId)) {
            return res.status(400).send({ status: false, message: "Enter Valid book Id" })
        }
        const bookData = await bookModel.findOne({_id : bookId ,isDeleted: false  }).lean().select(
            { ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 }).sort({title:1}) 
        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select(
            { isDeleted: 0, createdAt: 0, updatedAt: 0, __v:0 }).sort({ratting:1}) 
        bookData.reviewsData = reviewsData

        if(bookData) {
           return res.status(200).send({ status: true, message: 'Success', data: bookData })
        }
        res.status(404).send({status :false , message: "Book Not found 1" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// **************************************************** Update book by bookid ***********************************

const updateBook = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0){
            return res.status(400).send({ status: false, message: "No data given for updation" })
        } 
        const bookId = req.params.bookId;
        const {title , excerpt ,ISBN , releasedAt } = req.body;
        const updateObj = {}
        
        if(excerpt){
            if (!isValidName(excerpt)) {
                return res.status(400).send({status : false , message: "Enter a Valid excerpt !" })   } 
        updateObj.excerpt = excerpt
        }
        if(title){
            if(!isValid(title)){
                return res.status(400).send({ status : false , message: "Enter A title ! " }) 
            }   
            if (!isValidBookTitle(title)) {            
                return res.status(400).send({ status : false , message: "Enter A Valid title ! " }) 
            }
            const checkTitle =await bookModel.findOne({title:title}) 
            if(checkTitle){
                return res.status(400).send({status: false, message :"Title Already Exist !"}) 
            }
            updateObj.title = title
        }
        if(ISBN) {
            if(!/^[0-9]{8,15}$/.test(ISBN)){
                return res.status(400).send({ status : false , message: "Please Enter valid ISBN Number !" })
            } 
            const isbn=await bookModel.findOne({ISBN:ISBN})
            if(isbn){
                return res.status(400).send({status: false, message :"ISBN Should be Unique !"})  } 
        updateObj.ISBN = ISBN
        }
        if(releasedAt){
            if(!checkDate(releasedAt)) {
                return res.status(400).send({ status : false , message: "Please Enter valid Release-Date Format- /YYYY/MM/DD !" }) }
            updateObj.releasedAt = releasedAt
            }

        const result = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateObj }, { new: true })
        res.status(200).send({ status: true, message: 'Success', data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message }) 
    }
}


// **************************************************** Delete book by bookid ***********************************

const deleteBook = async (req, res) => {
    try {
    const bookId = req.params.bookId;
    const result = await bookModel.findByIdAndUpdate(bookId, { $set: { isDeleted: true, deletedAt: moment().format('YYYY-MM-DD') } })
      return  res.status(200).send({ status: true, message: "Deleted Successfully" })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook , getBook , getBookById , deleteBook ,updateBook  } 