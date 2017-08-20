var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require( "./models/user");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/authenticate");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I am the best" ,
    resave: false ,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES
app.get("/home", function(req, res){
    res.render("home.ejs");
})
app.get("/secret", isLoggedIn , function(req, res){
    res.render("secret.ejs")
})
app.get("/about", function(req, res){
    res.render("about.ejs");
})
//Auth ROutes
app.get("/register", function(req, res){
    res.render("register.ejs");
})
//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.passowrd
    User.register(new User({ username: req.body.username}),req.body.password, function(err, user){
        if(err){
            console.log(err);
        return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
    
})

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login.ejs");
})
//login post route
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
})
//lougout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
})
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
       return next();
    }
res.render("login.ejs");
}
app.listen(3000, function(err){
    if(!err)
console.log("server");
})
