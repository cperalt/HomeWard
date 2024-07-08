document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const zipcode = document.getElementById('zip').value;
    const distance = document.getElementById('radius').value;
    console.log(zipcode, distance);
    if (!zipcode) console.error('Invalid zipcode!', error);
    fetch(`http://localhost:8080/resources/counselor?zipcode=${zipcode}&distance=${distance}`, { method: 'GET', redirect: 'follow' })
        .then(res => {
            location.href = res.url;
        })
});

// Global variables for map, service, infowindow, and markers array
let map, service, infowindow;
let markers = [];

// Initialize the map
function initMap() {
    const gmap = google.maps;

    // Initialize the map
    map = new gmap.Map(document.getElementById("map"), {
        center: { lat: 35.2271, lng: -80.8431 },
        zoom: 12,
    });

    // Initialize PlacesService and InfoWindow
    infowindow = new gmap.InfoWindow();
    service = new gmap.places.PlacesService(map);

    // Attach event listener to form for submission
    document.getElementById("form").addEventListener("submit", function (event) {
        event.preventDefault();

        // Call searchFoodBanks function to handle form submission
        searchFoodBanks();
    });
}

// Function to handle form submission and search for food banks
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
        map.setZoom(9); // Adjust zoom level as needed

        // Define request for nearby food banks
        const request = {
            location: userLocation,
            radius: 20000, // 20 kilometers (in meters)
            type: 'food_bank'
        };

        // Perform nearby search
        const results = await new Promise((resolve, reject) => {
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

        // Fit map bounds to markers
        fitMapToBounds();

    } catch (error) {
        console.error("Error searching food banks:", error);
    }
}

// Function to create marker on map
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map, marker);
    });

    markers.push(marker); // Push marker to markers array
}

// Function to clear markers on map
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null); // Remove marker from map
    });
    markers = []; // Clear markers array
    infowindow.close(); // Close any open infowindows
}

// Function to fit map bounds to markers
function fitMapToBounds() {
    if (markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
}

// Function to geocode address (in this case, ZIP code)
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