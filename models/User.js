const mongoose = require('mongoose');
const md5 = require('md5');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors') 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address'],
        required: 'Please supply an email address!'
    },
    name: {
        type: String,
        required: 'Please supply a name!',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        }
    ]
})

userSchema.virtual('gravatar').get(function() {
    return `http://gravatar.com/avatar`;
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
