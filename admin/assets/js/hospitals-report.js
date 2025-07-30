$(document).ready(function () {
  // Initialize date range picker
  $('.date-range-picker').daterangepicker({
    opens: 'left',
    locale: {
      format: 'YYYY-MM-DD'
    }
  });

  // Load facilities data
  loadFacilities();
  loadSummaryTiles();

  // Apply filters
  $('#applyFilters').click(function () {
    loadFacilities();
    $('#filterModal').modal('hide');
  });

  // Reset filters
  $('#resetFilters').click(function () {
    $('#filterForm')[0].reset();
    $('.date-range-picker').val('');
    loadFacilities();
  });

  // Export to CSV
  $('.dropdown-item-download').click(function () {
    const format = $(this).text().toLowerCase();
    exportData(format);
  });
});

// Load facilities data
function loadFacilities() {
  const facilityType = $('#facilityTypeFilter').val();
  const lga = $('#lgaFilter').val();
  const ownershipType = $('#ownershipTypeFilter').val();
  const dateRange = $('#dateRangeFilter').val();
  const search = $('#searchFilter').val();

  let url = 'https://plateauigr.com/php/?gettHospitalFacilities';
  if (facilityType) url += `&facility_type=${facilityType}`;
  if (lga) url += `&lga=${lga}`;
  if (ownershipType) url += `&category=${ownershipType}`;
  if (dateRange) {
    const dates = dateRange.split(' - ');
    url += `&start_date=${dates[0]}&end_date=${dates[1]}`;
  }
  if (search) url += `&search=${search}`;

  $('#showFacilitiesList').html(`
    <tr>
      <td colspan="12" class="text-center">
        <div class="flex justify-center items-center my-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </td>
    </tr>
  `);

  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
    $('#dataTable').empty();
  }

  // Add loading state
$('#showFacilitiesList').html(`
  <tr>
    <td colspan="12" class="text-center">Loading facilities...</td>
  </tr>
`);

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

fetch(url, { signal: controller.signal })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    clearTimeout(timeoutId);
    if (data.status === 1) {
      renderFacilities(data.facilities);
      initializeDataTable();
    } else {
      showNoDataMessage();
    }
  })
  .catch(error => {
    clearTimeout(timeoutId);
    console.error('Error loading facilities:', error);
    if (error.name === 'AbortError') {
      showErrorMessage('Request timed out');
    } else {
      showErrorMessage('Error loading facilities');
    }
  });

function showNoDataMessage() {
  const colCount = $('#showFacilitiesList tr:first th').length || 12;
  $('#showFacilitiesList').html(`
    <tr>
      <td colspan="${colCount}" class="text-center text-muted">No facilities found</td>
    </tr>
  `);
}

function showErrorMessage(message) {
  const colCount = $('#showFacilitiesList tr:first th').length || 12;
  $('#showFacilitiesList').html(`
    <tr>
      <td colspan="${colCount}" class="text-center text-danger">${message}</td>
    </tr>
  `);
  
  // Optionally add retry button
  $('#showFacilitiesList').after(`
    <div class="text-center mt-2">
      <button class="btn btn-sm btn-primary" onclick="loadFacilities()">Retry</button>
    </div>
  `);
}
}

function initializeDataTable() {
  $('#dataTable').DataTable({
    responsive: true,
  });
}
// Render facilities in table
function renderFacilities(facilities) {
  $('#showFacilitiesList').empty();

  if (facilities.length === 0) {
    $('#showFacilitiesList').html(`
      <tr>
        <td colspan="12" class="text-center">No facilities found matching your criteria</td>
      </tr>
    `);
    return;
  }

  console.log('Facilities data:', facilities);
  facilities.forEach((facility, index) => {
    const facilityData = facility;


   $('#showFacilitiesList').append(`
  <tr>
    <td>${index + 1}</td>
    <td>${facilityData.branch_name || 'N/A'}</td>
    <td>${formatFacilityType(facilityData.facility_type) || 'N/A'}</td>
    <td>${facilityData.number_of_beds || '0'}</td>
    <td>${facilityData.avg_monthly_visits || '0'}</td>
    <td>${facilityData.state || 'N/A'}</td>
    <td>${facilityData.lga || 'N/A'}</td>
    <td>${facilityData.branch_phone_numbers || 'N/A'}</td>
    <td>${facilityData.branch_email  || 'N/A'}</td>
    <td>${facilityData.hasOwnProperty('tin') ? 'yes' : 'no'}</td>
    <td>Active</td> <!-- Default status -->
    <td>
      <button class="btn btn-sm btn-outline-primary view-facility" 
              data-id="${facilityData.payer_user_id}" 
              title="View Details">
        <iconify-icon icon="mdi:eye-outline"></iconify-icon>
      </button>
    </td>
  </tr>
`);

// Helper function to format facility type
function formatFacilityType(type) {
  if (!type) return 'N/A';
  
  // Convert snake_case to Title Case
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
  });

  // Add click handlers for view buttons
  $('.view-facility').click(function () {
    const facilityId = $(this).data('id');
    showFacilityDetails(facilityId);
  });

  // Add click handlers for edit buttons
  $('.edit-facility').click(function () {
    const facilityId = $(this).data('id');
    editFacility(facilityId);
  });
}

// Load summary tiles
function loadSummaryTiles() {
  fetch('https://plateauigr.com/php/?gettHospitalFacilities')
    .then(response => response.json())
    .then(data => {
      if (data.status === 1) {
        renderSummaryTiles(data.facilities);
      }
    });
}

// Render summary tiles
function renderSummaryTiles(facilities) {
  const facilityTypes = {};
  const lgaCounts = {};

  // Count facilities by type
  facilities.forEach(facility => {
    const type = facility.facility.facility_type;
    const lga = facility.location.lga;

    if (!facilityTypes[type]) {
      facilityTypes[type] = 0;
    }
    facilityTypes[type]++;

    if (!lgaCounts[lga]) {
      lgaCounts[lga] = 0;
    }
    lgaCounts[lga]++;
  });

  // Create tiles for each facility type
  $('#facilityTypeSummary').empty();
  for (const [type, count] of Object.entries(facilityTypes)) {
    $('#facilityTypeSummary').append(`
      <div class="col-md-3 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-black fontBold">${type}</h5>
            <p class="card-text display-4 text-primary">${count}</p>
          </div>
        </div>
      </div>
    `);
  }

  // Add click handlers to filter by facility type
  // $('.card').click(function () {
  //   const type = $(this).find('.card-title').text();
  //   $('#facilityTypeFilter').val(type);
  //   loadFacilities();
  // });
}

// Show facility details in modal
function showFacilityDetails(facilityId) {
  $('#facilityDetailsContent').html(`
    <div class="flex justify-center items-center my-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);


  fetch(`https://plateauigr.com/php/?gettHospitalFacilities&facility_hospital_id=${facilityId}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1 && data.facilities.length > 0) {
        const facility = data.facilities[0];
        console.log('Facility details loaded:', facility);
        renderFacilityDetails(facility);
      } else {
        $('#facilityDetailsContent').html(`
          <div class="alert alert-danger">Facility details not found</div>
        `);
      }
    })
    .catch(error => {
      console.error('Error loading facility details:', error);
      $('#facilityDetailsContent').html(`
        <div class="alert alert-danger">Error loading facility details</div>
      `);
    });

  $('#facilityDetailsModal').modal('show');
}

// Render facility details
function renderFacilityDetails(facility) {
  const facilityData = facility;
  const typeData = facility.type_data || {};
  
  // Parse JSON strings if they exist
  const servicesOffered = typeData.services_offered ? JSON.parse(typeData.services_offered) : [];
  const primaryServices = typeData.primary_services_offered ? JSON.parse(typeData.primary_services_offered) : [];
  
  // Create dynamic type-specific fields
  let typeSpecificFields = '';
  
  // Generate fields based on type_data properties
  for (const [key, value] of Object.entries(typeData)) {
    if (key !== 'id' && key !== 'facility_hospital_id' && key !== 'created_at' && key !== 'updated_at' && 
        key !== 'services_offered' && key !== 'primary_services_offered') {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      let displayValue = value;
      if (key.includes('fee') || key.includes('cost')) {
        displayValue = value ? `₦${parseFloat(value).toLocaleString()}` : 'N/A';
      }
      
      typeSpecificFields += `
        <tr>
          <th>${label}:</th>
          <td>${displayValue || 'N/A'}</td>
        </tr>
      `;
    }
  }

  $('#facilityDetailsContent').html(`
    <div class="row">
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Facility Information</h5>
        <table class="table table-sm">
          <tr>
            <th>Legal Name:</th>
            <td>${facilityData.branch_name ||'N/A'}</td>
          </tr>
          <tr>
            <th>Facility Type:</th>
            <td>${formatFacilityType(facilityData.facility_type) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Registration Number:</th>
            <td>${facilityData.facility_hospital_id || 'N/A'}</td>
          </tr>
          <tr>
            <th>State:</th>
            <td>${facilityData.state || 'N/A'}</td>
          </tr>
          <tr>
            <th>LGA:</th>
            <td>${facilityData.lga || 'N/A'}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>${facilityData.branch_phone_numbers || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${facilityData.branch_email || 'N/A'}</td>
          </tr>
        </table>
      </div>
      
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Services</h5>
        <table class="table table-sm">
          <tr>
            <th>Primary Services:</th>
            <td>${primaryServices.join(', ') || 'N/A'}</td>
          </tr>
          <tr>
            <th>All Services Offered:</th>
            <td>${servicesOffered.join(', ') || 'N/A'}</td>
          </tr>
        </table>
      </div>
      
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">${formatFacilityType(facilityData.facility_type)} Specific Information</h5>
        <table class="table table-sm">
          ${typeSpecificFields}
          <tr>
            <th>Number of Beds:</th>
            <td>${facilityData.number_of_beds || '0'}</td>
          </tr>
          <tr>
            <th>Avg Monthly Visits:</th>
            <td>${facilityData.avg_monthly_visits || '0'}</td>
          </tr>
        </table>
      </div>
    </div>
  `);
}

// Helper function to format facility type
function formatFacilityType(type) {
  if (!type) return 'N/A';
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Edit facility
function editFacility(facilityId) {
  Swal.fire({
    title: 'Edit Facility',
    text: 'This feature will be available soon',
    icon: 'info',
    confirmButtonText: 'OK'
  });
}

// Export data
function exportData(format) {
  const facilityType = $('#facilityTypeFilter').val();
  const lga = $('#lgaFilter').val();
  const ownershipType = $('#ownershipTypeFilter').val();
  const dateRange = $('#dateRangeFilter').val();
  const search = $('#searchFilter').val();

  let url = 'https://plateauigr.com/php/?gettHospitalFacilities';
  if (facilityType) url += `&facility_type=${facilityType}`;
  if (lga) url += `&lga=${lga}`;
  if (ownershipType) url += `&Category=${ownershipType}`;
  if (dateRange) {
    const dates = dateRange.split(' - ');
    url += `&start_date=${dates[0]}&end_date=${dates[1]}`;
  }
  if (search) url += `&search=${search}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1) {
        const facilities = data.facilities;
        const exportData = facilities.map(facility => ({
          'Name': facility.facility.legal_name,
          'Facility Type': facility.facility.facility_type,
          'Number of Staff': facility.operations.number_of_employees,
          'TIN Number': facility.facility.tax_identification_number,
          'LGA': facility.location.lga,
          'Phone': facility.location.phone_number,
          'Category': facility.facility.category,
          'Branches': facility.branches.length,
          'Enumerated By': facility.facility.created_by,
          'Address': facility.location.address,
          'Email': facility.location.email,
          'Date Established': facility.facility.date_of_establishment
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Facilities");

        // Fix for Excel export - use correct bookType
        const fileExtension = format === 'csv' ? 'csv' : 'xlsx';
        const bookType = format === 'csv' ? 'csv' : 'xlsx';
        const fileName = `Facilities_Export_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;

        XLSX.writeFile(wb, fileName, { bookType });

        Swal.fire({
          title: 'Export Successful',
          text: `Facilities data has been exported as ${format.toUpperCase()}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'No Data',
          text: 'No facilities found to export',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      console.error('Export error:', error);
      Swal.fire({
        title: 'Export Failed',
        text: 'An error occurred while exporting data',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
}