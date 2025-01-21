const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    // if user pressed Enter button and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support the geolocation API.");
    }
});

function onSuccess(position) {
    const apikey = process.env.WEATHER_API_KEY; // Vercel will inject this at runtime
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    console.log("Generated API URL:", api); // Debugging
    fetchData();
}

function onError(error) {
    console.error("Geolocation error:", error);
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function requestApi(city){
    const apikey = process.env.WEATHER_API_KEY;
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending","error");
        infoTxt.innerText =`${inputField.value} isn't a valid city name`;
    }else{
        // hetting the required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;


        // using the custom icon according to the id which is returned by api
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/strom.svg";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id<= 531)){
            wIcon.src = "icons/rain.svg";
        }


        // let's pass these values to a particular html element

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}` ;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=> {
    wrapper.classList.remove("active");
});