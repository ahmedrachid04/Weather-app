//ahmeds notes
////////the initial values are just place holders in the html
////////this project includes the dark mode functionality and an autocomplete api
////////the api is paid, the free plan only allows for limited number of requests per minute and a limit of suggestion fixed at 10 
////////that is why you will not get suggestions after typing 3 letters in the search bar and the console will return an error in the console
////////tip: write the whole name somewhere else and copy and paste it in the search bar to avoid the error


// const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Mdiq", "Rabat", "Oujda", "Morocco", "Lebanon"];
const weatherApiKey = "9bcf25d616182bc78be09f840bc44ef4";
const weatherApiURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const apiHost = "wft-geo-db.p.rapidapi.com";
const apiKey = "74244002c4msh26ab362c85b1747p19de61jsn2c22ac0d4b6d";
const searchbar = document.querySelector('.inpt');
const searchbtn = document.querySelector('.btn');
const suggestionsContainer = document.getElementById('suggestions');

async function fetchCitySuggestions(query) {
    const response = await fetch(`https://${apiHost}/v1/geo/cities?namePrefix=${query}&limit=10`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": apiHost,
        },
    });
    const data = await response.json();
    console.log(data);
    return data.data.map(city => city.name);
}

searchbar.addEventListener("input", async () => {
    const query = searchbar.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    if (query) {
        const cities = await fetchCitySuggestions(query);
        cities.forEach(city => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = city;
            suggestionItem.addEventListener("click", () => {
                searchbar.value = city;
                suggestionsContainer.innerHTML = '';
                checkweather(city);
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    }
});

async function checkweather(City) {
    const response = await fetch(weatherApiURL + City + `&appid=${weatherApiKey}`);
    const data = await response.json();
    console.log(data);

    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.tmp').innerHTML = data.main.temp + "°C";
    document.querySelector('.tmax').innerHTML = data.main.temp_max + "°C";
    document.querySelector('.tmin').innerHTML = data.main.temp_min + "°C";
    document.querySelector('.hum').innerHTML = data.main.humidity + "%";
    document.querySelector('.wind').innerHTML = data.wind.speed + "Km/h";

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleString();
    document.querySelector('.sunrisetime').innerHTML = sunriseTime;
    
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleString();
    document.querySelector('.sunsettime').innerHTML = sunsetTime;

    const clouds = data.clouds.all;
    if (clouds <= 25) {
        document.querySelector('.symbol').innerHTML = `<i class="fa-solid fa-sun fa-2xl" style="color: #000000;"></i>`;
    } else if (clouds > 25 && clouds <= 85) {
        document.querySelector('.symbol').innerHTML = `<img src="cloudysun.png" class="cloudysun">`;
    } else {
        document.querySelector('.symbol').innerHTML = `<i class="fa-solid fa-cloud-rain fa-2xl" style="color: #000;"></i>`;
    }
}

searchbtn.addEventListener("click", () => {
    checkweather(searchbar.value);
});

document.querySelector(".toggle").addEventListener("click",()=>{
    document.querySelector(".card").classList.toggle("dark");
})
