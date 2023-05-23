const express = require("express");
const passport = require("passport");
const path = require('path')
const Strategy = require("passport-google-oauth2").Strategy
const app = express();
    const session = require("express-session");
let pro;
const mysql = require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    user:"root",
    database:"passport_account"
})



db.connect((err) => {
    if(err) throw new Error(err);
    console.log('done connect to database')
});








app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('login')
})


passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null,user)
})

passport.use(new Strategy({
    clientID:"230820724159-blqip733tr4q1r637u3538jrmaavn4vo.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3400/callback",
    passReqToCallback:true,
    scope: ['profile', 'email']
},
( request, accessToken, refreshToken, profile, done ) => {


db.query(`SELECT * FROM accounts WHERE email = '${profile.email}'`, (err, res) => {
    console.log(String(res).length)

if(err) return console.log(err);
if(String(res).length === 0) {
    db.query(`INSERT INTO accounts (email, name, pic) VALUES ('${profile.email}','${profile.displayName}','${profile.picture}')`)
    return done(null, profile)
} else {
    return done(null, profile)
}
})




    
//
pro = profile;
//console.log(pro)

}))
    app.use(new session({
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))

app.get('/callback', passport.authenticate('google', { failureRedirect:"/" }), (req, res) =>[
    res.redirect('/info')
])

app.get('/info', (req, res) => {


 res.render('info', {
db:db,
user:pro,
img:pro.picture
    })
})
app.listen(3400, () => {
    console.log('done !')
})