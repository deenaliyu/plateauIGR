function getLocationAndSubmit() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success - got GPS coordinates
        submitLocation(position.coords.latitude, position.coords.longitude, 'gps');
      },
      function (error) {
        // GPS permission denied or error - fallback to IP-based location
        console.log("Geolocation error:", error);
        getLocationFromIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Browser doesn't support Geolocation
    getLocationFromIP();
  }
}

function getRandomPlateauLocation() {
  // Plateau State, Nigeria bounding box
  // Approximate: lat 8.3 to 10.2, lon 8.2 to 10.6
  const minLat = 8.3, maxLat = 10.2;
  const minLon = 8.2, maxLon = 10.6;
  const lat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6);
  const lon = (Math.random() * (maxLon - minLon) + minLon).toFixed(6);
  return { lat, lon };
}

function getLocationFromIP() {
  // Using ip-api.com's free service (no API key needed)
  fetch('http://ip-api.com/json/?fields=lat,lon')
    .then(response => response.json())
    .then(data => {
      if (data.lat && data.lon) {
        submitLocation(data.lat, data.lon, 'ip');
      } else {
        console.error("Could not get location from IP");
        const plateauLocation = getRandomPlateauLocation();
        submitLocation(plateauLocation.lat, plateauLocation.lon, 'failed');
      }
    })
    .catch(error => {
      console.error("IP location error:", error);
      const plateauLocation = getRandomPlateauLocation();
      submitLocation(plateauLocation.lat, plateauLocation.lon, 'failed');
    });
}

function submitLocation(lat, lon, source) {
  // console.log(`Submitting location: ${lat}, ${lon} from ${source}`);
  // Set the form values
  document.getElementById('latitudeInput').value = lat;
  document.getElementById('longitudeInput').value = lon;

}

$(document).ready(function () {
  getLocationAndSubmit();
});