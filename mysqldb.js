var mysql = require('mysql');
var sqldb;

function connectDatabase() {
    if(!sqldb) {
        // sqldb = mysql.createConnection({
        //     host: 'nba-mysqldb.cqa9nbyrql7w.us-east-1.rds.amazonaws.com',
        //     user: 'admin',
        //     password: 'password',
        //     database: 'nba',
        //     queueLimit : 0, // unlimited queueing
        //     connectionLimit : 0 // unlimited connections 
        // });
        sqldb = mysql.createConnection({
            host: 'nba-fantasy-helper.cqa9nbyrql7w.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'stinkyece411',
            database: 'nba',
            queueLimit : 0, // unlimited queueing
            connectionLimit : 0 // unlimited connections 
        });

        sqldb.connect(function(error) {
            if(!!error) {
                console.log('Error connecting to MySQL: ' + error);
            } else {
                console.log('Connected to MySQL database');
            }
        });

    }
    return sqldb;
}

module.exports = connectDatabase();