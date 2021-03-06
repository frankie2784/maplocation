mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmtpZTI3ODQiLCJhIjoiY2tnbGdtZzd0MmY2djJ5bDdma3p3eWcxciJ9.nrsHiMn_MItCEKEc9di5cQ';

// Set bounds to Victoria
var bounds = [
[138.455243,-40.074262], // Southwest coordinates
[153.550458,-33.784141], // Northeast coordinates
];

var url = "https://api.mapbox.com/directions/v5/mapbox/walking/-73.98857946220154%2C40.72301649876755%3B-73.99401387504604%2C40.73537112507279?alternatives=true&geometries=geojson&steps=true&access_token=YOUR_MAPBOX_ACCESS_TOKEN";

var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/frankie2784/ckgy5tzua19hn19uxks1pfji0',
center: [144.96768788280298,-37.81762805497954], // starting position
zoom: 14, // starting zoom
maxBounds: bounds
});

map.on('load', function () {
// We use D3 to fetch the JSON here so that we can parse and use it separately
// from GL JS's use in the added source. You can use any request method (library
// or otherwise) that you want.
d3.json(
'melbwalks.geojson',
function (err, data) {
if (err) throw err;

// save full coordinate list for later
var coordinates = data.features[0].geometry.coordinates;

// start by showing just the first coordinate
data.features[0].geometry.coordinates = [coordinates[0]];

// add it to the map
map.addSource('trace', { type: 'geojson', data: data });
map.addLayer({
'id': 'trace',
'type': 'line',
'source': 'trace',
'paint': {
'line-color': 'black',
'line-opacity': 0.75,
'line-width': 5
}
});

// setup the viewport
map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
map.setPitch(30);

// on a regular basis, add more coordinates from the saved list and update the map
var i = 0;
var timer = window.setInterval(function () {
if (i < coordinates.length) {
data.features[0].geometry.coordinates.push(
coordinates[i]
);
map.getSource('trace').setData(data);
map.panTo(coordinates[i]);
i++;
} else {
window.clearInterval(timer);
}
}, 30);
}
);
});

var geojson = {
'type': 'FeatureCollection',
'features': [
{
'type': 'Feature',
'properties': { 'title': 'Make it Mount Pleasant',

'description': 'Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.',
'iconSize': [60, 60]
},
'geometry': {
'type': 'Point',
'coordinates': [144.96768788280298,-37.81762805497954]
}
},
{
'type': 'Feature',
'properties': { 'title': 'Mad Men Season Five Finale Watch Party',
'description': 'Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.',
'iconSize': [50, 50]
},
'geometry': {
'type': 'Point',
'coordinates': [144.98341256736163,-37.82928187179573]
}
},
{
'type': 'Feature',
'properties': { 'title': 'Big Backyard Beach Bash and Wine Fest',
'description': 'EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.',
'iconSize': [40, 40]
},
'geometry': {
'type': 'Point',
'coordinates': [144.9788327395279,-37.82705998898825]
}
}
]
};

// add markers to map
geojson.features.forEach(function (marker) {
// create a DOM element for the marker
var el = document.createElement('div');
el.className = 'marker';
el.style.backgroundImage =
'url(https://placekitten.com/g/' +
marker.properties.iconSize.join('/') +
'/)';
el.style.width = marker.properties.iconSize[0] + 'px';
el.style.height = marker.properties.iconSize[1] + 'px';

// el.addEventListener('click', function () {
// 	  const target = event.originalEvent.target;
// 	  const markerWasClicked = markerDiv.contains(target);
//
// 	  new_marker.togglePopup();
// 	});


// add marker to map
const new_marker = new mapboxgl.Marker(el)
.setLngLat(marker.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
	.setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
.addTo(map);


const markerDiv = new_marker.getElement();

markerDiv.addEventListener('mouseenter', () => new_marker.togglePopup());
markerDiv.addEventListener('mouseleave', () => new_marker.togglePopup());


// map.on('click', event => {
//   const target = event.originalEvent.target;
//   const markerWasClicked = markerDiv.contains(target);
//
//   new_marker.togglePopup();
// });
});


// Add geolocate control to the map.
var geolocate = new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
trackUserLocation: true
});

map.addControl(geolocate);


geolocate.on('geolocate', function(e) {
      var lon = e.coords.longitude;
      var lat = e.coords.latitude
			fetch(`https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat}%2C${lon}&key=3J3ARWE5`)
				.then((resp) => resp.json())
				.then(function(data) {
				document.getElementById('info').innerHTML = data.words+'&#10;&#13;('+lon+', '+lat+')';
			});
});

// map.on('mousemove', function (e) {
// document.getElementById('info').innerHTML = JSON.stringify(position);
// // e.point is the x, y coordinates of the mousemove event relative
// // to the top-left corner of the map
// });
// map.addControl(
// new MapboxDirections({
// accessToken: mapboxgl.accessToken
// }),
// 'top-left'
// );