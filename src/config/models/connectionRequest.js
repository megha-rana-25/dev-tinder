const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    status:{
        type:String,
        required:true,
        enum:{values:['interested','ignore','rejected','accepted'],
            message:`{VALUE} is incorrect status type`,
        }
    }

},{timestamps:true});


connectionRequestSchema.pre('save',function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('Cannot send connection request to yourself');
    }
})

module.exports = mongoose.model('ConnectionRequest',connectionRequestSchema);