const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require("./models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require('connect-flash');
const expressSession = require("express-session");


const app = express();

require('./config/db.config')
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended : true}))//to parse the body of the request
app.use(cookieParser());

app.use(expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
}))

app.use(flash());




app.get('/', (req, res) => {
  res.render('welcome');
});


app.get('/profile',isLoggedIn,async (req, res) => {
    let user = await userModel.findOne({username: req.user.username})//finding the user in the database
    res.render('profile',{user});
  });


app.get("/register", (req, res) => {
    res.render('register',{error: req.flash("error")[0]});///sending the error to the register page and
                                                            /// [0] is used to get the first error
})


app.post("/register", async (req, res) => { 
    let { username, password } = req.body;

    ///checking if the username is already taken
    let user = await userModel.findOne({ username });
    if(user){
        req.flash("error", "username already exists")
        return res.redirect("/register")
    }
    // Hashing the password using bcrypt
     bcrypt.genSalt(10, function (err, salt) {
        // Generate a salt (random string) to add security to the password
        bcrypt.hash(password, salt, async function (err, hash) {
            // Hash the password with the generated salt
            // Save the user data (username, hashed password) in the database
            await userModel.create({
                username,
                password: hash // Store the hashed password instead of the plain password
            });

            // Create a JWT token using the email as the payload
            // "secret" is the signing key, replace it with a secure key in production
            let token = jwt.sign({ username }, "secret");

            // Store the token in the user's browser as a cookie named "token"
            res.cookie("token", token);

            // Redirect the user to the "created" page (confirming account creation)
            res.redirect("/profile");
        });
    });
});


app.get("/login", (req, res) => {
    res.render("login",{error: req.flash("error")[0]});
})

app.post("/login",async (req, res) => {
    ///hashing the password
    let { username, password } = req.body;
    let user = await userModel.findOne({ username });///finding the user in the database
    if(!user) {
        req.flash("error", "incorrect username or password")
        return res.redirect("/login")
    }
    ///comparing the password
    bcrypt.compare(password, user.password, function(err,result){
        if(result){
            let token = jwt.sign({username}, "secret"); ///signing the token with the email
            res.cookie("token", token)
            res.redirect("/profile");
        }
        else{
            req.flash("error", "incorrect username or password")
            return res.redirect("/login")
        }
    })
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");///deleting the token
    res.redirect("/login");
})

function isLoggedIn(req, res, next) {
    // Check if the user is logged in by verifying token in cookies
    if(!req.cookies.token) {
        req.flash("error", "you must be logged in")
        return res.redirect("login");
    }  

    jwt.verify(req.cookies.token, "secret", function(err, decoded) {
        if(err) {
            res.cookie("token", "") // Clear invalid token
            return res.redirect("/login")
        } else {
            req.user = decoded; // Store decoded user info in request
            next();
        }      
    });
}


const PORT = process.env.PORT || 3000;///process.env.PORT is used to get the port from the environment variable
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});