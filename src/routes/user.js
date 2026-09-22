const express = require('express');
const userRouter = express.Router();
const User = require('../config/models/user');
const ConnectionRequest = require('../config/models/connectionRequest');
const {auth} = require('../middlewares/auth');

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

userRouter.get('/user/connections',auth,async(req,res) =>{
    try{
        const loggedInUser = req.user;
        
        const connections = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser.id, status:'accepted'},{toUserId:loggedInUser.id,status:'accepted'}]
        }).populate('fromUserId toUserId','firstName lastName');

        const connectedUsers = connections.map(connection =>{
            if(connection.fromUserId.id.toString() === loggedInUser.id.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
        });
        res.json({message: 'Data fetched successfully', data: connectedUsers});
    }catch(err){
        res.status(400).send('Error fetching connections',err.message);
    }
});

userRouter.get('/user/feed',auth,async(req,res) =>{
    try{
        const connections = await ConnectionRequest.find({
            $or:[{fromUserId:req.user.id},{toUserId: req.user.id}]
        }).select('fromUserId toUserId');


        const connectedUserIds = new Set();
        connections.forEach(connection =>{
            connectedUserIds.add(connection.fromUserId.toString());
            connectedUserIds.add(connection.toUserId.toString());
        })
        
        const users = await User.find({
            $and: [
                {_id: {$nin: [...connectedUserIds]}},
                {_id: {$ne: req.user.id}}
            ]
        }).select('firstName lastName');
        
        res.json({message: 'Data fetched successfully', data: users});
    }
    catch(err){
        res.status(400).send('Error fetching feed',err.message);
    }
})

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

userRouter.get('/user/requests/received',auth,async(req,res)=>{
    try{
        const connectionRequests = await ConnectionRequest.find({
        toUserId: req.user.id,
        status: 'interested'
    }).populate('fromUserId','firstName lastName');

    res.json({message: 'Data fetched successfully', data: connectionRequests});
    }
    catch(err){
        res.status(400).send('Error fetching connection requests',err.message);
    }
});

module.exports = userRouter;