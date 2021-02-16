# Travel App

## Table of Contents

* [Description](#Description)
* [API](#API)
* [Technologies](#Technologies)
* [Setup](#Setup)
* [Environment variables](#Environment-variables)


## Description

This project requires you to build out a travel app that, at a minimum, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs. Given that this is the Capstone project, it's highly encouraged for you to go above and beyond, adding additional functionality and customization to truly stand out with a project you are proud to have at the top of your portfolio!


## API(s)

* [Country API](https://restcountries.eu/) - RESTful Api for countries names and details
* [Geonames API](http://www.geonames.org/export/web-services.html) - Geographical database from which the location data is pulled
* [Weahterbit API](weatherbit.io) - Weather API for current and future weather data
* [Pixabay API](https://pixabay.com/api/docs/) - RESTful interface for searching and retrieving free images and videos




## Technologies
Project is created with:
* [Bootstrap](https://getbootstrap.com/) - The CSS framework used 
* [Sass](https://sass-lang.com/documentation) - The web framework used
* [Webpack](https://webpack.js.org/concepts/) - Asset Management
* [Babel](https://babeljs.io/) - JavaScript Compiler
* [Node.js](https://nodejs.org/en/) - JavaScript Runtime
* [Express.js](https://expressjs.com/) - Server Framework for Node.js
* [Jest](https://jestjs.io/) - Testing suit




## Setup
To run this project, 

1. clone or download this repository 

2. Install dependencies
```
npm install
```
3. Start the server
```
npm start
```
4. Setup the environment development or production
```
npm run build-dev
```
* or 
```
npm run build-prod
```
5. Test with Jest
```
npm run test
```

## Environment variables

create a file `.env` in project directory 

add a variables `GEONAME_KEY, WEATHERBIT_KEY and PIXABAY_KEY` and assign them to your keys 
```
GEONAME_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx 
```
WEATHERBIT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx 
```
PIXABAY_KEY=xxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxx
```




