const axios = require('axios');
const express = require('express');
const router = express.Router();


// get request for geo Names api
router.get('/geonames/:city', (req, res) => {

    // input city 
    let city = req.params.city;

    //geo Names api key
    const geoNameApiKey = process.env.GEONAME_KEY

    let getDetails = async() => {
        //Api call
        const serverReq = await axios.get(
            `http://api.geonames.org/searchJSON?q=${city}&username=${geoNameApiKey}`
        );
        //Api response
        const serverRes = serverReq.data.geonames[0]
            //convert response to JSON
        res.json(serverRes)
    };
    return getDetails()
});

// get request for weatherbit api
router.get('/weatherbit/:city', (req, res) => {
    // object input 
    let { lat, lon, days = 16 } = JSON.parse(req.params.city);

    //weatherbit api key
    const weatherBitApiKey = process.env.WEATHERBIT_KEY

    let getDetails = async() => {
        //Api call
        const serverReq = await axios.get(
            `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=${days}&key=${weatherBitApiKey}`
        );
        //Api response
        const serverRes = serverReq.data
            //convert response to JSON
        res.json(serverRes)
    };
    return getDetails()
});

// get request for pixabay api
router.get('/pixabay/:city', (req, res) => {

    // input city 
    let city = req.params.city;

    //split city name by + if there is a space
    let cityName = city.split(' ').join('+')

    //geo Names api key
    const pixabayKey = process.env.PIXABAY_KEY
    let getDetails = async() => {
        //Api call
        const serverReq = await axios.get(
            `https://pixabay.com/api/?key=${pixabayKey}&q=${cityName}&catrgory=travel`
        );
        //Api response
        const serverRes = serverReq.data
            //convert response to JSON
        res.json(serverRes)
    };
    return getDetails()
});


//export routes
module.exports = router;