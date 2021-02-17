const countries = async() => {
        // call rest countries Api 
        const serverRes = await fetch('https://restcountries.eu/rest/v2/all?fields=name');
        try {
            //server response
            const data = await serverRes.json();
            //return data to client
            return data;
        } catch (error) {
            console.log(error);
        }

    }
    //export function
export { countries }