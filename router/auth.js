const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

        if(password != confirmPassword) {
            return res.status(422).json({error: "Password and ConfirmPassword, are not matching!"});
        }

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
        // hashing here

        await user.save();

        return res.status(200).json({message: "User registered successfully!"});
    } catch (error) {
        console.log("cannot create user!");
    }
    
});


router.post('/signIn', async function(req, res) {
    try {
        let token;
        const {username, password} = req.body;
        if(!username || !password) {
            return res.status(422).json({error: "Please fill the fields!"});
        }
        const userDetailsUsername = await User.findOne({username: username});
        
        if(userDetailsUsername) {
            const isMatched = await bcrypt.compare(password, userDetailsUsername.password);
            token = await userDetailsUsername.generateAuthToken();
            console.log(token);

            res.cookie("theCookie", token, {
                // 5 days expiry
                expires: new Date(Date.now() + 432000000),
                httpOnly: true
            });

            if(!isMatched) {
                return res.status(400).json({error: "Wrong credentials!"});
            } else {
                return res.status(200).json({message: "Successful Login!"});
            }
        } else {
            return res.status(400).json({error: "Wrong credentials!"});
        }



    } catch (error) {
        console.log(`SignIn error: ${error}`);
    }
})



module.exports = router;