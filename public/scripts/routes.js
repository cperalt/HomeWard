// // Import required modules
// import express from 'express';
// import path from 'path';
// import fetch from 'node-fetch';
// import foodbanks from './foodbanks.js';

// // Initialize Express app
// const app = express();

// // Set up Handlebars as the view engine
// app.set('view engine', 'hbs');


// async function searchBusRoutes(zipcode) {
//     try {
//         // Fetch latitude and longitude from ZIP code API
//         const zipCodeUrl = `https://api.zippopotam.us/us/${zipcode}`;
//         const geoResponse = await fetch(zipCodeUrl);
//         if (!geoResponse.ok) {
//             throw new Error('Failed to fetch location data for the ZIP code');
//         }
//         const geoData = await geoResponse.json();
//         const latitude = geoData.places[0].latitude;
//         const longitude = geoData.places[0].longitude;

//         // Fetch bus routes based on latitude and longitude
//         const apiKey = 'your_transportapi_key'; 
//         const url = `https://transportapi.com/v3/uk/bus/stops/near.json?lat=${latitude}&lon=${longitude}&app_id=your_app_id&app_key=${apiKey}`;
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Failed to fetch bus routes');
//         }
//         const data = await response.json();
//         return data.stops; // Adjust as per TransportAPI response structure
//     } catch (error) {
//         throw new Error(`Error fetching bus routes: ${error.message}`);
//     }
// }

// // GET endpoint to render the index page
// app.get('/', async (req, res) => {
//     res.render('routes', { busRoutes: [] });
// });



// // GET endpoint to search for bus routes based on location
// app.get('/api/search', async (req, res) => {
//     try {
//         const { zipcode } = req.query; // Get zipcode from query parameters

//         // Validate zipcode
//         if (!zipcode) {
//             throw new Error('ZIP code is required');
//         }

//         // Call function to fetch latitude and longitude from ZIP code
//         const { latitude, longitude } = await getCoordinatesFromZip(zipcode);

//         // Call function to fetch bus routes based on latitude and longitude
//         const busRoutes = await searchBusRoutes(latitude, longitude);

//         // Check if busRoutes is empty
//         if (busRoutes.length === 0) {
//             console.log(`No bus routes found near ${latitude}, ${longitude}`);
//             res.render('index', { busRoutes: [] });
//         } else {
//             res.render('index', { busRoutes }); // Pass bus routes to the template
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Function to fetch latitude and longitude from ZIP code
// async function getCoordinatesFromZip(zipcode) {
//     try {
//         const zipCodeUrl = `https://api.zippopotam.us/us/${zipcode}`;
//         const geoResponse = await fetch(zipCodeUrl);
//         if (!geoResponse.ok) {
//             throw new Error('Failed to fetch location data for the ZIP code');
//         }
//         const geoData = await geoResponse.json();
//         const latitude = geoData.places[0].latitude;
//         const longitude = geoData.places[0].longitude;
//         return { latitude, longitude };
//     } catch (error) {
//         throw new Error(`Error fetching location data: ${error.message}`);
//     }
// }

// // Start server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import fetch from 'node-fetch';
const app = express();
app.set('view engine', 'hbs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '../..')
app.use(express.static(root))
app.use(express.json());
const PORT = process.env.PORT || 8080;
const apiKey = 'AIzaSyBgAhCPbNjviOE0NapTIt_5lQxRG3GkSRI';

//middleware to parese the json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/searchFoodBanks', async (req, res) => {
    const { zipcode } = req.query;

    try {
        // Fetch geocode data for the provided ZIP code
        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`);
        if (!geocodeResponse.ok) {
            throw new Error('Failed to fetch geocode data');
        }
        const geocodeData = await geocodeResponse.json();

        // Extract location coordinates
        const location = geocodeData.results[0].geometry.location;

        // Fetch nearby food banks using Places API
        const placesResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=food_bank&key=${apiKey}`);
        if (!placesResponse.ok) {
            throw new Error('Failed to fetch nearby food banks');
        }
        const placesData = await placesResponse.json();

        // Render the 'nearby' page with data
        res.render('nearby', {
            apiKey: 'AIzaSyBgAhCPbNjviOE0NapTIt_5lQxRG3GkSRI',
            places: placesData.results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});





app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});