const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");

router.get('/signup', (req, res)=> {
    res.render('users/signup.ejs');
})

router.post('/signup',wrapAsync(async (req, res)=> {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    await User.register(newUser, password);
    req.flash('success','Welcome to Wanderlust!');
    res.redirect('/listings');
    }catch(error){
        req.flash('error',error.message);
        res.redirect('/signup');
    }
}))

module.exports = router;