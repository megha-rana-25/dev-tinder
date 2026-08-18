const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        lowercase:true,
        minlength:3,
    },
    lastName:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate:{
            validator:function(value){
                return ['male','female','other'].includes(value);
            }
        }
    },
    about:{
        type:String,
        default:'Hey there! I am using DevTinder',
    }
});

module.exports = mongoose.model('User',userSchema);