import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    const sendLocation = async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });

      try {
        // Send the location to the server immediately
        await axios.post('http://localhost:5000/update-location', {
          number: 'FRIEND_BUS', // Use your specific bus number
          location: { lat: latitude, lng: longitude },
        });
      } catch (error) {
        console.error("Error sending location:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(sendLocation, console.error, {
        enableHighAccuracy: true, // Use high accuracy for better real-time updates
        maximumAge: 0,           // Do not use a cached position
        timeout: 5000,           // Maximum wait time to get a location update
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      <h1>Real-Time Location Tracking</h1>
      {location.lat && location.lng ? (
        <p>Latitude: {location.lat}, Longitude: {location.lng}</p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default App;
