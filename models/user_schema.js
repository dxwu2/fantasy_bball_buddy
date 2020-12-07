let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    leagueID: {
        type: Number,
        require: false
    },
    team_name: {
        type: String,
        require: true
    },
    players: {
        type: Array
    },
    total_points: {
        type: Number,
        default: 0.0
    }

})

var User = mongoose.model('User', UserSchema);
module.exports = User;