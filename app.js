const express = require('express');
const controllers = require('./controllers/home');
//const { join } = require('path');

//declaring express
const app = express();

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json()); // Parses JSON data

//connects to index.ejs etc; EJS for rendering HTML templates
app.set('view engine','ejs');
//connects to static part-such as css through the midlle ware
app.use(express.static('public'));

controllers(app);

//listening to port
app.listen(3000,()=>{console.log("Listening to port 3000")});



