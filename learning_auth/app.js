const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const Bcrypt = require('bcrypt');
const session = require('express-session');

// connecting to mongoose 
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/authDemo');
    console.log('mongoose connected!!');
}

// middlewares 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// session key 
app.use(session({ secret: 'secretKey' }));

// home route 
app.get('/home', (req, res) => {
    res.render('home');
})

// register routes
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await Bcrypt.hash(password, 12)
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/home');

});

// login routes
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validUser = await Bcrypt.compare(password, user.password);
    if (validUser) {
        req.session.user_id = user._id;
        res.render('home');
    }
    else {
        res.send('Either username or password is incorrect!, try again');
    }
});
// hidden route 
app.get('/hidden', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.render('hidden');
})
// logout route 
app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.render('login');
})

// connecting to server
app.listen(3000, () => {
    console.log('App connected!!');
})