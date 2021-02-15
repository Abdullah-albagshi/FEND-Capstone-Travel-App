const pixabay = async(city) => {
    const serverRes = await fetch(`/pixabay/${city}`);
    try {
        const data = await serverRes.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export { pixabay };