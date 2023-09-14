const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt") // BCRYPT PACKAGE
var store = require('store')
const localStorage = require("localStorage")

//authentication of users
function initialize(passport, getUserByEmail, getUserById) {
    const userAuthenticate = async (email, password, done) => {
        const user = getUserByEmail(email)
        
        if(user == null) {
            return done(null, false, {message: "User is not recognized."})
        }
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } 
            else {
                return done(null, false, {message: "Incorrect password."})
            }
        } 
        catch (error) {
            console.log(error);
            return done(error)
        }
    }
    passport.use(new localStrategy({usernameField: 'email'}, userAuthenticate)) //used for verifying callback done()
    passport.serializeUser((user, done) => done(null, user.id)) //data to be stored in session
    passport.deserializeUser((id, done) => { //retrieve the user object from the session
        return done(null, getUserById(id))
    }) 
}

module.exports = initialize