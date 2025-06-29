// Plateau State coordinates (approximate bounding box)
const plateauBounds = [
  [8.5, 8.5],  // Southwest coordinates
  [10.5, 10.5]  // Northeast coordinates
];

// Initialize the map centered on Plateau State
const map = L.map('map').setView([9.25, 9.5], 8); // Centered on Plateau State

// Add base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to hold map layers
let heatLayer = null;
let markerCluster = null;
let pinLayer = null;
let lgaBoundaries = {};

// Facility type colors
const facilityColors = {
  'General Hospital': '#FF5733',
  'Specialist Clinic': '#33FF57',
  'Primary Healthcare Centre': '#3357FF',
  'Retail Pharmacy': '#F333FF',
  'Medical Diagnostic Laboratory': '#33FFF3',
  'Dental Clinic': '#FF33A8',
  'Maternity Home': '#A833FF'
};

// Sample JSON data structure that backend should return
const sampleBackendData = {
  "status": "success",
  "data": [
    {
      "id": "ENT001",
      "latitude": 9.2842,
      "longitude": 9.5246,
      "facilityType": "General Hospital",
      "lga": "Jos North",
      "ward": "Naraguta",
      "enumeratorId": "EN001",
      "entityType": "business",
      "timestamp": "2023-05-15T09:30:00Z",
      "count": 3
    },
    {
      "id": "ENT002",
      "latitude": 9.3158,
      "longitude": 9.4819,
      "facilityType": "Primary Healthcare Centre",
      "lga": "Jos South",
      "ward": "Bukuru",
      "enumeratorId": "EN002",
      "entityType": "business",
      "timestamp": "2023-05-16T10:15:00Z",
      "count": 1
    },
    {
      "id": "ENT003",
      "latitude": 9.8965,
      "longitude": 9.1402,
      "facilityType": "Retail Pharmacy",
      "lga": "Pankshin",
      "ward": "Pankshin Central",
      "enumeratorId": "EN003",
      "entityType": "business",
      "timestamp": "2023-05-17T11:45:00Z",
      "count": 2
    },
    // More data points would follow in a real implementation
    // Approximately 100-200 data points for demonstration
  ],
  "lgaSummary": {
    "Barkin Ladi": 15,
    "Bassa": 12,
    "Bokkos": 18,
    "Jos East": 22,
    "Jos North": 45,
    "Jos South": 38,
    "Kanam": 10,
    "Kanke": 8,
    "Langtang North": 14,
    "Langtang South": 11,
    "Mangu": 20,
    "Mikang": 5,
    "Pankshin": 16,
    "Qua'an Pan": 9,
    "Riyom": 13,
    "Shendam": 17,
    "Wase": 7
  }
};

// Process the sample data to match our frontend structure
function processBackendData(backendData) {
  return backendData.data.map(item => {
    return {
      lat: item.latitude,
      lng: item.longitude,
      facilityType: item.facilityType,
      lga: item.lga,
      ward: item.ward,
      enumerator: item.enumeratorId,
      entityType: item.entityType,
      date: new Date(item.timestamp),
      count: item.count || 1
    };
  });
}

// Generate some additional random data within Plateau State bounds
function generatePlateauData(count) {
  const data = [];
  const facilityTypes = Object.keys(facilityColors);
  const lgas = Object.keys(sampleBackendData.lgaSummary);
  const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"];
  const enumerators = ["EN001", "EN002", "EN003"];
  const entityTypes = ["individual", "business"];

  // Plateau State bounding box
  const minLat = 8.5;
  const maxLat = 10.5;
  const minLng = 8.5;
  const maxLng = 10.5;

  for (let i = 0; i < count; i++) {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
    const lga = lgas[Math.floor(Math.random() * lgas.length)];
    const ward = wards[Math.floor(Math.random() * wards.length)];
    const enumerator = enumerators[Math.floor(Math.random() * enumerators.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

    data.push({
      lat: lat,
      lng: lng,
      facilityType: facilityType,
      lga: lga,
      ward: ward,
      enumerator: enumerator,
      entityType: entityType,
      date: date,
      count: Math.floor(Math.random() * 5) + 1
    });
  }

  return data;
}

// Combine sample backend data with generated data for demonstration
let allData = [...processBackendData(sampleBackendData), ...generatePlateauData(200)];
let filteredData = [...allData];

// Function to apply filters
function applyFilters() {
  showLoading();

  // Get filter values
  const timeRange = document.getElementById('timeRange').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const enumerator = document.getElementById('enumeratorFilter').value;
  const entityType = document.getElementById('entityTypeFilter').value;
  const lga = document.getElementById('lgaFilter').value;
  const visualizationType = document.getElementById('visualizationType').value;

  // Apply filters
  filteredData = allData.filter(item => {
    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const itemDate = new Date(item.date);

      if (timeRange === 'today') {
        if (!isSameDay(itemDate, now)) return false;
      } else if (timeRange === 'week') {
        if (!isSameWeek(itemDate, now)) return false;
      } else if (timeRange === 'month') {
        if (!isSameMonth(itemDate, now)) return false;
      } else if (timeRange === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (itemDate < start || itemDate > end) return false;
      }
    }

    // Enumerator filter
    if (enumerator !== 'all' && item.enumerator !== enumerator) return false;

    // Entity type filter
    if (entityType !== 'all' && item.entityType !== entityType) return false;

    // LGA filter
    if (lga !== 'all' && item.lga !== lga) return false;

    return true;
  });

  // Update statistics
  updateStatistics();

  // Update visualization based on selected type
  updateVisualization(visualizationType);

  // If LGA filter is applied, zoom to that area
  if (lga !== 'all') {
    // Get bounds for the selected LGA's data points
    const lgaData = filteredData.filter(item => item.lga === lga);
    if (lgaData.length > 0) {
      const lgaBounds = getDataBounds(lgaData);
      map.fitBounds(lgaBounds, { padding: [50, 50] });
    }
  }

  hideLoading();
}

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

// Helper function to check if two dates are in the same week
function isSameWeek(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
  return diffDays <= 7 && date1.getDay() <= date2.getDay();
}

// Helper function to check if two dates are in the same month
function isSameMonth(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth();
}

// Helper function to get bounds of data points
function getDataBounds(data) {
  const lats = data.map(item => item.lat);
  const lngs = data.map(item => item.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ];
}

// Function to update the visualization based on type
function updateVisualization(type) {
  // Clear existing layers
  if (heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
  }
  if (markerCluster) {
    map.removeLayer(markerCluster);
    markerCluster = null;
  }
  if (pinLayer) {
    map.removeLayer(pinLayer);
    pinLayer = null;
  }

  if (filteredData.length === 0) return;

  if (type === 'heatmap') {
    // Create heatmap layer
    const heatData = filteredData.map(item => [item.lat, item.lng, item.count]);
    heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'lime', 1: 'red' }
    }).addTo(map);

  } else if (type === 'clusters') {
    // Create marker clusters
    markerCluster = L.markerClusterGroup();

    filteredData.forEach(item => {
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${facilityColors[item.facilityType]}; width: 10px; height: 10px; border-radius: 50%;"></div>`
        })
      });

      marker.bindPopup(`
                        <b>${item.facilityType}</b><br>
                        LGA: ${item.lga}<br>
                        Ward: ${item.ward}<br>
                        Enumerator: ${item.enumerator}<br>
                        Count: ${item.count}<br>
                        Date: ${item.date.toLocaleDateString()}
                    `);

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

  } else if (type === 'pins') {
    // Create individual pins
    pinLayer = L.layerGroup();

    filteredData.forEach(item => {
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${facilityColors[item.facilityType]}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>`
        })
      });

      marker.bindPopup(`
                        <b>${item.facilityType}</b><br>
                        LGA: ${item.lga}<br>
                        Ward: ${item.ward}<br>
                        Enumerator: ${item.enumerator}<br>
                        Count: ${item.count}<br>
                        Date: ${item.date.toLocaleDateString()}
                    `);

      pinLayer.addLayer(marker);
    });

    map.addLayer(pinLayer);
  }

  // Zoom to show all filtered data
  map.fitBounds(getDataBounds(filteredData), { padding: [50, 50] });
}

// Function to update statistics panel
function updateStatistics() {
  const lgaFilter = document.getElementById('lgaFilter').value;

  // Update total counts
  document.getElementById('totalCount').textContent = filteredData.length;

  const individualCount = filteredData.filter(item => item.entityType === 'individual').length;
  document.getElementById('individualCount').textContent = individualCount;

  const businessCount = filteredData.filter(item => item.entityType === 'business').length;
  document.getElementById('businessCount').textContent = businessCount;

  // Update LGA information
  const selectedLGA = lgaFilter === 'all' ? 'None' : lgaFilter;
  document.getElementById('selectedLGA').textContent = selectedLGA;

  if (lgaFilter !== 'all') {
    const lgaCount = filteredData.filter(item => item.lga === lgaFilter).length;
    document.getElementById('lgaCount').textContent = lgaCount;
  } else {
    document.getElementById('lgaCount').textContent = 'N/A';
  }
}

// Show loading indicator
function showLoading() {
  document.getElementById('loadingIndicator').classList.remove('d-none');
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loadingIndicator').classList.add('d-none');
}

// Reset all filters
function resetFilters() {
  document.getElementById('timeRange').value = 'all';
  document.getElementById('customRangeContainer').classList.add('d-none');
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('enumeratorFilter').value = 'all';
  document.getElementById('entityTypeFilter').value = 'all';
  document.getElementById('lgaFilter').value = 'all';
  document.getElementById('visualizationType').value = 'heatmap';

  filteredData = [...allData];
  updateStatistics();
  updateVisualization('heatmap');
}

// Event listeners
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);

document.getElementById('timeRange').addEventListener('change', function () {
  const customRangeContainer = document.getElementById('customRangeContainer');
  if (this.value === 'custom') {
    customRangeContainer.classList.remove('d-none');
  } else {
    customRangeContainer.classList.add('d-none');
  }
});

// Initialize the map with Plateau State focus
document.addEventListener('DOMContentLoaded', function () {
  // Set initial view to Plateau State
  map.fitBounds([
    [8.5, 8.5],  // Southwest coordinates
    [10.5, 10.5]  // Northeast coordinates
  ]);

  // Add click handler for heatmap to show LGA and count
  map.on('click', function (e) {
    // Find all points within a small radius of the clicked point
    const clickRadius = 0.1; // degrees (~11km at equator)
    const nearbyPoints = allData.filter(item => {
      const latDiff = Math.abs(item.lat - e.latlng.lat);
      const lngDiff = Math.abs(item.lng - e.latlng.lng);
      return latDiff < clickRadius && lngDiff < clickRadius;
    });

    // Group by LGA
    const lgaGroups = {};
    nearbyPoints.forEach(point => {
      if (!lgaGroups[point.lga]) {
        lgaGroups[point.lga] = 0;
      }
      lgaGroups[point.lga] += point.count;
    });

    // Create popup content
    let popupContent = '<b>Nearby Enumeration Data</b><br><br>';

    if (Object.keys(lgaGroups).length === 0) {
      popupContent += 'No enumeration data found in this area';
    } else {
      popupContent += '<table class="table table-sm">';
      popupContent += '<tr><th>LGA</th><th>Count</th></tr>';

      for (const lga in lgaGroups) {
        popupContent += `<tr><td>${lga}</td><td>${lgaGroups[lga]}</td></tr>`;
      }

      popupContent += '</table>';
    }

    // Show popup
    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);
  });

  // Apply initial filters
  applyFilters();
});