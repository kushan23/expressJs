const { Router } = require('express')
const { userMiddleware } = require("../middleware/user");
const { courseModel,purchaseModel } = require("../db");
const courseRouter = Router();


courseRouter.post("/purchase", userMiddleware,async function(req,res){
    const userId = req.userId
    const courseId = req.body.courseId
    try{
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "Course bought successfullly"
    })} catch(error){
        console.log(error);
    }
    
})
courseRouter.get("/preview", async function(req,res){
    const courses = await courseModel.find({})
    console.log(courses)
    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}