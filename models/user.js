const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
      type: String, 
      required: true, 
  },
}); 

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
   trips: [
    {
        type: mongoose.Types.ObjectId,
        ref: 'Trip', 
    },
],
 inventory: [itemSchema], 
 about: {
  type: String, 
 },
});  


const User = mongoose.model('User', userSchema);

module.exports = User;