const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../config/models/user');
const jwt = require('jsonwebtoken');
const {validateUser} = require('../utils/validation');

authRouter.post('/signup',async (req,res) =>{
    try {
        // Validate the user
        validateUser(req.body);

        const {firstName,lastName,email,password,age,gender,about} = req.body;

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
        gender,
        about
    });
        await user.save();
        res.send('User created successfully');
        }
        catch(err){
        res.status(400).send('Error creating user: ' + err.message);
        };
});

authRouter.post('/login',async (req,res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            throw new Error('Email and password are required');
        }

        const user = await User.findOne({email});
        if(!user){
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new Error('Invalid credentials');
        }else{
            const token = await jwt.sign({id:user._id},'secretKey',{expiresIn:'1h'});
            res.cookie('token',token,{httpOnly:true});
            res.send('User logged in successfully');
        }

    }catch(err){
        res.status(400).send('Error logging in: ' + err.message);
    }
});

module.exports = authRouter;