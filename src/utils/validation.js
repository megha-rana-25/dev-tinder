const validator = require('validator');

const validateUser = (body) =>{
    if(!body.firstName || !body.lastName){
        throw new Error('Name is not valid');
    }else if(!validator.isEmail(body.email)){
        throw new Error('Email is not valid');
    }else if(!validator.isStrongPassword(body.password)){
        throw new Error('Password is not strong');
    }
}

const validateProfileUpdateData = (body) =>{
    allowedFields = ["firstName", "lastName","email","age","about","gender"];
    return Object.keys(body).every(key =>
    allowedFields.includes(key)
    );
}

module.exports = {
    validateUser,
    validateProfileUpdateData
};