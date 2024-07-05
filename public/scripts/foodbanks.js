let map, infowindow, service;

function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: {
			lat: -33.867,
			lng: 151.195,
      mapId: '123014699cdb1245'
		},
		zoom: 15,
	});
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
}

function searchPlace() {
	const search = document.getElementById("search").value;
	const geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		address: search
	}, (results, status) => {
		if (status === google.maps.GeocoderStatus.OK) {
			const userLocation = results[0].geometry.location;
			map.setCenter(userLocation);
			map.setZoom(15);
			const request = {
				query: "Museum of Contemporary Art Australia",
				fields: ["name", "geometry"],
				locationBias: userLocation,
			};
			service.findPlaceFromQuery(request, (results, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK && results) {
					for (let i = 0; i < results.length; i++) {
						createMarker(results[i]);
					}
					map.setCenter(results[0].geometry.location);
				}
			});
		} else {
			console.error("Geocode was not successful for the following reason: " + status);
			const defaultLocation = new google.maps.LatLng(-33.867, 151.195);
			map.setCenter(defaultLocation);
			map.setZoom(15);
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
