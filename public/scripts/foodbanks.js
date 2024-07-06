let map, service, infowindow;

async function initMap() {
	const gmap = window.google.maps;

    // Initialize the map
    map = new gmap.Map(document.getElementById("map"), {
        center: { lat: 35.2271, lng: -80.8431 }, // Default center (Charlotte, NC)
        zoom: 12,
    });
	
	console.log({
		gmap: gmap.places
	})
	
    infowindow = new gmap.InfoWindow();

	console.log({
		infowindow
	})

    service = new gmap.places.PlacesService(map);
    // Listen for form submission
    document.getElementById("form").addEventListener("submit", function(event) {
        //event.preventDefault();
        searchFoodBanks();

    });
}

async function searchFoodBanks() {
    const zipcode = document.getElementById("zip").value.trim();


    if (zipcode.length !== 5 || isNaN(zipcode)) {
        console.error("Invalid ZIP code");
        return;
    }

    try {
        // Geocode the ZIP code to get coordinates
        const geocodeResponse = await geocode(zipcode);
        const userLocation = geocodeResponse.geometry.location;

        // Center map on user's location
        map.setCenter(userLocation);
        map.setZoom(12); // Adjust zoom level as needed

        // Define request for nearby food banks
        const request = {
            location: userLocation,
            radius: 20000, // 20 kilometers (in meters)
            type: 'food_bank'
        };

        // Perform nearby search
        const results = await new Promise((resolve, reject) => {
			console.log({
				service
			})
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(new Error(`Places search was not successful for the following reason: ${status}`));
                }
            });
        });

        // Clear previous markers
        clearMarkers();

        // Create markers for each food bank
        results.forEach(place => {
            createMarker(place);
        });

    } catch (error) {
        console.error("Error searching food banks:", error);
    }
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
    infowindow.close(); // Close any open infowindows
    // Implement clearing of markers here as per your requirements
}

async function geocode(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0]);
            } else {
                reject(new Error(`Geocode was not successful for the following reason: ${status}`));
            }
        });
    });
}