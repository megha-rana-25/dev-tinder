const express = require('express');
const app = express();

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