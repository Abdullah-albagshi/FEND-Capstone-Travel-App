const geoNames = async(city) => {
    const serverRes = await fetch(`/geonames/${city}`);
    try {
        const data = await serverRes.json();
        return data;
    } catch (error) {

        console.log(error);
    }

}

export { geoNames }