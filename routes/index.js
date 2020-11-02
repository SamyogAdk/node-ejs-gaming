const express = require('express');

const router = express.Router();

const {ensureAuthenticated} = require('../config/auth')

router.get('/',(req,res)=>{
    res.render('home');
})
router.get('/dashboard',ensureAuthenticated, (req,res)=>{
    res.render('dashboard',{
        name: req.user.name 
    });
})
router.get('/event_form', ensureAuthenticated, (req,res)=>{
    res.render('event_form',{
        name: req.user.name,
        email: req.user.email
    })
})
module.exports = router;