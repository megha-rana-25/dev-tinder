const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        validate:{
            validator:validator.isEmail,
        }
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator: validator.isStrongPassword,
    }
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
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
},{
    timestamps:true,
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.createJwtToken = async function(){
    const token = await jwt.sign({id: this._id},'secretKey',{expiresIn:'1h'});
    return token;
}

module.exports = mongoose.model('User',userSchema);