let mongoose = require('mongoose')

let InjurySchema = new mongoose.Schema({
    //will be uniquely identified with injuryID - mongoDB generated
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    Position: {
        type: String,
        required: false
    },
    Status: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    Injury: {
        type: String,
        required: true
    },
    Returns: {
        type: String,
        required: false
    },
    pcts_pct: {
        type: Number,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    }

}, { collection : 'injuries' })

var InjuryObject = mongoose.model('Injury', InjurySchema);
module.exports = InjuryObject;