const express = require('express');
const profileRouter = express.Router();
const {auth} = require('../middlewares/auth');
const {validateProfileUpdateData} = require('../utils/validation');
const User = require('../config/models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('validator');

profileRouter.get('/profile',auth, async (req,res) =>{
    try{
    res.send(req.user);
}catch(err){
    res.status(400).send('Error fetching profile: ' + err.message);
}
});

profileRouter.patch('/profile/edit',auth, async (req,res) =>{
    try{
        if(!validateProfileUpdateData(req.body)){
            throw new Error("Invalid data for profile update");
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body,{new:true,runValidators:true});
        res.json({message: 'Profile updated successfully', data: updatedUser});
    }
    catch(err){
        res.status(400).send('Error editing profile: ' + err.message);
    }
})

profileRouter.post('/profile/forgot-password', async (req,res) =>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
           return res.json({
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }
        const token = crypto.randomBytes(32).toString('hex');
        console.log('Generated reset token:', token);

        //hash the token and save it to the user document
        user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();
        res.json({
                message: "If an account exists with this email, a password reset link has been sent."
            }); 
    }
    catch(err){
        res.status(400).send('Error processing forgot password: ' + err.message);
    }
})

profileRouter.patch('/profile/password',async(req,res) =>{
    try{
        const {token,newPassword} = req.body;   
        hashToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log('Hashed reset token:', hashToken);
        const user = await User.findOne({
            resetPasswordToken: hashToken,
            resetPasswordExpires: {$gt: Date.now()}
        });
        if(!user){
            throw new Error('Invalid or expired reset token');
        }
        if(!validator.isStrongPassword(newPassword)){
                throw new Error('Password is not strong');
            }
        user.password = await bcrypt.hash(newPassword,10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({message: 'Password updated successfully'});
    }
    catch(err){
        res.status(400).send('Error updating password: ' + err.message);
    }
})

module.exports = profileRouter;