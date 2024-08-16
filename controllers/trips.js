const express = require("express");
const router = express.Router();
const Trip = require("../models/trip.js");
const List = require("../models/list.js");
const User = require("../models/user.js"); 

//Index Route- show user's trips 

router.get('/', async (req, res) => {
  try {
    const userTrips = await Trip.find({ owner: req.session.user._id });
    res.render('trips/index.ejs', {
      trips: userTrips,
    });
  } catch (error) {
    res.send(error); 
  }
}); 

//New route - form to create new trip 

router.get('/new', (req, res) => {
  res.render('trips/new.ejs'); 
}); 

//Create- post request to create a new trip

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id; 
    await Trip.create(req.body); 
    res.redirect(`/trips`); 
  } catch (error) {
    res.send(error); 
  }
}); 

//Show route- show a single trip details 

router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate(
      'lists'
    ); 
    const allLists = await List.find({}); 
    res.render('trips/show.ejs', {
      trip: trip,
      allLists: allLists,
    });
  } catch (error) {
    res.send(error); 
  }
});

//edit route- form to edit existing trip 

router.get("/:tripId/edit", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    const allLists = await List.find({});
    res.render("trips/edit.ejs", {
      trip: trip, 
      allLists: allLists,
    });
  } catch (error) {
    res.send(error);
  }
});

//Update route- put request to update a trip 
router.put('/:tripId', async (req, res) => {
  try {
      //find existing trip
      const tripToUpdate = await Trip.findById(req.params.tripId);
      //update basic fields
      tripToUpdate.destination = req.body.destination; 
      tripToUpdate.duration = req.body.duration; 
      const selectedLists = Array.isArray(req.body.lists)
        ? req.body.lists
        : [req.body.lists]; 
       //update lists
       tripToUpdate.lists = selectedLists; 
       await tripToUpdate.save();  
       res.redirect(`/trips/${req.params.tripId}`); 
  } catch (error) {
    res.send('An error occred while updating your trip details.')
  }

  }); 

  //DELETe route - delete a specific trip 

  router.delete("/:tripId", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      await trip.deleteOne();
      res.redirect(`/trips`);
    } catch (error) {
      res.send(error);
    }
  });
  
  // Relating Data Routes
  
  // GET - to render an Add Ingredients view
  router.get("/:tripId/add-lists", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId).populate(
        "lists"
      );
      const allLists = await List.find({});
  
      res.render("trips/add-lists.ejs", {
        trip: trip, 
        allLists: allLists, 
      });
    } catch (error) {
      console.error(error);
      res.send("An error occurred while fetching data.");
    }
  });
  
  // POST - to add lists to a trip 
  router.post("/:tripId/lists", async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
  
      // Ensure req.body.lists is array
      const listIds = Array.isArray(req.body.lists)
        ? req.body.lists
        : [req.body.lists];
        trip.lists = [
          ...new Set([...trip.lists, ...listIds]),
        ];
        await trip.save(); 
        res.redirect(`trips/${req.params.tripId}`); 
      } catch(error) {
        console.error(error); 
        res.send('An error occured while updating your trip.'); 
      }
    }); 
  
  module.exports = router 
