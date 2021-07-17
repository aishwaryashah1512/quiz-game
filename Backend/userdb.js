const express = require('express')
const router = express.Router()
const UserDetails=require('./userDetails')

router.post('/signup',(req,res)=>{
    const {username,password}=req.body
    const newuser = new UserDetails({username,password });
     newuser.save((err)=>{
         if(err){
             res.status(404).send({err})
         }
         else{
             res.status(200).send(newuser)
         }
     })
})

router.post('/signin',async(req,res)=>{
    const {username,password}=req.body 
    try{
        const olduser=await UserDetails.findOne({username,password});
        if(olduser){
        res.status(200).send(olduser)
        }
        else{
            res.send('No data found')
        }
    }
    catch(error){
        res.status(404).send(error)
    }

})
router.post('/userLevel',async(req,res)=>{
    const {level,username,password}=req.body
    try{
        const user=await UserDetails.findOneAndUpdate({username,password},{level},{new:true,useFindAndModify:false});
        res.status(200).send(user)
    }
    catch(error){
        res.send(error).status(404)
    }
})
router.post('/userScore',async(req,res)=>{
    const {score,username,password,ques}=req.body
    try{
        const user=await UserDetails.findOneAndUpdate({username,password},{score,ques},{new:true,useFindAndModify:false});
        res.status(200).send(user)
    }
    catch(error){
        res.send(error).status(404)
    }
})


module.exports = router