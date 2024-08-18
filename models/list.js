const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const listSchema = new Schema({
    description: {
        type: String, 
        required: true, 
    }, 
    items: [
        { 
    type: Schema.Types.ObjectId, ref: 'InventoryItem'},
    ],
    isComplete: {
        type: Boolean, 
        default: false, 
    }, 
      //  timestamps: true
    }); 


    const List = mongoose.model('List', listSchema); 
    module.exports = List 