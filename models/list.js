const mongoose = require('mongoose'); 

const listSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
    }, 
 
    items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    }
    ],
    isComplete: {
        type: Boolean, 
        required: false, 
    }, 
  
});
    

module.exports = mongoose.model("List", listSchema);