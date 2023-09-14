//load .env file in non-production envi
if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const req = require("express/lib/request")
const res = require("express/lib/response")
const app = express()
const bcrypt = require("bcrypt") // BCRYPT PACKAGE
const passport = require("passport")
const initializePassport = require("./passport")
const flash = require("express-flash")
const session = require("express-session")


initializePassport(passport, 
    email => users.find(user => user.email === email), //auth
    id => users.find(user => user.id === id)           //user ser and deser
    )


var users = [] 

//middlewares
app.use(express.urlencoded({extended: false})) // parsed data is in form of nested objects
app.use(flash()) //flash messages
app.use(session({ //session config
    secret: process.env.SECRET_KEY, //ID
    resave: false, //not resave session variable if not changed
    saveUninitialized: false //wont be saved for req
}))
app.use(passport.initialize())
app.use(passport.session())

//Login POST METHOD
app.post("/login", passport.authenticate("local", {
    successRedirect: "/mfa", 
    failureRedirect: "/login", 
    failureFlash: true
}))
 

//Register POST METHOD
app.post("/register", async(req, res) => {
    const email_Value = req.body.email;
    const fullName_Value = req.body.fullName;
    const existingUser = users.find(user => user.email === email_Value)
    try {
        if(existingUser) {
            req.flash('error', 'Email already exists.')
            res.redirect("/register")
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                fullName: fullName_Value,
                email: email_Value,
                password: hashedPassword
            })
            console.log(users)
            res.redirect("/login")
        } 
    }
    catch (error) {
        console.log(error);
        res.redirect("/register")
    }
})

//ROUTE FOR LOCALHOST:3000

app.get('/', (req, res) => {
    res.render("index.ejs", { fullNameVal: req.user?.fullName });
});

app.get('/login', (req, res) => {
    res.render("login.ejs")
})

app.get('/register', (req, res) => {
    res.render("register.ejs")
}) 

app.get('/mfa', (req, res) => {
    res.render("mfa.ejs")
})

//END ROUTE

  
app.listen(3000)