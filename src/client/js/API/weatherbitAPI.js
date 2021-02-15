const weather = async(city) => {
    const serverRes = await fetch(`/weatherbit/${JSON.stringify(city)}`);

    try {
        const data = await serverRes.json();
        return data;
    } catch (error) {

        console.log(error);
    }

}

export { weather }