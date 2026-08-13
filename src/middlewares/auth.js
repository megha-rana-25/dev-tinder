const adminAuth = (req,res,next)=>{
    const token = 'xyz';
    if(token === 'xyz'){
        next();
    }else{
        res.status(401).send('Unauthorized');
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
    userAuth
};