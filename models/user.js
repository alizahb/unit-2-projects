const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  inventory: [
    {
    type: Schema.Types.ObjectId, ref: 'Item'
    //mongoose.Schema.Types.ObjectId, 

    },

  ],

}); 
    

//const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema); 