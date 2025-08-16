const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty!!']
    },
    password: {
        type: String,
        required: [true, 'password cannot be empty!!']
    }
});

module.exports=mongoose.model('User', userSchema);