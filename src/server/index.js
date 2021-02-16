// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();


// Start up an instance of app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static('dist'));

app.get('/', function(req, res) {
    res.sendFile('dist/index.html');
});

app.use(require('./routes/routesIndex'));

// set port to be 3000 or a given port in .env config
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});


module.exports = { app }