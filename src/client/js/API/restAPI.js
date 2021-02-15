const countries = async() => {
    const serverRes = await fetch('https://restcountries.eu/rest/v2/all?fields=name');
    try {
        const data = await serverRes.json();
        return data;
    } catch (error) {
        console.log(error);
    }

}

export { countries }