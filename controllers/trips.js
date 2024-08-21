const express = require("express");
const router = express.Router();
//const mongoose = require('mongoose'); 
const Trip = require("../models/trip.js");
//const User = require("../models/user.js");
//const Item = require('../models/item.js'); 
//const List = require("../models/list.js");
//const User = require("../models/user.js"); 

//ADD A list to trip
router.post('/:tripId/add-list', async (req, res) => {
  console.log('list Data:', req.body);
  console.log('Trip Id:', req.params.tripId)
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const newList= {
      name: req.body.listName,
      items: req.body.items, 
    }; 

   trip.lists.push(newList);
    await trip.save();
    res.redirect(`/trips/${trip._id}`);
  }catch(error) {
    console.error(error);
    res.send('Error adding list to trip'); 
  }

  });  




//INDEX- Show all trips of user 
router.get('/', async (req, res) => {
  try {
    const userTrips = await Trip.find({ owner: req.session.user._id });
    res.render('trips/index.ejs', {trips: userTrips});
  } catch (error) {
    res.send(error); 
  }
}); 

//render new trip form 
router.get('/new', (req, res) => {
  res.render('trips/new.ejs'); 
}); 



//create a new trip
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id; //setting owner of the trip 
    await Trip.create(req.body);
    res.redirect('/trips'); 
 } catch (error) {
    res.send(error); 
  }
}); 

//Show details for a single trip

  router.get('/:tripId', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId).populate({
        path:'lists',
        populate: {path: 'items'}
      }) .exec();
      if(!trip) {
        return res.status(404).send('Trip not found');
      }
      res.render('trips/show.ejs', {trip}); 
    } catch (error) {
      res.send(error); 
    }
  });
  
//Edit trip details 

router.get("/:tripId/edit", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).send('Trip not found'); 
    }
    res.render('trips/edit.ejs', {trip});
  } catch (error) {
    res.send(error);
  }
});
 


//handle updating trip details 
router.put('/:tripId', async (req, res) => {
  console.log('PUT route'); 
  console.log('Request body:', req.body); 
    try {
      const tripToUpdate = await Trip.findById(req.params.tripId);
      if (!tripToUpdate) {
        return res.status(404).send('Trip not found'); 
      }
      tripToUpdate.destination = req.body.destination; 
      tripToUpdate.duration = req.body.duration; 
      await tripToUpdate.save(); 
      res.redirect(`/trips/${req.params.tripId}`); 
    } catch (error) {
      console.error(error);
      res.send('An error occured while updating trip'); 
    }

}); 



//delete a trip
  router.delete("/:tripId", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      if (!trip) {
        return res.status(404).send('Trip not found'); 
      }
      await trip.deleteOne();
      res.redirect(`/trips`);
    } catch (error) {
      res.send(error);
    }
  });

  //GET to render and list to trip view
  router.get('/:tripId/add-list', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      if (!trip) {
        return res.status(404).send('Trip not found');
      }
      res.render('trips/add-list.ejs', {trip}); 
    } catch (error) {
      console.error(error);
      res.send('An error occurred while fetching data'); 
    }
  }); 

  
  module.exports = router 
