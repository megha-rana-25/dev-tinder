const express = require('express');
const app = express();
const {adminAuth,userAuth} = require('./middlewares/auth');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const profileRouter = require('./routes/profile');

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

app.use('/',authRouter);
app.use('/',userRouter);
app.use('/',profileRouter);

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
