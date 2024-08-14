const mongoose = require('mongoose'); 

const tripSchema = new mongoose.Schema({
    destination: {
        type: String,
        required: true,
    }, 
    duration: {
        type: String, 
        required: true, 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

    lists: [
        {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List'
        },
    ],
});

module.exports = mongoose.model('Trip', tripSchema); 