var mongoose = require('mongoose');
const { model } = require('./dishes');
const Schema = mongoose.Schema;

const LeadersSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    image:{
        type: String,
        required: true
    }, 
    designation:{
        type: String,
        required: true   
    },
    abbr: {
        type: String,
        required: true   
    }, 
    description: {
        type: String,
        required: true   
    }, 
    featured: {
        type: Boolean,        
        default: false
    }
})

var Leaders = mongoose.model('Leader', LeadersSchema)

module.exports = Leaders;