const express = require('express');
const router = express.Router();
require('../db/conn');
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    res.send('Hello world... Router file is suspending the data!');
});

router.post('/register', async function(req, res) {

    const {name, username, email, phone, password, confirmPassword, address} = req.body;
    if(!name || !username || !email || !phone || !password || !confirmPassword || !address) {
        return res.status(422).json({error: "One or more fields are empty!"});
    }

    try {
        const foundEmail = await User.findOne({email: email});
        if(foundEmail) {
            return res.status(422).json({error: "This email was used to create another account!"});
        }
        const foundUserName = await User.findOne({username: username});
        if(foundUserName) {
            return res.status(422).json({error: "This username is already taken!"});
        }
        const foundPhone = await User.findOne({phone: phone});
        if(foundPhone) {
            return res.status(422).json({error: "This phone number is already registered!"});
        }


        // create user
        const user = new User({name, username, email, phone, password, confirmPassword, address});
        await user.save();

        return res.status(200).json({message: "User registered successfully!"});
    } catch (error) {
        console.log("cannot create user!");
    }
    
});






module.exports = router;