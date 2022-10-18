const { model, Schema } = require('mongoose');

//TODO
const userSchema = new Schema({
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[a-zA-Z0-9]+$/i, 'Username may contain only english letters and numbers'] 
    },
    hashedPassword: { 
        type: String, 
        required: true 
    }
});

userSchema.index({ username: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('user', userSchema);

module.exports = User;