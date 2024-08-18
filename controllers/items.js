const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Item = require('../models/item.js'); 

//item index
router.get('/users/:userId/items', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('inventory');
    if (!user) {
      return res.redirect('/'); 
    }
    res.render('items/index.ejs', {
      user: user, 
      inventory : user.inventory, 
    });  
  } catch (error) {
    console.error(error); 
    res.redirect('/'); 
  }
}); 



//new item page
router.get('/users/:userId/items/new', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id); 
    res.render('items/new.ejs', {user: currentUser}); 
  } catch (error) {
    console.error(error);
    res.redirect('/'); 
  }
});

//add a new item to inventory 
router.post('/users/:userId/items', async (req, res) => {
  console.log('Recieved POST request to add item');
  console.log('Request body:', req.body); 
  console.log('User Id:', req.params.userId); 

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.redirect('/'); 
    }
    if(!user.inventory) {
      user.inventory = [];
    }
    const newItem = new Item ({
      name: req.body.name, 
      quantity: req.body.quantity, 
    }); 
    await newItem.save(); 

    user.inventory.push(newItem._id);
    await user.save();

    res.redirect(`/users/${user._id}/items`);
  }catch (error) {
    console.error(error);
    res.redirect('/'); 
  }
}); 



//edit page
router.get('/users/:userId/items/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('inventory'); 
    if (!user) {
      return res.redirect('/'); 
    }

    //const currentUser = await User.findById(req.session.user._id); 
    const item = user.inventory.find(item => item.id.toString()===req.params.itemId);
    if (!item) {
      return res.redirect('/'); //Handle item not found error 
    }
    res.render('items/edit.ejs', {
        item: item, 
        user: user, 
    }); 
  }catch (error) {
    console.log(error);
    res.redirect('/')
   
   }
  });

/*
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
*/







/*// Create
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

*/
//edit an item 
router.put('/users/:userId/items/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('inventory');
    if(!user) {
      return res.redirect ('/');

    }
    const item = user.inventory.find(item => item._id.toString()===req.params.itemId);
    if (!item) {
      return res.redirect('/');
    }
      item.name = req.body.name;
      item.quantity = req.body.quantity; 
      await item.save();
    res.redirect(`/users/${user._id}/items`);
  }catch (error) {
    console.error(error);
    res.redirect ('/'); 
  }
});



/*  
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
});   */
    


router.delete('/users/:userId/items/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.redirect('/'); 
    }
    user.inventory.pull(req.params.itemId);
    await user.save(); 
    res.redirect(`/users/${user._id}/items`);
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
 
}); 

module.exports = router;