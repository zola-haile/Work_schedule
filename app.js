const express = require('express');
const controllers = require('./controllers/router');
const session = require('express-session');
const bodyParser = require('body-parser');
//const { join } = require('path');

const path = require("path");

// Serve static files from /public


//declaring express
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // Parses JSON data

app.use(session({
    secret: 'supersecretkey', 
    resave: false,
    saveUninitialized: false
  }));


app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});
  

//connects to index.ejs etc; EJS for rendering HTML templates
app.set('view engine','ejs');
//connects to static part-such as css through the midlle ware
app.use(express.static('public'));

controllers(app);

//listening to port
app.listen(3000,()=>{console.log("Listening to port 3000")});



