const express = require("express");
const router = express.Router();
const Trip = require("../models/trip.js");
const List = require("../models/list.js");
const User = require("../models/user.js"); 


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


router.get('/new', (req, res) => {
  res.render('trips/new.ejs'); 
}); 


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


router.get("/:tripId/edit", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('lists');
    if (!trip) {
      return res.status(404).send('Trip not found'); 
    }
   
    res.render('trips/edit.ejs', {trip}); 
  } catch (error) {
    res.send(error);
    res.redirect('/'); 
  }
});


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


  router.post('/:tripId/lists/add-items', async (req, res) => {
    try {
      const { listId, items } = req.body;
      const trip = awaitTrip.findById(req.params.tripId);
      const list = trip.lists.id(listId);
  
      if (list) {
        list.items = items; // Assuming list.items is an array of item IDsawait trip.save();
        res.redirect(`/trips/${trip._id}`);
      } else {
        res.status(404).send('List not found');
      }
    } catch (error) {
      console.error(error);
      res.redirect('/');
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



  // GET - to render an Add lists view
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
