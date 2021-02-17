//import API caller functions
// import { countries } from './API/restAPI';
import { geoNames } from './API/geonamesAPI';
import { weather } from './API/weatherbitAPI';
import { pixabay } from './API/pixabayAPI';

const createBtn = document.querySelector('.create');
const saveBtn = document.querySelector('.save');
const loadBtn = document.querySelector('.load');
const removeBtn = document.querySelector('.remove');

const alerts = document.querySelector('.alerts');
const tripInfo = document.querySelector('#trip-info');
const tripWeatherImage = document.querySelector('.trip-weather-image');
const select = document.querySelector('.selectpicker');
const carouselItem = document.querySelector('.carousel-inner');
const accordion = document.querySelector('#collapseOne .card-body');
const loader = document.getElementById('loader');

const startDate = document.querySelector('#start-date');
const endDate = document.querySelector('#end-date');
const today = new Date();

let cityName, lat, lon, carouselItemSlide, accordionItem, tripInfoSave;



// make sure click Event Listener can be called when document fully loaded
document.addEventListener('DOMContentLoaded', function() {
    createBtn.addEventListener('click', createTrip);
    saveBtn.addEventListener('click', saveTrip);
    loadBtn.addEventListener('click', loadTrip);
    removeBtn.addEventListener('click', () => remove(true));
})


//async create trip function
async function createTrip() {
    //remove old trip from dom
    remove();

    //call check date function 
    if (checkDate() == false) {
        return;
    } else {
        checkDate();
    }
    // make spinner appear
    loader.classList.add('loader');

    // get city input and split it by + if there is a space
    let inputCity = select.value.split(' ').join('+');

    // call geoname function asynchronous 
    let geoData = await geoNames(inputCity);

    // if city not found alert user
    if (!geoData) {
        alerts.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>city not found!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
        loader.classList.remove('loader');
        return;
    }
    // assign lat and lon
    lat = geoData.lat;
    lon = geoData.lng;

    // get city input and split it by + if there is a space
    cityName = geoData.name.split(' ').join('+');

    // call weatherbit function asynchronous 
    let weatherData = await weather({ lat, lon });

    // call picabay function asynchronous 
    let pixabayData = await pixabay(cityName);

    //call UI updaters asynchronously
    await tripDescription(geoData);
    await addItemsToAccordion(weatherData);
    await addItemsToCarousel(pixabayData);
    // remove spinner after success calls
    loader.classList.remove('loader');

}

// update UI with trip description 
function tripDescription(geoData) {
    //count days till the trip
    let daysTillTrip = parseInt(
        (startDate.valueAsDate - today) / (1000 * 60 * 60 * 24) + 1
    );
    //count the trip duration 
    let tripDuration = parseInt(
        (endDate.valueAsDate - startDate.valueAsDate) / (1000 * 60 * 60 * 24) +
        1
    );
    tripInfoSave = ` <h4>The country you want to visit is <strong>${
		geoData.countryName || geoData.name
	}</strong> </h4>
    <h4>Departing on : <strong> ${startDate.value}</strong></h4>
    <h4><strong> ${daysTillTrip}</strong> day(s) Till the trip</h4>
    <h4>The trip duration: <strong> ${tripDuration} </strong> day(s)</h4>`;

    // update UI
    tripInfo.innerHTML = tripInfoSave;
    // display UI change
    tripInfo.classList.remove('d-none');
}

// validate inputs
function checkDate() {
    // change date input to a full date 
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);

    //check if all are inputs field
    if (!startDate.value || !endDate.value || !select.value) {
        alerts.innerHTML = `<div class="alert alert-warning  alert-dismissible fade show" role="alert">
        <strong>All Fields must be field!</strong></div>`;
        return false;
    } else {
        alerts.innerHTML = '';
    }
    //86400000 is a day in milliseconds
    // check if start date is larger than today's date
    if (startDateObj - today < -86400000) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>The start date can't be less today date!</strong></div>`;
        return false;
    }
    // check if end date is less than start date
    if (endDateObj - startDateObj < 0) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show" role="alert">
        <strong>end date can't be less than start date!</strong></div>`;
        return false;
    }
}

// update carousel with pixabay returned data
function addItemsToCarousel(data) {
    carouselItemSlide = '';
    // check if there is data returned otherwise add image not found
    if (!data.hits.length) {
        carouselItemSlide += `<div class="carousel-item active">
        <img class="d-block carousel-img" src="https://bitsofco.de/content/images/2018/12/broken-1.png" alt="errorSlinde" onerror="this.onerror=null;this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';">
    </div>`;
        carouselItem.innerHTML = carouselItemSlide;
        // display UI change
        tripWeatherImage.classList.remove('d-none');
        return;
    }
    data.hits.forEach((item, index) => {
        carouselItemSlide += `<div class="carousel-item">
        <img class="d-block carousel-img" src="${item.webformatURL}" alt="${
            index + 1
            // this.onerror if url is broken default image will appear
		} slide" onerror="this.onerror=null;this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';">
    </div>`;
    });

    carouselItem.innerHTML = carouselItemSlide;
    //add active class to first carousel item
    carouselItem.firstElementChild.classList.add('active');
    // display UI change
    tripWeatherImage.classList.remove('d-none');
}

function addItemsToAccordion(weather) {
    // change date input to a full date 
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);
    accordionItem = '';
    //counter for days
    let counter = 0;
    weather.data.forEach((day) => {
        let date = new Date(day.datetime);
        //check if dates are between the days returned from weatherbit api
        if (date >= startDateObj && date <= endDateObj) {
            accordionItem += `<div class="card mb-2">
            <div class="card-header" id="heading${counter}">
                <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${counter}" aria-expanded="false" aria-controls="collapse${counter}">
                Weather for Day ${counter + 1} at ${day.datetime}</button>
                </h2>
            </div>
            <div id="collapse${counter}" class="collapse" aria-labelledby="heading${counter}" data-parent="#collapseOne">
                <div class="card-body">
                <p>${day.weather.description} </p>
                <img src="https://www.weatherbit.io/static/img/icons/${
					day.weather.icon
				}.png">
                <p>Minimum temperature is <strong> ${
					day.min_temp
				}&deg;</strong></p>
                <p>Average temperature is <strong> ${
					day.temp
				}&deg;</strong> </p>
                    <p>Max temperature is <strong>${
						day.max_temp
					}&deg;</strong> </p>
                </div>
            </div>
        </div>`;
            // counter for days
            counter++;
        }
    });
    // if counter didn't change then there is no weather to display  
    // display the weather for today
    if (counter === 0) {
        accordionItem += `
        <div class="alert alert-warning" role="alert">The Weather For the selected Date is not available but</div>
        <div class="card">
        <div class="card-header" id="headingToday">
            <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseToday" aria-expanded="false" aria-controls="collapseToday">
              The Weather for Today at ${weather.data[0].datetime}
              
            </button>
            </h2>
        </div>
        <div id="collapseToday" class="collapse" aria-labelledby="headingToday" data-parent="#collapseOne">
            <div class="card-body">
            <p>${weather.data[0].weather.description} </p>
            <img src="https://www.weatherbit.io/static/img/icons/${weather.data[0].weather.icon}.png">
                <p>Minimum temperature is <strong> ${weather.data[0].min_temp}&deg;</strong></p>
                <p>Average temperature is <strong> ${weather.data[0].temp}&deg;</strong> </p>
                <p>Max temperature is <strong>${weather.data[0].max_temp}&deg;</strong> </p>
            </div>
        </div>
    </div>`;
    }
    //update UI
    accordion.innerHTML = accordionItem;
}

//save trip function 
function saveTrip() {
    //check if there is a created trip alert if there isn't 
    if (!carouselItemSlide || !accordionItem || !tripInfoSave) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>You can't save without creating a trip</strong></div>`;
        return false;
    }
    // save trip to local storage
    localStorage.setItem('carouselItemSlide', carouselItemSlide);
    localStorage.setItem('accordionItem', accordionItem);
    localStorage.setItem('tripInfoSave', tripInfoSave);

    // update UI
    alerts.innerHTML = `<div class="alert alert-success  alert-dismissible fade show " role="alert">
    <strong>Trip saved</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`;

}

// load saved trip
function loadTrip() {
    // check if there is a saved trip alert if there isn't
    if (!localStorage.getItem('tripInfoSave') ||
        !localStorage.getItem('accordionItem') ||
        !localStorage.getItem('carouselItemSlide')
    ) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>There is no saved trip</strong></div>`;
        return false;
    }

    //load saved trip to UI
    tripInfo.innerHTML = localStorage.getItem('tripInfoSave');
    carouselItem.innerHTML = localStorage.getItem('carouselItemSlide');
    accordion.innerHTML = localStorage.getItem('accordionItem');
    carouselItem.firstElementChild.classList.add('active');
    tripInfo.classList.remove('d-none');
    tripWeatherImage.classList.remove('d-none');

}

// remove function removes trip from UI and local storage
function remove(r = false) {
    tripWeatherImage.classList.add('d-none');
    tripInfo.classList.add('d-none');
    if (r) localStorage.clear();
    carouselItem.innerHTML = '';
    accordion.innerHTML = '';
    tripInfo.innerHTML = '';
}


// export functions
export {
    // addCountryToSelect,
    tripDescription,
    checkDate,
    addItemsToCarousel,
    addItemsToAccordion,
    remove,
};