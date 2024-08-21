const express = require('express');
const router = express.Router();
//const User = require('../models/user.js');
const Item = require('../models/Item.js'); 
/*
//inventory index- list all items 
router.get('/', async (req, res) => {
  try {
   const items = await Item.find ({}); 
    res.render('items/index.ejs', {
      items: items,  
    });  
  } catch (error) {
  res.send(error); 
  }
}); 

//create- Add a new item to all items 

router.post('/', async (req, res) => {
  try{
    await Item.create(req.body);
    res.redirect('/items'); 
  } catch (error) {
    res.send(error); 
  }
}); 


//update inventory item 
    router.put('/:id', async (req, res) => {
      //const { id } = req.params;
      try {
        const item = await Item.findByIdAndUpdate(id, req.params.id, {new: true});
        res.redirect('/inventory'); 
      await item.save();
  }catch (error) {
    console.error(error);
    res.redirect('/'); 
  }
}); 

//delete item 

router.delete('/:id', async (req, res) => {
  try {
    //const { id } = req.params; 
    //const user = await User.findById(req.params.userId);
    //if (!user) {
      //return res.redirect('/'); 
    //}
    const item = await Item.findById(req.params.id);
    await Item.deleteOne(); 
    res.redirect('/inventory'); 
    //user.inventory.pull(req.params.itemId);
    //await user.save(); 
  } catch (error) {
    console.error(error);
  }
 
}); 


module.exports = router;*/