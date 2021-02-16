import { checkDate, addItemsToAccordion } from '../src/client/js/app'


describe('Testing the Check date function', () => {
    test('Testing the checkDate() function', () => {
        expect(checkDate).toBeDefined();
    });
});

describe('Testing the addItemsToAccordion function', () => {
    test('Testing the addItemsToAccordion() function', () => {
        expect(addItemsToAccordion).toBeDefined();
    });
});