const API_TOKEN = 'pk.eyJ1Ijoiam9oYW5raXZpIiwiYSI6ImNrcnl6M25xMDA4aWUyd3BqY3EzYnA1NTEifQ.ve5rEn8ZDwUGKvphMkEdpw';

const buttonElem = document.querySelector('#position-button');


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
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      showOnMap(position);

    });
  }
});