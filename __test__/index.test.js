const request = require('supertest')
const { app } = require('../src/server/index')


describe("GET  geonames/ ", () => {
    test("It should respond with success code", async() => {
        const response = await request(app).get("/geonames/brazil");
        expect(response.statusCode).toBe(200);
    });
});



describe("GET test/ ", () => {
    test("It should respond with 404 code", async() => {
        const response = await request(app).get("/test");
        expect(response.statusCode).toBe(404);
    });
});