let map, directionsService, directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2271, lng: -80.8431 }, //
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    const request = {
        origin: "Times Square, New York, NY",
        destination: "Central Park, New York, NY",
        travelMode: google.maps.TravelMode.TRANSIT, 
    };

    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            console.error("Directions request failed due to " + status);
        }
    });
}


