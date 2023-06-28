const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    confirmPassword: {type: String, required: true},
    address: {type: String, required: true},
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
    }
    next();
})

// generating user authentication token

userSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id:this._id}, process.env.SECRETKEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch (error) {
        console.log(`Authentication error: ${error}`);
    }
}


const User = mongoose.model('USER', userSchema);
console.log('userSchema is loaded!');
module.exports = User;