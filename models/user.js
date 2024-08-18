const mongoose = require('mongoose');
//const Schema = mongoose.Schema; 

const itemSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
  }, 
  quantity: {
    type: Number, 
    default: 1 
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
  inventory: [itemSchema], 
}); 
    

const User = mongoose.model('User', userSchema);

module.exports = User;