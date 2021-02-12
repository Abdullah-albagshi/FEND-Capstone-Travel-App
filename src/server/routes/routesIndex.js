const axios = require('axios');
const express = require('express');
const router = express.Router();



router.get('/geonames/:city', (req, res) => {
    let city = req.params.city;
    console.log(city);

    const geoNameApiKey = process.env.GEONAME_KEY

    let getDetails = async() => {
        const serverReq = await axios.get(
            `http://api.geonames.org/searchJSON?q=${city}&username=${geoNameApiKey}`
        );
        const serverRes = serverReq.data
        res.json(serverRes)
    };
    return getDetails()
});


router.get('/weatherbit/:city', (req, res) => {
    let { lat, lon, days = 16 } = JSON.parse(req.params.city);
    console.log(lat, lon, days);
    const weatherBitApiKey = process.env.WEATHERBIT_KEY

    let getDetails = async() => {
        const serverReq = await axios.get(
            `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=${days}&key=${weatherBitApiKey}`
        );
        const serverRes = serverReq.data
        res.json(serverRes)
    };
    return getDetails()
});


router.get('/pixabay/:city', (req, res) => {
    let city = req.params.city;
    const pixabayKey = process.env.PIXABAY_KEY

    let getDetails = async() => {
        const serverReq = await axios.get(
            `https://pixabay.com/api/?key=${pixabayKey}&q=${city}&catrgory=travel`
        );
        const serverRes = serverReq.data
        console.log(serverRes);
        res.json(serverRes)
    };
    return getDetails()
});


module.exports = router;