const geoNames = async(city) => {
    // call local geoname route with city name
    const serverRes = await fetch(`/geonames/${city}`);
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
export { geoNames };