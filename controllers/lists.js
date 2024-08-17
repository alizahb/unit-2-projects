const express = require("express");
const router = express.Router();
const List = require("../models/list.js");

// Index Route - List all packing lists 
router.get('/', async (req, res) => {
  try {
    const lists = await List.find({});
    res.render("lists/index.ejs", {
      lists: lists
    });
  } catch (error) {
    res.send(error);
  }
});

// Create Route - Add a new list to  all trips 
router.post('/', async (req, res) => {
    try {
        await List.create(req.body);
        res.redirect('/lists');
    } catch (error) {
        res.send(error);
    }
});


module.exports = router;
