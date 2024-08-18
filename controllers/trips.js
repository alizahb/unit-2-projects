const express = require("express");
const router = express.Router();
const mongoose = require('mongoose'); 
const Trip = require("../models/trip.js");
const List = require("../models/list.js");
const User = require("../models/user.js"); 


//trip index
router.get('/', async (req, res) => {
  try {
    const userTrips = await Trip.find({ owner: req.session.user._id });
    res.render('trips/index.ejs', {trips: userTrips,
    });
  } catch (error) {
    res.send(error); 
  }
}); 

//new trip form
router.get('/new', (req, res) => {
  res.render('trips/new.ejs'); 
}); 

//create a new trip
router.post('/', async (req, res) => {
  console.log('request body', req.body); 
  try {
    req.body.owner = req.session.user._id;
    await Trip.create(req.body);
    res.redirect('/trips'); 
 } catch (error) {
    res.send(error); 
  }
}); 

//show trip details
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate(
      'lists'
    ); 
    if (!trip) {
      return res.status(404).send('Trip not found');
    }
    const allLists = await List.find({}); 
    res.render('trips/show.ejs', {
      trip: trip,
      allLists: allLists,
    });
  } catch (error) {
    res.send(error); 
  }
});

//edit trip page 
router.get("/:tripId/edit", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('lists'); 
    res.render("trips/edit.ejs", { trip }); 
      //trip: trip, 
      //allLists: allLists,
      //description: list.description, 
    //});
  } catch (error) {
    res.send(error);
  }
});
/*
//add lists to a trip page 
router.get("/trips/:tripId/add-lists", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('lists'); 
    if (!trip) return res.status(404).send('Trip not found'); 
    const newList = new List ({ description : req.body.description }); 
    trips.lists.push(newList); 
    await newList.save(); 
    await trip.save(); 
    res.redirect('/trips/${trip._id}/edit'); 
    res.render('trips/add-lists.ejs', {trip, allLists }); 
  } catch (error) {
    console.error(error); 
    res.redirect('/trips'); 
  }
}); 
  */  

  // render an Add lists view
  router.get("/:tripId/add-lists", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId).populate("lists");
      const allLists = await List.find({});
      const user = await User.findById(req.session.user._id).populate('inventory'); 
      
      if (!trip) {
        return res.status(404).send('Trip not found'); 
      }
      if (!user) {
        return res.status(404).send('User not found');   
      }
      res.render("trips/add-lists.ejs", {
        trip: trip, 
        allLists: allLists, 
        inventory: user.inventory, 
      });
    } catch (error) {
      console.error(error);
      res.send("An error occurred while fetching data.");
    }
  });
   

//update trip details
router.put('/:tripId', async (req, res) => {
    try {
      const tripToUpdate = await Trip.findById(req.params.tripId);
      if (!tripToUpdate) {
        return res.status(404).send('Trip not found'); 
      }
      tripToUpdate.destination = req.body.destination; 
      tripToUpdate.duration = req.body.duration; 
      
      const selectedLists = Array.isArray(req.body.lists)
      ? req.body.lists
      : [req.body.lists]; 
      const validLists = await List.find({ _id: { $in: selectedLists } });
    
      tripToUpdate.lists = validLists.map(list => list._id); 
      await tripToUpdate.save();
      res.redirect('/trips'); 
    } catch (error) {
      console.error(error);
      res.send('An error occured while updating trip'); 
    }

}); 

/*
  router.post('/trips/:id/lists', async (req, res) => {
    try {
    const tripId = req.params.id; 
      const trip = awaitTrip.findById(tripId);
      if (!trip) {
        return res.redirect('/trips');
      }
      const newList = newList({ description: req.body.description });
      trip.lists.push(newList);
      await newList.save();
      await trip.save();
      res.redirect(`/trips/${tripId}/edit`);
    } catch (error) {
      console.error(error);
      res.redirect('/trips');
    };
  });
*/


  router.post('/:tripId/lists', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId); 
      
      if(!trip) {
        return res.status(404).send('Trip not found'); 
      }
      const itemIds = req.body.items
        ? (Array.isArray(req.body.items) ? req.body.items : [req.body.items]) :
        [];
      
      const objectIds = itemIds.map(id => mongoose.Types.ObjectId(id));
      const newList = new List({
        description: req.body.description, 
        items: objectIds,
      });
      await newList.save(); 
      trip.lists.push(newList._id); 
      await trip.save(); 
      res.redirect(`/trips/${trip._id}/edit`); 
    } catch (error) {
      console.error(error);
      res.send('An error occured while adding list'); 
    }
  }); 
     


  router.delete("/:tripId", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      await trip.deleteOne();
      res.redirect(`/trips`);
    } catch (error) {
      res.send(error);
    }
  });



  
//Post -add lists to trip 

router.post('/:tripId/lists', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      const listIds= Array.isArray(req.body.lists) 
      ? req.body.lists : [req.body.lists];
      
      trip.lists = [
        ...new Set ([...trip.lists, ...listIds]),
      ];
      await trip.save(); 

      res.redirect(`trips/${req.params.recipeId}`); 
    } catch(error) {
      console.error(error);
      resnsend('An error occured while updating your trip'); 
    }
  });
      /*const newList = newList({
        items: selectedItems, 
        trip: trip._id
      }); */
 
  
  module.exports = router 
