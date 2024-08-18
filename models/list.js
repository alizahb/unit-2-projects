const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const listSchema = new Schema({
    description: {
        type: String, 
        required: true, 
    }, 
    
    isComplete: {
        type: Boolean, 
        default: false, 
    }, 
      //  timestamps: true
    }); 



    module.exports = mongoose.model('List', listSchema);