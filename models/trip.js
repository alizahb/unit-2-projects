const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const tripSchema = new Schema({
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
        type: Schema.Types.ObjectId, ref: 'List'
        //mongoose.Schema.Types.ObjectId, 

        },
    ],
});


module.exports = mongoose.model('Trip', tripSchema)