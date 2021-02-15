import { countries } from './API/restAPI';
import { geoNames } from './API/geonamesAPI';
import { weather } from './API/weatherbitAPI';
import { pixabay } from './API/pixabayAPI';

addCountryToSelect();

const moment = require('moment')
const btn = document.querySelector('.submit');
const select = document.querySelector('.selectpicker');
const carouselItem = document.querySelector('.carousel-inner');
const accordion = document.querySelector('#collapseOne .card-body');

const startDate = document.querySelector('#start-date');
const endDate = document.querySelector('#end-date');
const today = new Date();
let cityName, lat, lon;

function addCountryToSelect() {
    countries().then((data) => {
        data.forEach((opt) => {
            let option = document.createElement('option');
            option.text = opt.name;
            select.add(option);
        });
    });
}

btn.addEventListener('click', async() => {
    if (checkDate() == false) {
        return
    } else {
        checkDate()
    }
    console.log('test');
    let inputCity = select.value.split(' ').join('+');
    let geoData = await geoNames(inputCity);
    if (!geoData) {
        console.log('fail'); //TODO: handel city not found
        return;
    }
    lat = geoData.lat;
    lon = geoData.lng;
    cityName = geoData.name.split(' ').join('+');
    let weatherData = await weather({ lat, lon });
    let pixabayData = await pixabay(cityName);
    await addItemsToAccordion(weatherData);
    await addItemsToCarousel(pixabayData);
    console.log(weatherData);
    console.log(pixabayData);
});

function checkDate() {
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);

    if (!startDate.value || !endDate.value || !select.value) {
        //TODO : alert for empty dates
        console.log('test in in ');
        return false;
    } else {
        //TODO : alert for empty dates

    }
    //86400000
    if (startDateObj - today < -86400000) {
        console.log(startDateObj - today);
        //TODO : alert for start day must be larger than today
        return false
    }

    if (endDateObj - startDateObj < 0) {
        //TODO : alert end date can't be less than start date 
        console.log(endDateObj - startDateObj);
        return false;
    }
}

function addItemsToCarousel(data) {
    /*      <div class="carousel-item active">
                <img class="d-block w-100" src="..." alt="First slide">
            </div>
 */
    let items = '';
    data.hits.forEach((item, index) => {
        items += `<div class="carousel-item">
        <img class="d-block carousel-img" src="${item.webformatURL}" alt="${
			index + 1
		} slide" onerror="this.onerror=null;this.src='../assets/img/imagefound.png';">
    </div>`;
    });
    carouselItem.innerHTML = items;
    carouselItem.firstElementChild.classList.add('active');
}

function addItemsToAccordion(weather) {
    let startDateObj = new Date(startDate.valueAsDate);
    let endDateObj = new Date(endDate.valueAsDate);
    let items = ''
    let counter = 0
    weather.data.forEach((day, index) => {
        let date = new Date(day.datetime)

        if (date >= startDateObj && date <= endDateObj) {
            items += `<div class="card">
            <div class="card-header" id="heading${counter}">
                <h2 class="mb-0">
                    <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${counter}" aria-expanded="false" aria-controls="collapse${counter}">
                  Weather for Day ${counter+1} at ${day.datetime}
                </button>
                </h2>
            </div>
            <div id="collapse${counter}" class="collapse" aria-labelledby="heading${counter}" data-parent="#collapseOne">
                <div class="card-body">
                    <p>Minimum temperature is ${day.min_temp}</p>
                    <p>Max temperature is ${day.max_temp}</p>
                    <p>Average temperature is ${day.temp}</p>
                    <p>The Weather is mostly ${day.weather.description} 
                    <img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png">
                    </p>
                    
                    
                </div>
            </div>
        </div>`
            counter++;
        }

    })
    if (counter === 0) {
        items += `
        <h3>The Weather For the selected Date is not available but</h3>
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
                <p>Minimum temperature is ${weather.data[0].min_temp}</p>
                <p>Max temperature is ${weather.data[0].max_temp}</p>
                <p>Average temperature is ${weather.data[0].temp}</p>
                <p>The Weather is mostly ${weather.data[0].weather.description} 
                <img src="https://www.weatherbit.io/static/img/icons/${weather.data[0].weather.icon}.png">
                </p>
            </div>
        </div>
    </div>`
    }
    accordion.innerHTML = items

    /*          <div class="accordion" id="accordionDate">
                    <div class="card">
                        <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
										Collapsible Group Item #1
									</button>
                            </h2>
                        </div>

                        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionDate">
                            <div class="card-body">
                                <div class="card">
                                    <div class="card-header" id="headingTwo">
                                        <h2 class="mb-0">
                                            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                          Collapsible Group Item #2
                                        </button>
                                        </h2>
                                    </div>
                                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#collapseOne">
                                        <div class="card-body">
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                                            on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
                                            occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */
}