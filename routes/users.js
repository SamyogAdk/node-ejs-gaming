const express = require('express');

const router = express.Router();

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const passport = require('passport');

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',(req,res)=>{
   const { name, email, password, password2 } = req.body;
   let errors = [];

   if(!name || !email || !password || !password2){
       errors.push({msg: "Please fill in all the fields"});
   }
   if(password !== password2){
       errors.push({msg: "Password don't match"});
   }
   if(password.length < 6){
       errors.push({msg: "Password should atlest be 6 characters"})
   }

   if(errors.length > 0){
       res.render('register',{
           errors,
           name,
           email,
           password,
           password2
       })
   }
   else{
       //After validation
       User.findOne({email: email})
       .then(
           user=>{
               if(user){
                   errors.push({msg: "User already exists!"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
               }
               else{
                   const newUser = new User({
                       name,
                       email,
                       password
                   });
                   bcrypt.genSalt(10, (err, salt) => 
                   bcrypt.hash(newUser.password, salt, (err, hash)=>{
                       if(err) throw err;

                       newUser.password = hash;

                       newUser.save()
                       .then(
                           user =>{
                            res.redirect('/users/login');
                           }
                       )
                       .catch(err => console.log(err))
                   }))
               }
           }
       );

   }
})

//Login

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login'
    })(req,res,next);
})

//Logout

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('users/login')
})
module.exports = router;