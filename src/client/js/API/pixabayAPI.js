const pixabay = async(city) => {
    // call local pixabay route with city name
    const serverRes = await fetch(`/pixabay/${city}`);
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
export { pixabay };