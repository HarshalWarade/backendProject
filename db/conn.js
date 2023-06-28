const mongoose = require('mongoose');
const db = process.env.DATABASE;
mongoose.connect(db).then(function() {
    console.log('Connection successful');
}).catch(function(error) {
    console.log("Connection error to the database!");
})