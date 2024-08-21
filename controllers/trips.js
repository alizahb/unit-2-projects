const express = require("express");
const router = express.Router();
//const mongoose = require('mongoose'); 
const Trip = require("../models/trip.js");
const User = require("../models/user.js");
//const Item = require('../models/item.js'); 
//const User = require("../models/user.js"); 



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

    console.log('new trip data:', req.body); 
    req.body.owner = req.session.user._id; 
      const newTrip = await Trip.create(req.body); 
      console.log('new trip:', newTrip); 
      const user= await User.findById(req.session.user._id); 
    user.trips.push(newTrip._id); 
    await user.save(); 
    res.redirect(`/trips/${newTrip._id}`); 
 } catch (error) {
    res.send(error); 
    console.error('Error creating trip:', error); 
    res.status(500).send('Error creating trip');  
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



  //GET to render add list to trip view
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



  //add list to trip 
  router.post('/:tripId', async (req, res) => {
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


//edit a list within a trip page render
router.get('/:tripId/lists/:listId/edit', async (req, res) => {
  console.log(`GET/trips/${req.params.tripId}.lists/${req.params.listId}/edit`); 
  try {
    const trip = await Trip.findById(req.params.tripId); 
    if (!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const list = trip.lists.id(req.params.listId); 
    if(!list) {
      return res.status(404).send('List not found'); 
    }
    res.render('trips/edit-list.ejs', { trip, list }); 
  } catch (error) {
    console.error(error); 
    res.status(500).send('An error occured while fetching the list to edit')
  }
}); 

//handle list update
router.put('/:tripId/lists/:listId', async(req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if(!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const list = trip.lists.id(req.params.listId); 
    if(!list) {
      return res.status(404).send('List not found'); 
    }
    list.name = req.body.listName; 
    list.items = req.body.items.map(item => ({
      name: item.name, 
      quantity: item.quantity
    })); 
    await trip.save(); 
    res.redirect(`/trips/${trip._id}`)
  } catch (error) {
    console.error (error);
    res.status(500).send('An error occured while updating the list'); 
  }
}); 


//Delete specific list item
router.delete('/:tripId/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if(!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const list = trip.lists.id(req.params.listId);
    if(!list) {
      return res.status(404).send('List not found'); 
    }
    const itemIndex=list.items.findIndex(item=> item._id.toString() === req.params.itemId); 
    if(itemIndex=== -1) {
      return res.status(404).send('Item not found'); 
    }
    list.items.splice(itemIndex, 1);
    await trip.save();
    res.redirect(`/trips/${req.params.tripId}`); 
    } catch(error) {
      console.error(error); 
      res.status(500).send('An error occured while delete the item'); 
    }
  });


//delete a list from trip
router.delete('/:tripId/lists/:listId', async (req, res) => {
  console.log('deleting:', req.params); 
  try {
    const trip = await Trip.findById(req.params.tripId); 
    if(!trip) {
      return res.status(404).send('Trip not found'); 
    }
    const listIndex= trip.lists.findIndex(list=>list._id.toString() === req.params.listId); 
    if (listIndex > -1) {
      trip.lists.splice(listIndex, 1); 
      await trip.save(); 
    }
res.redirect(`/trips/${req.params.tripId}`); 
  } catch (error) {
    console.error(error); 
    res.status(500).send('An error occured while deleting your list')
  }
}); 


    
   

  module.exports = router 
