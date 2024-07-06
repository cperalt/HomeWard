let map, infowindow, service;

async function initMap() {
    map = await new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2271, lng: -80.8431 },
        zoom: 10,
        mapId: '123014699cdb1245 ' // Replace with your mapId if needed
    });
    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // Listen for changes in the ZIP code input field
    document.getElementById("zip").addEventListener("input", function() {
        searchFoodBanks();
    });
}

function searchFoodBanks() {
    const zipcode = document.getElementById("zip").value.trim(); // Trim whitespace
    if (zipcode.length !== 5 || isNaN(zipcode)) {
        console.error("Invalid ZIP code");
        return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({
        address: zipcode
    }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const userLocation = results[0].geometry.location;
            map.setCenter(userLocation);
            map.setZoom(10); // You can adjust the zoom level here
            const request = {
                location: userLocation,
                radius: 20000, // 20 kilometers (in meters)
                type: ['food_bank']
            };
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Clear previous markers
                    clearMarkers();
                    // Create markers for each food bank
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                        console.log(results[i].name, results[i].vicinity);
                    }
                } else {
                    console.error("Places search was not successful for the following reason: " + status);
                }
            });
        } else {
            console.error("Geocode was not successful for the following reason: " + status);
            const defaultLocation = new google.maps.LatLng(35.2271, -80.8431);
            map.setCenter(defaultLocation);
            map.setZoom(10); // Set default zoom level
        }
		console.log("hooray");
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;
    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });
}

function clearMarkers() {
    infowindow.close();
    map.data.forEach(function (feature) {
        map.data.remove(feature);
    });
}

window.onload = initMap;
