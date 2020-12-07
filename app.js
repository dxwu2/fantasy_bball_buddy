var express = require('express')
var mysql = require('mysql')
var http = require('http')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
//var playerRoute = require('./routes/players')
var injuryRoute = require('./routes/injuries')
//var userRoute = require('./routes/users')
const port = 3000
const connectionString = "mongodb+srv://admin:adminpassword@nba-fantasy-helper.q6k0q.mongodb.net/injuries?retryWrites=true&w=majority";
var sqldb = require('./mysqldb.js')
const morgan = require('morgan')
var Schema = mongoose.Schema;

const { query } = require('express')
const { checkServerIdentity } = require('tls')

// prints GET requests to console -> helps debugging (change 'short' to 'combined' if you want more info)
app.use(morgan('short'))

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB database')
});

app.use(express.static('./routes'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json());

app.post(['/', '/index.html'], function(req, res) {
    /*
    // retrieve player's position first (needed to stored procedure later)
    const playerName = req.body.playerNameJSON;
    const prequeryString = "SELECT position FROM complete_player_data WHERE playerName = (?)";
    let user_position = "";
    var hope = getConnection().query(prequeryString, [playerName], (err, results, fields) => {
        if (err) {
            throw err;
        }
        user_position = results[0].position;
        console.log('wtf: ' + user_position)
        return results;
    })
    console.log('ah: ' + hope[0]);
    */

    // insert into user_players database
    res.send("");
    const playerName = req.body.playerNameJSON;

    const queryString = "INSERT INTO user_players (user_playerName) VALUES (?)"
    getConnection().query(queryString, [playerName], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted player " + playerName + " with id: " + results.insertId)
        res.end()
    })
    
})

app.post('/remove_player', function(req,res){
    const connection = getConnection();

    const playerName = req.body.playerNameJSON;
    const queryString = "DELETE FROM user_players WHERE user_playerName = (?)";
    connection.query(queryString, [playerName], (err, results, fields) => {
        if (err) {
            console.log("Failed to delete: " + err);
            return;
        }
        console.log("Deleted player " + playerName);
        res.end();
    })
})
/*
app.post('/user_create', function(req,res){
    return res.redirect('players');
})
app.get('/players', function(req, res){
    // change to res.json?? -> https://stackoverflow.com/questions/23595282/error-no-default-engine-was-specified-and-no-extension-was-provided
    return res.render('recommend', {
        title: "Recommended Players"
    });
});
*/

/*
app.post('/user_create', (req, res) => {
    console.log("How do we get form data??")
    // const firstName = req.body.create_first_name
    // const lastName = req.body.create_last_name
    const playerName = req.body.create_player_name
    // const playerName = req.body.player_array
    console.log('hi')
    const queryString = "INSERT INTO user_players (user_playerName) VALUES (?)"
    getConnection().query(queryString, [playerName], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert: " + err)
            res.sendStatus(500)
            return
        }
        console.log("Inserted player " + playerName + " with id: " + results.insertId)
        res.end()
    })
})
*/

function getConnection() {
    // return mysql.createConnection({
    //     host: 'nba-fantasy-helper.cqa9nbyrql7w.us-east-1.rds.amazonaws.com',
    //     user: 'admin',
    //     password: 'stinkyece411',
    //     database: 'nba'
    // })
    return mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'stinkyece',
       database: 'nba'
    })
}

app.get('/users/:id', (req, res) => {
    console.log("Fetching with user id: " + req.params.id)

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM user_players WHERE playerID = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        res.json(rows)
    })
})

app.get("/", (req, res) => {
    console.log("Responding to root route yay")
    res.send("hello from root")
})

app.get('/users', (req, res) => {
    const connection = getConnection()

    const queryString = "SELECT * FROM user_players"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        res.json(rows)
    })
})

app.post('/search', (req, res) => {
    //console.log(req.body.partialName)

    const connection = getConnection()
    
    //const queryString = 'SELECT playerName FROM new_player WHERE playerName LIKE "%'+req.body.partialName+'%"'
    const queryString = 'SELECT complete_player_data.playerName FROM complete_player_data LEFT JOIN user_players ON complete_player_data.playerName = user_players.user_playerName WHERE user_players.user_playerName IS NULL AND complete_player_data.playerName LIKE "%'+req.body.partialName+'%"';
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            throw err;
            res.end()
            return
        }

        var data = [];  // why not {}?
        let resData;
        //console.log('row length: ' + rows.length)
        for (i = 0; i < rows.length; i++) {
            resData = {
                playerName: rows[i].playerName,
                team: rows[i].team
            };
            data.push(resData)
        }
        /*
        for (i = 0; i < rows.length; i++) {
            data.push(rows[i].playerName);
        }
        */
        //console.log('data: ' + data)
        //console.log('jsoned data: ' + JSON.stringify(data))
        res.end(JSON.stringify(data))
    })
})

app.get('/search',function(req,res){
    const connection = getConnection()
    
    connection.query('SELECT playerName FROM new_player WHERE playerName LIKE "%'+req.query.key+'%"',
    function(err, rows, fields) {
        if (err) {
            // throw err;
            res.end()
            return
        }
        var data=[];
        for(i=0;i<rows.length;i++) {
            data.push(rows[i].first_name);
        }
        res.end(JSON.stringify(data));
    });
});

app.post('/pts_mult', function(req,res){
    const connection = getConnection()

    const pts_mult = req.body.ptsJSON;
    const reb_mult = req.body.rebJSON;
    const assist_mult = req.body.assistJSON;
    const blk_mult = req.body.blkJSON;
    const stl_mult = req.body.stlJSON;

    //console.log(pts_mult + ', ' + reb_mult + ', ' + assist_mult + ', ' + blk_mult + ', ' + stl_mult)

    const queryString = "UPDATE league_settings SET pts_value = ?, reb_value = ?, assist_value = ?, blk_value = ?, stl_value = ? WHERE league_id = 1";

    getConnection().query(queryString, [pts_mult, reb_mult, assist_mult, blk_mult, stl_mult], (err, results, fields) => {
        if (err) {
            console.log("Failed to insert: " + err)
            res.sendStatus(500)
            return
        }
        console.log('inserted?')
        res.end()
    })
})

app.post('/otherinfo', function(req,res){
    const connection = getConnection()

    const queryString = "SELECT position, team FROM complete_player_data WHERE playerName = ?";
    connection.query(queryString, [req.body.playerNameJSON], (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.end(JSON.stringify(results))
    })
})

app.use(bodyParser.json())
app.use((req, res, next) =>{
    console.log(`${new Date().toString()} => ${req.originalUrl}`)
    next()
})

app.set('view engine', 'ejs')

app.post('/user_create', (req,res) => {
    const connection = getConnection()

    const queryString = "CALL new_procedure()";
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for recommended players: " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        //console.log(rows[0])
        //console.log(res.json(rows[0]))
        // console.log(rows)
        res.render('recommend', {title: 'User List', userData: rows[0]})
    })
    //res.render('recommend')
})

app.use('/routes/injuries', injuryRoute);

// this is unused
app.get('/user_create', (req,res) => {
    const connection = getConnection()

    const queryString = "SELECT playerName FROM player"
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for recommended players: " + err)
            res.sendStatus(500)
            res.end()
            return
        }
        console.log(res.json(rows))
    })
})

/* Injury page (mongoDB) */
var schemaName = new Schema({
    firstName: String,
    lastName: String,
    Date: Date,
    Injury: String,
    Returns: String,
    returnDate: Date
}, {
    collection: 'injuries'
});

/*
var Model = mongoose.model('Model', schemaName);
mongoose.connect("mongodb+srv://admin:adminpassword@nba-fantasy-helper.q6k0q.mongodb.net/injuries?retryWrites=true&w=majority");
app.get('/injury', (req,res) => {
    Model.find
    
})
*/


//add player routes
//app.use(playerRoute)

//add injury routes
app.use(injuryRoute)

//add user routes
//app.use(userRoute)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})