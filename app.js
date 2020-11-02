const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const uri = process.env.ATLAS_URI;
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log('Connected to DB successfully!');
})
.catch(err=>{
    console.log(err);
})

//Body-parser
app.use(express.urlencoded({extended: false}));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  



//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server started at port ${PORT}`);
})

//app.use(express.json());

/*app.get('/',(req,res)=>{
    res.send('Home page');
})
app.get('/api/employees',(req,res)=>{
    res.send(employees);
})
app.get('/api/employees/:id',(req,res)=>{
    const emp = employees.find(em => em.id === parseInt(req.params.id))
    if(!emp) res.status(404).send("Employee Not Found")
    res.send(emp);
})

app.post('/api/employees',(req,res)=>{
    const employee = {
        id: employees.length + 1,
        name:req.body.name,
        post:req.body.post
    }
    employees.push(employee);
    res.send(employees);    
})*/



