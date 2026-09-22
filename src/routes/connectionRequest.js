const express = require("express");
const connectionRequestRouter = express.Router();
const {auth} = require('../middlewares/auth');
const ConnectionRequest = require('../config/models/connectionRequest');
const User = require('../config/models/user');

connectionRequestRouter.post('/request/send/:status/:toUserId',auth,async(req,res) =>{
    const {status,toUserId} = req.params;
    const fromUserId = req.user.id;
    try{
        if(!['interested','ignore'].includes(status)){
            return res.status(400).json({message:'Invalid status. Must be either "interested" or "ignore".'});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:'User not found'});
        }

        const existingRequest = await ConnectionRequest.find({$or: [{fromUserId:toUserId, toUserId:fromUserId},{fromUserId:fromUserId, toUserId:toUserId}]});

        if(existingRequest.length > 0){
            return res.status(400).json({message:'Connection request already exists between these users'});
        }

        const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status});
        await connectionRequest.save();
        res.json({message:status === 'interested' ? 'Connection request sent successfully' : 'Connection request ignored',connectionRequest});
    }catch(err){
        res.status(500).send('Error creating connection request: ' + err.message);
    }
});

connectionRequestRouter.post('/request/review/:status/:requestId',auth, async(req,res) =>{
    const {status,requestId} = req.params;
    try{
        if(!['accepted','rejected'].includes(status)){
            return res.status(400).json({message:'Invalid status.'});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: req.user.id,
            status: 'interested'
        });

        if(!connectionRequest){
            return res.status(404).json({message:'Connection request not found'});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message: 'Connection request ' + status,data})
    }
    catch(err){
        res.status(400).send('ERROR: ' + err.message);
    }
})

module.exports = connectionRequestRouter;