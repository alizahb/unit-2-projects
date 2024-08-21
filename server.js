const dotenv = require('dotenv');
dotenv.config();

const morgan = require('morgan');
const express = require('express');
const methodOverride = require('method-override');
const session=require('express-session'); 

const app = express();
const mongoose = require('mongoose');


app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`); 
  console.log('Middleware executed:', req.method, req.url); 
  next(); 
}); 

app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);




const authController= require('./controllers/auth.js');
app.use('/auth', authController); 
const tripsController = require("./controllers/trips.js");
const usersController = require('./controllers/users.js');


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});




app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
app.use(isSignedIn);
app.use(passUserToView);

//app.use('/items', itemsController);
app.use('/auth', authController);
app.use('/users', usersController);
app.use("/trips", tripsController);
//app.use('/trips/:tripId/packingList', listsController);


app.use((req, res) => {
  res.status(404).send('Not Found'); 
});



const port = process.env.PORT ? process.env.PORT : '3000';

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});