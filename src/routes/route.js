const express = require('express')
const router = express.Router()
const authorController = require("../controllers/authorController")
const mailValidation = require("../middleware/mailValidation")
const blogController = require('../controllers/blogController')

//creating Author
router.post("/authors", mailValidation.validateEmail, authorController.createAuthor)

//creating blogs
router.post('/blogs', blogController.createBlog)

//getting blogdata
router.get('/blogs', blogController.getBlogs)


module.exports = router


