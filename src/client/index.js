// Import app functions
import { tripDescription, checkDate, addItemsToCarousel, addItemsToAccordion, remove } from './js/app';
// import bootstrap
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/bootstrap/dist/js/bootstrap.min'
import '../../node_modules/jquery/dist/jquery.min'
import '../../node_modules/popper.js/dist/popper.min'
// import '../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css'
// import '../../node_modules/bootstrap-select/dist/js/bootstrap-select.min'

//import styles
import './styles/styles.scss';

const select = document.querySelector('.selectpicker');



// rest countries Api 
const countries = async() => {
    // call rest countries Api 
    const serverRes = await fetch('https://restcountries.eu/rest/v2/all?fields=name');
    try {
        //server response
        const data = await serverRes.json();
        //return data to client
        return data;
    } catch (error) {
        console.log(error);
    }

}


// add options to select input 
function addCountryToSelect() {
    countries().then((data) => {
        data.forEach((opt) => {
            let option = document.createElement('option');
            option.text = opt.name;
            select.add(option);
        });
    });
}

//call addCountryToSelect function
addCountryToSelect()


//export functions
export { addCountryToSelect, tripDescription, checkDate, addItemsToCarousel, addItemsToAccordion, remove, countries };