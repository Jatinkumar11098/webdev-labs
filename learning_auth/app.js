const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const Bcrypt = require('bcrypt');
const session = require('express-session');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/authDemo');
    console.log('Connected!!');
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'secretKey' }));

app.get('/home', (req, res) => {
    res.render('home');
})
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

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validUser = await Bcrypt.compare(password, user.password);
    if (validUser) {
        req.session.user_id = user._id;
        res.send('Welcome to the site!!');
    }
    else {
        res.send('Either username or password is incorrect!, try again');
    }
});

app.get('/hidden', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.send('I am only visible to authenticate users!!');
})

app.listen(3000, () => {
    console.log('App connected!!');
})