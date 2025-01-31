const { Router } = require('express')
const adminRouter = Router();
const { adminModel } = require("../db")
const { courseModel } = require("../db")
const jwt = require('jsonwebtoken')
const { JWT_ADMIN_PASSWORD } = require("../config")
const { adminMiddleware } = require("../middleware/admin")


adminRouter.post("/signup", async function(req,res){
    const { email,password,firstName,lastName } = req.body;
    try{
        await adminModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    } catch(error){
        res.json({
            message: error
        })
    }
    
    res.json({
        message: "admin user added"
    })
})
adminRouter.post("/signin", async function(req,res){
    const { email,password } = req.body

    const user = await adminModel.findOne({
        email: email,
        password: password
    });
   if(user){
       const token =  jwt.sign({
            id: user._id
        }, JWT_ADMIN_PASSWORD)
        res.json({
            token: token
        })
   }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
   }
    
})


adminRouter.post("/course",adminMiddleware,async function(req,res){
    const { title,description,price,imageUrl } = req.body;
    console.log(req.body)
    const adminId = req.userId
    try{
       const course =  await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorId: adminId
    })
    console.log(course)
    res.json({
        message: "course created",
        courseId: course._id
    })
}catch(error){
    console.log(error)
    res.json({
        message: error
    })
}
})
adminRouter.put("/course",adminMiddleware, async function(req,res){
    const adminId = req.userId
    const { title,description,price,imageUrl,courseId } = req.body;
    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
    })
    
    console.log(course)
    res.json({
        message: "course updated succesfully"
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req,res){
    const adminIn = req.userId
    const courses = await courseModel.find({
        creatorId: adminIn
    })
    res.json({
        courses
    })
})



module.exports = {
    adminRouter: adminRouter
}