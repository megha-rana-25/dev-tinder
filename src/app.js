const express = require('express');
const app = express();
const {adminAuth,userAuth,auth} = require('./middlewares/auth');
const connectDB = require('./config/database');
const User = require('./config/models/user');
const validateUser = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

connectDB().then(()=>{
    console.log('Database connected');
    app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.log('Database connection failed',err);
});

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async (req,res) =>{
    try {
        // Validate the user
        validateUser(req.body);

        const {firstName,lastName,email,password,age,gender,about} = req.body;

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age,
        gender,
        about
    });
        await user.save();
        res.send('User created successfully');
        }
        catch(err){
        res.status(400).send('Error creating user: ' + err.message);
        };
});

app.post('/login',async (req,res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            throw new Error('Email and password are required');
        }

        const user = await User.findOne({email});
        if(!user){
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            throw new Error('Invalid credentials');
        }else{
            const token = await jwt.sign({id:user._id},'secretKey',{expiresIn:'0h'});
            res.cookie('token',token,{httpOnly:true});
            res.send('User logged in successfully');
        }

    }catch(err){
        res.status(400).send('Error logging in: ' + err.message);
    }
})

app.get('/profile',auth, async (req,res) =>{
    try{
    res.send(req.user);
}catch(err){
    res.status(400).send('Error fetching profile: ' + err.message);
}
})

app.get('/userByEmailId',async(req,res) =>{
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

app.get('/users',async(req,res) =>{
    try{
        const users = await User.find();
        res.send(users);
    }
    catch(err){
        res.status(500).send('Error fetching users',err.message);
    }
});

app.get('/user/:id',async(req,res) =>{
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



app.use('/test',(req,res) =>{
    res.send('Hello World');
});

app.use('/megha',(req,res) =>{
    res.send('Hello Megha');
});

app.use('/home',(req,res) =>{
    res.send('Hello Home');
});

app.get('/hello/:id', (req,res) =>{
    console.log(req.params,req.query);
    res.send({'name':'Megha','age':22});
});

app.post('/user',(req,res) =>{
    res.send("Sent successfully");
});


app.get('/person',(req,res) =>{
    res.send({'name':'Megha','age':22});
    res.send({'name':'Megha','age':23});
});

app.use('/admin',adminAuth);

app.get('/user',userAuth,(req,res) =>{
    res.send('User Data');
});

app.post('/user/login',(req,res) =>{
    res.send('User Created');
});

app.get('/admin/getAllData',(req,res) =>{
    
    try{
        throw new Error('Something went wrong');
    }       
    catch(err){
        res.status(500).send('Contact the helpline number');
    }
    res.send('All Data');
});


app.use('/',(err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});


app.delete('/admin/deleteData',(req,res) =>{
    res.send('Data Deleted');
});

app.delete('/user',async(req,res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    }catch(err){
        res.status(500).send('Error deleting user',err.message);
    }
})

app.patch('/user',async(req,res) =>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndUpdate(userId,req.body,{runValidators:true});
        res.send('User updated successfully');
    }catch(err){
        res.status(500).send('Error updating user' 
            + err.message);
    }
});

// app.patch('/user',async(req,res) =>{
//     console.log("2");
//     const emailId = req.body.email;
//     try{
//         await User.findOneAndUpdate({email: emailId}, req.body);
//         res.send('User updated successfully');
//     }catch(err){
//         res.status(500).send('Error updating user',err.message);
//     }
// });
