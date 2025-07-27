const PLATEAU_BOUNDS = [
  [8.5, 8.5],  // Southwest coordinates
  [10.5, 10.5]  // Northeast coordinates
];

async function getEnumerators() {
  try {
    const response = await fetch(`${HOST}?getEnumUser`);
    const data = await response.json();

    data.message.reverse().forEach(enumuser => {
      $("#enumeratorFilter").append(`
        <option value="${enumuser.id}">${enumuser.fullname}</option>
        `)
    })
  } catch (error) {
    console.log(error)
  }
}

getEnumerators()

// Map initialization
const map = L.map('map').setView([9.25, 9.5], 8); // Centered on Plateau State
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to hold map layers and data
let heatLayer = null;
let markerCluster = null;
let pinLayer = null;
let allData = [];
let filteredData = [];

// DOM elements
const loadingIndicator = document.getElementById('loadingIndicator');
const totalCountElement = document.getElementById('totalCount');
const individualCountElement = document.getElementById('individualCount');
const businessCountElement = document.getElementById('corpCount');
const stateAgencyElm = document.getElementById('stateAgncCount');
const federalAgencyElm = document.getElementById('federalAgncCount');
const hospitalElm = document.getElementById('hospitalCount');
const selectedLGAElement = document.getElementById('selectedLGA');
const lgaCountElement = document.getElementById('lgaCount');

// Process API data to match our frontend structure
function processAPIData(apiData) {
  return apiData.data.map(item => {
    // Skip records with invalid coordinates
    if (!item.enumlatitude || !item.enumlongitude ||
      item.enumlatitude === "0.00" || item.enumlongitude === "0.00") {
      return null;
    }

    return {
      lat: parseFloat(item.enumlatitude),
      lng: parseFloat(item.enumlongitude),
      facilityType: item.business_type || "Unknown",
      lga: item.lga,
      ward: "Unknown", // API doesn't provide ward info
      enumerator: item.enumerator_name || "Unknown",
      entityType: item.category,
      date: new Date(item.timeIn),
      count: 1, // Each record represents 1 enumeration
      rawData: item // Keep original data for popups
    };
  }).filter(item => item !== null); // Remove null entries
}


// Fetch data from API
async function fetchData(params = {}) {
  try {
    showLoading();

    // Construct query parameters
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) queryParams.append(key, value);
    }

    const response = await fetch(`${HOST}?getEnumTaxPayer&${queryParams.toString()}`);
    const data = await response.json();

    if (data.status === "1") {
      return processAPIData(data);
    } else {
      console.error("API Error:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  } finally {
    hideLoading();
  }
}

// Apply filters to the data
async function applyFilters() {
  showLoading();

  // Get filter values from UI
  const timeRange = document.getElementById('timeRange').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const enumerator = document.getElementById('enumeratorFilter').value;
  const entityType = document.getElementById('entityTypeFilter').value;
  const lga = document.getElementById('lgaFilter').value;
  const visualizationType = document.getElementById('visualizationType').value;

  // Build API params
  const params = {};
  if (enumerator !== '') params.enumerator = enumerator;
  if (lga !== 'all') params.lga = lga;

  // Time range filters
  if (timeRange === 'custom' && startDate && endDate) {
    params.from_date = startDate;
    params.to_date = endDate;
  } else if (timeRange !== 'all') {
    const now = new Date();
    let fromDate = new Date();

    if (timeRange === 'today') {
      fromDate.setHours(0, 0, 0, 0);
    } else if (timeRange === 'week') {
      fromDate.setDate(fromDate.getDate() - 7);
    } else if (timeRange === 'month') {
      fromDate.setMonth(fromDate.getMonth() - 1);
    }

    params.from_date = fromDate.toISOString().split('T')[0];
    params.to_date = now.toISOString().split('T')[0];
  }

  // Fetch and process data
  filteredData = await fetchData(params);

  // Apply entity type filter client-side
  if (entityType !== 'all') {
    filteredData = filteredData.filter(item => item.entityType === entityType);
  }

  // Update statistics
  updateStatistics();

  // Update visualization
  updateVisualization(visualizationType);

  // Zoom to selected LGA if filtered
  if (lga !== 'all') {
    const lgaData = filteredData.filter(item => item.lga === lga);
    if (lgaData.length > 0) {
      const lgaBounds = getDataBounds(lgaData);
      map.fitBounds(lgaBounds, { padding: [50, 50] });
    }
  }

  hideLoading();
}

// Update visualization based on selected type
function updateVisualization(type) {
  // Clear existing layers
  if (heatLayer) map.removeLayer(heatLayer);
  if (markerCluster) map.removeLayer(markerCluster);
  if (pinLayer) map.removeLayer(pinLayer);

  if (filteredData.length === 0) return;

  if (type === 'heatmap') {
    const heatData = filteredData.map(item => [item.lat, item.lng, item.count]);
    heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'lime', 1: 'red' }
    }).addTo(map);
  }
  else if (type === 'clusters' || type === 'pins') {
    const layer = type === 'clusters' ? L.markerClusterGroup() : L.layerGroup();

    filteredData.forEach(item => {
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${getColorByType(item)}; 
                           width: ${type === 'pins' ? '15px' : '10px'}; 
                           height: ${type === 'pins' ? '15px' : '10px'}; 
                           border-radius: 50%; 
                           ${type === 'pins' ? 'border: 2px solid white;' : ''}"></div>`
        })
      });

      marker.bindPopup(createPopupContent(item));
      layer.addLayer(marker);
    });

    map.addLayer(layer);

    if (type === 'clusters') markerCluster = layer;
    else pinLayer = layer;
  }

  // Zoom to show all data
  if (filteredData.length > 0) {
    map.fitBounds(getDataBounds(filteredData), { padding: [50, 50] });
  }
}

// Update statistics panel
function updateStatistics() {
  const lgaFilter = document.getElementById('lgaFilter').value;

  // Update total counts
  totalCountElement.textContent = filteredData.length;

  const individualCount = filteredData.filter(item => item.entityType === 'Individual').length;
  individualCountElement.textContent = individualCount;

  const corporateCount = filteredData.filter(item => item.entityType === 'Corporate').length;
  businessCountElement.textContent = corporateCount;

  const stateAgncyCount = filteredData.filter(item => item.entityType === 'State Agency').length;
  stateAgencyElm.textContent = stateAgncyCount;

  const federalAgencyCount = filteredData.filter(item => item.entityType === 'Federal Agency').length;
  federalAgencyElm.textContent = federalAgencyCount;

  const hospitalCount = filteredData.filter(item => item.entityType === 'Hospital').length;
  hospitalElm.textContent = hospitalCount;

  // Update LGA information
  const selectedLGA = lgaFilter === 'all' ? 'None' : lgaFilter;
  selectedLGAElement.textContent = selectedLGA;

  if (lgaFilter !== 'all') {
    const lgaCount = filteredData.filter(item => item.lga === lgaFilter).length;
    lgaCountElement.textContent = lgaCount;
  } else {
    lgaCountElement.textContent = 'N/A';
  }
}

// Helper function to determine marker color
function getColorByType(item) {
  // Use business type or entity type for color coding
  if (item.facilityType && item.facilityType !== "Unknown") {
    // Create a simple hash of the business type for consistent coloring
    let hash = 0;
    for (let i = 0; i < item.facilityType.length; i++) {
      hash = item.facilityType.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  }
  return item.entityType === 'individual' ? '#3498db' : '#e74c3c';
}

// Helper function to create popup content
function createPopupContent(item) {
  const data = item.rawData;
  return `
        <div style="max-width: 300px;">
            <h6>${data.tax_number}</h6>
            <table class="table table-sm">
                <tr><th>LGA:</th><td>${data.lga}</td></tr>
                <tr><th>Enumerator:</th><td>${data.enumerator_name || 'Unknown'}</td></tr>
                <tr><th>Type:</th><td>${item.entityType}</td></tr>
                <tr><th>Date:</th><td>${new Date(data.timeIn).toLocaleString()}</td></tr>
                ${data.business_type ? `<tr><th>Business:</th><td>${data.business_type}</td></tr>` : ''}
                ${data.phone ? `<tr><th>Phone:</th><td>${data.phone}</td></tr>` : ''}
            </table>
        </div>
    `;
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

// Show loading indicator
function showLoading() {
  loadingIndicator.classList.remove('d-none');
}

// Hide loading indicator
function hideLoading() {
  loadingIndicator.classList.add('d-none');
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

// Initialize the application
async function initialize() {
  // Set initial view to Plateau State
  map.fitBounds(PLATEAU_BOUNDS);

  // Fetch initial data
  allData = await fetchData();
  filteredData = [...allData];

  // Update UI
  updateStatistics();
  updateVisualization('heatmap');

  // Add click handler for LGA summary
  map.on('click', function (e) {
    const nearby = filteredData.filter(item => {
      return Math.abs(item.lat - e.latlng.lat) < 0.2 &&
        Math.abs(item.lng - e.latlng.lng) < 0.2;
    });

    const lgaCounts = {};
    nearby.forEach(item => {
      lgaCounts[item.lga] = (lgaCounts[item.lga] || 0) + 1;
    });

    let content = '<b>Nearby Enumerations</b><br><table class="table table-sm">';
    for (const [lga, count] of Object.entries(lgaCounts)) {
      content += `<tr><td>${lga}</td><td>${count}</td></tr>`;
    }
    content += '</table>';

    L.popup()
      .setLatLng(e.latlng)
      .setContent(content)
      .openOn(map);
  });
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

// Start the application
document.addEventListener('DOMContentLoaded', initialize);