let map, infowindow, service;

function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: 35.2271,
			lng: -80.8431,
			mapId: '123014699cdb1245' 

		},
		zoom: 10,
	});
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
}

function searchFoodBanks() {
	const zipcode = document.getElementById("zipcode").value;
	const geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		address: zipcode
	}, (results, status) => {
		if (status === google.maps.GeocoderStatus.OK) {
			const userLocation = results[0].geometry.location;
			map.setCenter(userLocation);
			map.setZoom(5);
			const request = {
				location: userLocation,
				radius: '10',
				type: ['food_bank'],
			};
			service.nearbySearch(request, (results, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					for (let i = 0; i < results.length; i++) {
						createMarker(results[i]);
						console.log(results[i].name, results[i].vicinity);4
					}
				} else {
					console.error("Places search was not successful for the following reason: " + status);
				}
			});
		} else {
			console.error("Geocode was not successful for the following reason: " + status);
			const defaultLocation = new google.maps.LatLng(35.2271, -80.8431);
			map.setCenter(defaultLocation);
			map.setZoom();
		}
	});
}

function createMarker(place) {
	if (!place.geometry || !place.geometry.location) return;
	const marker = new google.maps.Marker({
		map,
		position: place.geometry.location,
	});
	google.maps.event.addListener(marker, "click", () => {
		infowindow.setContent(place.name || "");
		infowindow.open(map, marker);
	});
}


export default  {
	initMap,
	searchFoodBanks,
	createMarker
}