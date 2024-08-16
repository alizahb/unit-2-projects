const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// Index
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('items/index.ejs', {
      inventory: currentUser.inventory,
    });
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
});

// New
router.get('/new', async (req, res) => {
  res.render('items/new.ejs');
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

// Edit
router.get('/:itemId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const item = currentUser.inventory.id(req.params.itemId);
    res.render('items/edit.ejs', {
      item: item,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

// Update
router.put('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const item= currentUser.inventory.id(req.params.itemId);
    item.set(req.body);
    await currentUser.save();
    res.redirect(
      `/users/${currentUser._id}/items/`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

// Delete
router.delete('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.inventory.id(req.params.itemId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/items`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

module.exports = router;