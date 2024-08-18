const express = require('express');
const router = express.Router();
const User = require('../models/user');

//edit page
router.get('/:itemId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); 
    const item = currentUser.inventory.id(req.params.itemId);
    if (!item) {
      return res.redirect(`/users/${currentUser._id}/items`);
    }
    res.render('items/edit.ejs', {
        item: item, 
        user: currentUser, 
    }); 
  }catch (error) {
    console.log(error);
    res.redirect('/')
   
   }
  });


//view inventory
router.get('/users/:userId/items', async (req, res) => { 
  try {
    const currentUser = await User.findById(req.params.userId).populate ('inventory');
    if (!currentUser) {
      return res.redirect('/'); 
    }  
    res.render('./items/index.ejs', {
        inventory: currentUser.inventory, 
        user: currentUser,
      }); 
  } catch (error) {
    console.log(error)
    res.redirect('/'); 
  } 
}); 


// New
router.get('/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); 
    res.render('items/new.ejs', {user: currentUser}); 
  } catch (error) {
    console.error(error);
    res.redirect('/'); 
  }
});


// Create
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); 
    currentUser.inventory.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/items`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});






  
// Update
router.put('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const item = currentUser.inventory.id(req.params.itemId); 
    item.set(req.body);
    await currentUser.save();
    res.redirect(
      `/users/${currentUser._id}/items/`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/'); 
  }
});   
    


router.delete('/users/:userId/items/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const itemIndex = currentUser.inventory.findIndex (item => item._id.equals (req.params.itemId));
    if(itemIndex > -1) {
      currentUser.inventory.splice(itemIndex, 1);
      await currentUser.save(); 
    }
    res.redirect(`/users/${currentUser._id}/items`); 
  }catch (error) {
    console.log(error);
    res.redirect('/'); 
  }
}); 

module.exports = router;