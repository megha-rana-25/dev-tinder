const express = require('express');
const app = express();
const {adminAuth,userAuth} = require('./middlewares/auth');

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
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
    res.send('All Data');
});

app.delete('/admin/deleteData',(req,res) =>{
    res.send('Data Deleted');
});