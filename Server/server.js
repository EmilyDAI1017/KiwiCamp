const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

// Path: routes/html-routes.js
require('./routes/html_routes')(app, connection);

// Serve static files
app.listen(port, () => {
    console.log('Server is running on port ${port}');
    
});

