module.exports = function(app, connection){
    app.get('/',function (req, res) {
        res.send('Hello from react');
    }); 
};