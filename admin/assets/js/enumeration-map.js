// Plateau State boundaries
const PLATEAU_BOUNDS = [
  [8.5, 8.7],   // Southwest coordinates
  [10.0, 10.2]  // Northeast coordinates
];

// Initialize map with Plateau focus
const map = L.map('map', {
  maxBounds: PLATEAU_BOUNDS,
  maxBoundsViscosity: 1.0
}).setView([9.2, 9.3], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 7,
  maxZoom: 12
}).addTo(map);

// Variables for map layers
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

// Check if coordinates are within Plateau
function isInPlateau(lat, lng) {
  return lat >= PLATEAU_BOUNDS[0][0] && lat <= PLATEAU_BOUNDS[1][0] && 
         lng >= PLATEAU_BOUNDS[0][1] && lng <= PLATEAU_BOUNDS[1][1];
}

// Process API data for Plateau
function processAPIData(apiData) {
  return apiData.data.map(item => {
    if (!item.enumlatitude || !item.enumlongitude ||
        item.enumlatitude === "0.00" || item.enumlongitude === "0.00" ||
        !isInPlateau(parseFloat(item.enumlatitude), parseFloat(item.enumlongitude))) {
      return null;
    }

    return {
      lat: parseFloat(item.enumlatitude),
      lng: parseFloat(item.enumlongitude),
      facilityType: item.business_type || "Unknown",
      lga: item.lga,
      entityType: item.category,
      date: new Date(item.timeIn),
      rawData: item
    };
  }).filter(item => item !== null);
}

// Fetch enumerators
async function getEnumerators() {
  try {
    const response = await fetch(`${HOST}?getEnumUser`);
    const data = await response.json();

    data.message.reverse().forEach(enumuser => {
      $("#enumeratorFilter").append(`
        <option value="${enumuser.id}">${enumuser.fullname}</option>
      `);
    });
  } catch (error) {
    console.error("Error loading enumerators:", error);
  }
}

// Fetch data with Plateau filter
async function fetchData(params = {}) {
  try {
    showLoading();
    const queryParams = new URLSearchParams();
    queryParams.append('state', 'Plateau');
    
    for (const [key, value] of Object.entries(params)) {
      if (value) queryParams.append(key, value);
    }

    const response = await fetch(`${HOST}?getEnumTaxPayer&${queryParams.toString()}`);
    const data = await response.json();

    if (data.status === "1") {
      return processAPIData(data);
    }
    return [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  } finally {
    hideLoading();
  }
}

// Apply filters
async function applyFilters() {
  showLoading();

  const timeRange = document.getElementById('timeRange').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const enumerator = document.getElementById('enumeratorFilter').value;
  const entityType = document.getElementById('entityTypeFilter').value;
  const lga = document.getElementById('lgaFilter').value;
  const visualizationType = document.getElementById('visualizationType').value;

  const params = { state: 'Plateau' };
  if (enumerator) params.enumerator = enumerator;
  if (lga !== 'all') params.lga = lga;

  if (timeRange === 'custom' && startDate && endDate) {
    params.from_date = startDate;
    params.to_date = endDate;
  } else if (timeRange !== 'all') {
    const now = new Date();
    let fromDate = new Date();

    if (timeRange === 'today') fromDate.setHours(0, 0, 0, 0);
    else if (timeRange === 'week') fromDate.setDate(fromDate.getDate() - 7);
    else if (timeRange === 'month') fromDate.setMonth(fromDate.getMonth() - 1);

    params.from_date = fromDate.toISOString().split('T')[0];
    params.to_date = now.toISOString().split('T')[0];
  }

  filteredData = await fetchData(params);
  
  if (entityType !== 'all') {
    filteredData = filteredData.filter(item => item.entityType === entityType);
  }

  updateStatistics();
  updateVisualization(visualizationType);

  // Zoom to results
  if (filteredData.length > 0) {
    const bounds = getDataBounds(filteredData);
    map.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: lga !== 'all' ? 10 : 9 
    });
  } else {
    map.fitBounds(PLATEAU_BOUNDS, { padding: [20, 20] });
    L.popup()
      .setLatLng(map.getCenter())
      .setContent("No facilities found with current filters")
      .openOn(map);
  }

  hideLoading();
}

// Update visualization
function updateVisualization(type) {
  if (heatLayer) map.removeLayer(heatLayer);
  if (markerCluster) map.removeLayer(markerCluster);
  if (pinLayer) map.removeLayer(pinLayer);

  if (filteredData.length === 0) return;

  if (type === 'heatmap') {
    heatLayer = L.heatLayer(filteredData.map(item => [item.lat, item.lng, 1]), {
      radius: 20,
      blur: 15,
      maxZoom: 12,
      gradient: { 0.4: 'blue', 0.6: 'lime', 1: 'red' }
    }).addTo(map);
  } else {
    const layer = type === 'clusters' ? L.markerClusterGroup() : L.layerGroup();

    filteredData.forEach(item => {
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${getColorByType(item)}; 
                         width: 15px; height: 15px; border-radius: 50%; 
                         border: 2px solid white;"></div>`
        })
      }).bindPopup(createPopupContent(item));
      
      layer.addLayer(marker);
    });

    map.addLayer(layer);
    if (type === 'clusters') markerCluster = layer;
    else pinLayer = layer;
  }
}

// Update statistics
function updateStatistics() {
  const lgaFilter = document.getElementById('lgaFilter').value;

  totalCountElement.textContent = filteredData.length;
  individualCountElement.textContent = filteredData.filter(item => item.entityType === 'Individual').length;
  businessCountElement.textContent = filteredData.filter(item => item.entityType === 'Corporate').length;
  stateAgencyElm.textContent = filteredData.filter(item => item.entityType === 'State Agency').length;
  federalAgencyElm.textContent = filteredData.filter(item => item.entityType === 'Federal Agency').length;
  hospitalElm.textContent = filteredData.filter(item => item.entityType === 'Hospital').length;

  selectedLGAElement.textContent = lgaFilter === 'all' ? 'None' : lgaFilter;
  lgaCountElement.textContent = lgaFilter !== 'all' ? 
    filteredData.filter(item => item.lga === lgaFilter).length : 'N/A';
}

// Helper functions
function getColorByType(item) {
  const colors = {
    'Individual': '#3498db',
    'Corporate': '#e74c3c',
    'State Agency': '#9b59b6',
    'Federal Agency': '#f1c40f',
    'Hospital': '#2ecc71'
  };
  return colors[item.entityType] || '#95a5a6';
}

function createPopupContent(item) {
  const data = item.rawData;
  return `
    <div style="max-width: 250px;">
      <h6>${data.business_type || 'Facility'}</h6>
      <table class="table table-sm">
        <tr><th>LGA:</th><td>${data.lga || 'Unknown'}</td></tr>
        <tr><th>Type:</th><td>${item.entityType || 'Unknown'}</td></tr>
        <tr><th>Date:</th><td>${new Date(data.timeIn).toLocaleDateString() || 'Unknown'}</td></tr>
        ${data.phone ? `<tr><th>Phone:</th><td>${data.phone}</td></tr>` : ''}
      </table>
    </div>
  `;
}

function getDataBounds(data) {
  const lats = data.map(item => item.lat);
  const lngs = data.map(item => item.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ];
}

function showLoading() {
  loadingIndicator.classList.remove('d-none');
}

function hideLoading() {
  loadingIndicator.classList.add('d-none');
}

function resetFilters() {
  document.getElementById('timeRange').value = 'all';
  document.getElementById('customRangeContainer').classList.add('d-none');
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('enumeratorFilter').value = '';
  document.getElementById('entityTypeFilter').value = 'all';
  document.getElementById('lgaFilter').value = 'all';
  document.getElementById('visualizationType').value = 'heatmap';

  filteredData = [...allData];
  updateStatistics();
  updateVisualization('heatmap');
  map.fitBounds(PLATEAU_BOUNDS, { padding: [20, 20] });
}

// Initialize application
async function initialize() {
  // Set strict Plateau bounds
  map.fitBounds(PLATEAU_BOUNDS, { padding: [20, 20] });
  map.on('drag', function() {
    if (!map.getBounds().intersects(PLATEAU_BOUNDS)) {
      map.fitBounds(PLATEAU_BOUNDS, { padding: [20, 20] });
    }
  });

  // Load enumerators
  await getEnumerators();

  // Fetch initial data
  allData = await fetchData();
  filteredData = [...allData];
  updateStatistics();
  updateVisualization('heatmap');
}

// Event listeners
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);
document.getElementById('timeRange').addEventListener('change', function() {
  document.getElementById('customRangeContainer').classList.toggle('d-none', this.value !== 'custom');
});

// Start the application
document.addEventListener('DOMContentLoaded', initialize);