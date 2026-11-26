const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    },
});

module.exports = mongoose.model('User', userSchema);