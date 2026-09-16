const express = require('express');
const userRouter = express.Router();
const User = require('../config/models/user');

userRouter.get('/userByEmailId',async(req,res) =>{
    const userEmail = req.body.email;
    try{
        const user = await User.find({email:userEmail});
        if(!user.length){
            res.status(404).send('User not found');
        }else{
            res.send(user);
        }
        
    }
    catch(err){
        res.status(500).send('Error fetching user',err.message);
    }
});

userRouter.get('/users',async(req,res) =>{
    try{
        const users = await User.find();
        res.send(users);
    }
    catch(err){
        res.status(500).send('Error fetching users',err.message);
    }
});

userRouter.get('/user/:id',async(req,res) =>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            res.status(404).send('User not found');
        }else{
            res.send(user);
        }
    }
    catch(err){
        res.status(500).send('Error fetching user',err.message);
    }
});

userRouter.patch('/user',async(req,res) =>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndUpdate(userId,req.body,{runValidators:true});
        res.send('User updated successfully');
    }catch(err){
        res.status(500).send('Error updating user' 
            + err.message);
    }
});

userRouter.delete('/user',async(req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    }catch(err){
        res.status(500).send('Error deleting user',err.message);
    }
});

module.exports = userRouter;