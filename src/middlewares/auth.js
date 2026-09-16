const jwt = require("jsonwebtoken");
const  User = require('../config/models/user');

const adminAuth = (req,res,next)=>{
    const token = 'xyz';
    if(token === 'xyz'){
        next();
    }else{
        res.status(401).send('Unauthorized');
    }
}

const auth = async(req,res,next) =>{
    try{
        const {token }= req.cookies;
    if(!token){
        throw new Error('Unauthorized: No token provided');
    }
    console.log('Token:', token);
    const decoded = await jwt.verify(token,'secretKey');
    console.log('Decoded token:', decoded);
    const {id} = decoded;
    console.log('Decoded user ID:', id);
    const user = await User.findById(id).select('-password');
    if(!user){
        throw new Error('Unauthorized: User not found');
    }else{
        req.user = user;
        next();
    }
    }
    catch(err){
        res.status(401).send(err.message);
    }
}

const userAuth = (req,res,next)=>{
    const token = 'xyzdfd';
    if(token === 'xyz'){
        next();
    }else{
        res.status(401).send('Unauthorized User');
    }
}

module.exports = {
    adminAuth,
    userAuth,
    auth
};