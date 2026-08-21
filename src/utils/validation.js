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

module.exports = validateUser;