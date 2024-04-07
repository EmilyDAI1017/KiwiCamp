const mysql = require('mysql');

module.exports = (app, connection) => {
    app.get('/', function (req, res) {
        connection.query('SELECT * FROM activity', function(err, data) {
            (err)?res.send(err) : res.json({ activity: data });
    });
        });
    
};
    