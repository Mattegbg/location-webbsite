const API_TOKEN = 'pk.eyJ1Ijoiam9oYW5raXZpIiwiYSI6ImNrcnl6M25xMDA4aWUyd3BqY3EzYnA1NTEifQ.ve5rEn8ZDwUGKvphMkEdpw';

const RESEROBOT_API = '9718858e-fcb9-4e56-b992-6aed94b5a80e';

const buttonElem = document.querySelector('#position-button');
let stopsList = document.getElementById('stops');
var clickedStop = ''
var departuresList = document.getElementById('departures');


function showOnMap(position) {
    mapboxgl.accessToken = API_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 13
    });

    new mapboxgl.Marker().
    setLngLat([position.coords.longitude, position.coords.latitude]).
    addTo(map);
}


buttonElem.addEventListener('click', () => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        showOnMap(position);
        getStops(position); //måste skicka in getStops(position) här för att den skall connecta med det nedan.
       });
    }
});


//Planeraren hitta hållplatser nedan

async function getStops(position) {
  let link = `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${position.coords.latitude}&originCoordLong=${position.coords.longitude}&format=json&accessId=${RESEROBOT_API}`;
  const response = await fetch(link);//kopierar länken ovan.
  const data = await response.json();

  console.log(data);
  let stops = data.stopLocationOrCoordLocation
  stopsList.innerHTML = ''
  stops.forEach(stop => {
      let li = document.createElement('li');
      li.innerHTML = stop.StopLocation.name 
      li.addEventListener('click', () => {//sparar klickade hållplatser
        clickedStop = {name:stop.StopLocation.name, id:stop.StopLocation.extId}//sparar klickade hållplatser
        console.log(clickedStop)//sparar klickade hållplatser
        getTimeTable();
      } )
      stopsList.append(li)
      
  });
 
};

async function getTimeTable() {
    let link = ` https://api.resrobot.se/v2.1/departureBoard?id=${clickedStop.id}&format=json&accessId=${RESEROBOT_API} `
    const response = await fetch(link);
    const data = await response.json();
    console.log(data)
    let departures = data.Departure
    departuresList.innerHTML = '' // tar bort avgångarna från förra sökningen
    departures.forEach((departure, index) => { 
       if(index <= 10) { // detta gör att man max får 10 rader med avgångar
        let li = document.createElement('li');
        li.innerHTML = `${departure.name} ${departure.time} `
        departuresList.append(li);
       }
    })
    
}

window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('../service-worker.js');
        } catch(err) {
            console.error('Whooopsie!', err)
        }
    }
});