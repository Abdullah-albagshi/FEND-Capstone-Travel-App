// Import app functions
import { addCountryToSelect, tripDescription, checkDate, addItemsToCarousel, addItemsToAccordion, remove } from './js/app';
// import bootstrap
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/bootstrap/dist/js/bootstrap.min'
import '../../node_modules/jquery/dist/jquery.min'
import '../../node_modules/popper.js/dist/popper.min'
import '../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css'
import '../../node_modules/bootstrap-select/dist/js/bootstrap-select.min'

//import styles
import './styles/styles.scss';

//call addCountryToSelect function
addCountryToSelect()

//export functions
export { addCountryToSelect, tripDescription, checkDate, addItemsToCarousel, addItemsToAccordion, remove };