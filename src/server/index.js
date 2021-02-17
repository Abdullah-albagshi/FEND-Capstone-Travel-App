// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//load env config
const dotenv = require('dotenv');
dotenv.config();


// Start up an instance of app
const app = express();

// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// send index.html when there is request for '/'
app.get('/', function(req, res) {
    res.sendFile('dist/index.html');
});

//import routes as middleware
app.use(require('./routes/routesIndex'));

// set port to be 3000 or a given port in .env config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// export express app
module.exports = { app }