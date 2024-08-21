const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const listSchema = new Schema({
  name: String, 
  items: [{
      name: {type: String, required:true},
      quantity: {type: Number, required: true}, 
  }], 
}); 


const tripSchema = new mongoose.Schema({
     destination: {
        type: String,
        required: true,
    }, 
    duration: {
        type: Number, 
        required: true, 
    },
    lists: [listSchema], 
    owner: {
      type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true}, 

  });  

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip; 
