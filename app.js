const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
dotenv.config({path: 'config.env'});

const app = express();
const port = process.env.PORT;

require('./db/conn');
const User = require('./model/userSchema');


app.use(express.json());

app.use(require('./router/auth'));



app.listen(port, function(err) {
    if(err) {console.log(err)} else {
        console.log(`Server created on: http://localhost:${port}`);
    };
});