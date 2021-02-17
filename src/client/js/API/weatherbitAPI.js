const weather = async(city) => {
    // call local weatherbit route with city name
    const serverRes = await fetch(`/weatherbit/${JSON.stringify(city)}`);
    try {
        //server response
        const data = await serverRes.json();
        //return data to client
        return data;
    } catch (error) {
        console.log(error);
    }
};
//export function
export { weather };