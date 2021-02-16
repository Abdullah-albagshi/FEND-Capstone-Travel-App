import { countries } from './API/restAPI';
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
let isTrip = false;

function addCountryToSelect() {
    countries().then((data) => {
        data.forEach((opt) => {
            let option = document.createElement('option');
            option.text = opt.name;
            select.add(option);
        });
    });
}

createBtn.addEventListener('click', async() => {
    remove();

    if (checkDate() == false) {
        return;
    } else {
        checkDate();
    }
    loader.classList.add('loader');
    let inputCity = select.value.split(' ').join('+');
    let geoData = await geoNames(inputCity);
    if (!geoData) {
        alerts.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>city not found!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
        loader.classList.remove('loader');
        return;
    }
    lat = geoData.lat;
    lon = geoData.lng;
    cityName = geoData.name.split(' ').join('+');
    let weatherData = await weather({ lat, lon });
    let pixabayData = await pixabay(cityName);
    await tripDescription(geoData);
    await addItemsToAccordion(weatherData);
    await addItemsToCarousel(pixabayData);
    loader.classList.remove('loader');
    isTrip = true;
});

function tripDescription(geoData) {
    let daysTillTrip = parseInt(
        (startDate.valueAsDate - today) / (1000 * 60 * 60 * 24) + 1
    );
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

    tripInfo.innerHTML = tripInfoSave;
    tripInfo.classList.remove('d-none');
}

function checkDate() {
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);

    if (!startDate.value || !endDate.value || !select.value) {
        alerts.innerHTML = `<div class="alert alert-warning  alert-dismissible fade show" role="alert">
        <strong>All Fields must be field!</strong></div>`;
        return false;
    } else {
        alerts.innerHTML = '';
    }
    //86400000 is a day in milliseconds
    if (startDateObj - today < -86400000) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>The start date can't be less today date!</strong></div>`;
        return false;
    }
    if (endDateObj - startDateObj < 0) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show" role="alert">
        <strong>end date can't be less than start date!</strong></div>`;
        return false;
    }
}

function addItemsToCarousel(data) {
    carouselItemSlide = '';
    if (!data.hits.length) {
        carouselItemSlide += `<div class="carousel-item active">
        <img class="d-block carousel-img" src="https://bitsofco.de/content/images/2018/12/broken-1.png" alt="errorSlinde" onerror="this.onerror=null;this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';">
    </div>`;
        carouselItem.innerHTML = carouselItemSlide;
        tripWeatherImage.classList.remove('d-none');
        return;
    }
    data.hits.forEach((item, index) => {
        carouselItemSlide += `<div class="carousel-item">
        <img class="d-block carousel-img" src="${item.webformatURL}" alt="${
			index + 1
		} slide" onerror="this.onerror=null;this.src='https://bitsofco.de/content/images/2018/12/broken-1.png';">
    </div>`;
    });
    carouselItem.innerHTML = carouselItemSlide;
    carouselItem.firstElementChild.classList.add('active');
    tripWeatherImage.classList.remove('d-none');
}

function addItemsToAccordion(weather) {
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);
    accordionItem = '';
    let counter = 0;
    weather.data.forEach((day) => {
        let date = new Date(day.datetime);

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
            counter++;
        }
    });
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
    accordion.innerHTML = accordionItem;
}

saveBtn.addEventListener('click', () => {
    if (!carouselItemSlide || !accordionItem || !tripInfoSave) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>You can't save without creating a trip</strong></div>`;
        return false;
    }
    localStorage.setItem('carouselItemSlide', carouselItemSlide);
    localStorage.setItem('accordionItem', accordionItem);
    localStorage.setItem('tripInfoSave', tripInfoSave);
});

loadBtn.addEventListener('click', () => {
    if (!localStorage.getItem('tripInfoSave') ||
        !localStorage.getItem('accordionItem') ||
        !localStorage.getItem('carouselItemSlide')
    ) {
        alerts.innerHTML = `<div class="alert alert-danger  alert-dismissible fade show " role="alert">
        <strong>There is no saved trip</strong></div>`;
        return false;
    }
    tripInfo.innerHTML = localStorage.getItem('tripInfoSave');
    carouselItem.innerHTML = localStorage.getItem('carouselItemSlide');
    accordion.innerHTML = localStorage.getItem('accordionItem');
    carouselItem.firstElementChild.classList.add('active');
    tripInfo.classList.remove('d-none');
    tripWeatherImage.classList.remove('d-none');
});

removeBtn.addEventListener('click', () => remove(true));

function remove(r = false) {
    tripWeatherImage.classList.add('d-none');
    tripInfo.classList.add('d-none');
    if (r) localStorage.clear();
    carouselItem.innerHTML = '';
    accordion.innerHTML = '';
    tripInfo.innerHTML = '';
}

export {
    addCountryToSelect,
    tripDescription,
    checkDate,
    addItemsToCarousel,
    addItemsToAccordion,
    remove,
};