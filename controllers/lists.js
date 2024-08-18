const express = require("express");
const router = express.Router();
const Trip = require('../models/trip.js'); 
const List = require("../models/list.js");

//create a new list for a specific trip
router.post('/:tripId/lists', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId); 
    if (!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const newList = await List.create(req.body);
    trip.lists.push(newList._id);
    await trip.save();
    res.redirect(`trips/${trip._id}`);

  } catch (error) { 
    console.error(error);
    res.status(500).send('An error occured while creating the list'); 

  }
}); 


//index(show all lists)
router.get('/', async (req, res) => {
  try {
    const lists = await List.find({}); 
    res.render('lists/index.ejs', {
      lists: lists, 
    }); 
  } catch (error) { 
    res.send(error); 
  }
}); 




module.exports = router;
