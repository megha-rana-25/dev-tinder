const mongoose = require('mongoose');

const connectDB = async () => {
        await mongoose.connect('mongodb+srv://19compmegharana_db_user:VgGzrFnTgZC2hXCB@cluster0.u9hzady.mongodb.net/devTinder');
};

module.exports = connectDB;