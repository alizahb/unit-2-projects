const mongoose = require('mongoose');

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
}); 


const User = mongoose.model('User', userSchema);

module.exports = User;