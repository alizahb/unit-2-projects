const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const itemSchema = new Schema({
  name: {
    type: String, 
    required: true, 
  }, 
  quantity: {
    type: Number, 
    default: 1 
}, 

}); 

//const Item = mongoose.model('Item', itemSchema);
module.exports = mongoose.model('Item', itemSchema); 

