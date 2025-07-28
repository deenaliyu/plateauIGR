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

  let url = 'https://plateauigr.com/php/?getFacilities';
  if (facilityType) url += `&facility_type=${facilityType}`;
  if (lga) url += `&lga=${lga}`;
  if (ownershipType) url += `&ownership_type=${ownershipType}`;
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

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1) {
        renderFacilities(data.facilities);
        initializeDataTable()
      } else {
        $('#showFacilitiesList').html(`
          <tr>
            <td colspan="12" class="text-center text-danger">No facilities found</td>
          </tr>
        `);
      }
    })
    .catch(error => {
      console.error('Error loading facilities:', error);
      $('#showFacilitiesList').html(`
        <tr>
          <td colspan="12" class="text-center text-danger">Error loading facilities. Please try again.</td>
        </tr>
      `);
    });
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

  facilities.forEach((facility, index) => {
    const facilityData = facility.facility;
    const locationData = facility.location;
    const operationsData = facility.operations;
    const branches = facility.branches || [];

    $('#showFacilitiesList').append(`
      <tr>
        <td>${index + 1}</td>
        <td>${facilityData.legal_name || 'N/A'}</td>
        <td>${facilityData.facility_type || 'N/A'}</td>
        <td>${operationsData.number_of_employees || '0'}</td>
        <td>${facilityData.tax_identification_number || 'N/A'}</td>
        <td>${locationData.lga || 'N/A'}</td>
        <td>${locationData.phone_number || 'N/A'}</td>
        <td>${facilityData.ownership_type || 'N/A'}</td>
        <td>${branches.length}</td>
        <td>${facilityData.enumerator_email || 'N/A'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-facility" data-id="${facilityData.id}" title="View Details">
            <iconify-icon icon="mdi:eye-outline" class="text-md mt-1"></iconify-icon>
          </button>
          <!-- <button class="btn btn-sm btn-warning edit-facility" data-id="${facilityData.id}" title="Edit">
            <iconify-icon icon="mdi:pencil-outline"></iconify-icon>
          </button> -->
        </td>
      </tr>
    `);
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
  fetch('https://plateauigr.com/php/?getFacilities')
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

  fetch(`https://plateauigr.com/php/?getFacilities&facility_id=${facilityId}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1 && data.facilities.length > 0) {
        const facility = data.facilities[0];
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
  const facilityData = facility.facility;
  const locationData = facility.location;
  const operationsData = facility.operations;
  const branches = facility.branches || [];

  // Parse JSON strings if they exist
  const servicesOffered = operationsData.services_offered ? JSON.parse(operationsData.services_offered) : [];
  const majorEquipment = operationsData.major_equipment && operationsData.major_equipment !== 'null' ?
    JSON.parse(operationsData.major_equipment) : [];
  const issuingAuthority = facilityData.issuing_authority ? JSON.parse(facilityData.issuing_authority) : [];

  $('#facilityDetailsContent').html(`
    <div class="row">
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Facility Information</h5>
        <table class="table table-sm">
          <tr>
            <th>Legal Name:</th>
            <td>${facilityData.legal_name || 'N/A'}</td>
          </tr>
          <tr>
            <th>Facility Type:</th>
            <td>${facilityData.facility_type || 'N/A'}</td>
          </tr>
          <tr>
            <th>Registration Number:</th>
            <td>${facilityData.registration_number || 'N/A'}</td>
          </tr>
          <tr>
            <th>Ownership Type:</th>
            <td>${facilityData.ownership_type || 'N/A'}</td>
          </tr>
          <tr>
            <th>TIN Number:</th>
            <td>${facilityData.tax_identification_number || 'N/A'}</td>
          </tr>
          <tr>
            <th>Date Established:</th>
            <td>${facilityData.date_of_establishment || 'N/A'}</td>
          </tr>
          <tr>
            <th>Issuing Authority:</th>
            <td>${issuingAuthority.join(', ') || 'N/A'}</td>
          </tr>
        </table>
      </div>
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Location Information</h5>
        <table class="table table-sm">
          <tr>
            <th>Address:</th>
            <td>${locationData.address || 'N/A'}</td>
          </tr>
          <tr>
            <th>City/Town:</th>
            <td>${locationData.city || 'N/A'}</td>
          </tr>
          <tr>
            <th>LGA:</th>
            <td>${locationData.lga || 'N/A'}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>${locationData.phone_number || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${locationData.email || 'N/A'}</td>
          </tr>
          <tr>
            <th>Coordinates:</th>
            <td>${locationData.latitude}, ${locationData.longitude}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Operations</h5>
        <table class="table table-sm">
          <tr>
            <th>Services Offered:</th>
            <td>${servicesOffered.join(', ') || 'N/A'}</td>
          </tr>
          <tr>
            <th>Major Equipment:</th>
            <td>${majorEquipment.join(', ') || 'N/A'}</td>
          </tr>
          <tr>
            <th>Number of Employees:</th>
            <td>${operationsData.number_of_employees || '0'}</td>
          </tr>
          <tr>
            <th>Number of Beds:</th>
            <td>${operationsData.number_of_beds || '0'}</td>
          </tr>
          <tr>
            <th>Avg Monthly Visits:</th>
            <td>${operationsData.avg_monthly_patient_visits || '0'}</td>
          </tr>
          <tr>
            <th>Registration Fee:</th>
            <td>${operationsData.registration_fee ? '₦' + operationsData.registration_fee : 'N/A'}</td>
          </tr>
        </table>
      </div>
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Branches (${branches.length})</h5>
        ${branches.length > 0 ? `
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>LGA</th>
                </tr>
              </thead>
              <tbody>
                ${branches.map(branch => `
                  <tr>
                    <td>${branch.branch_name || 'N/A'}</td>
                    <td>${branch.address || 'N/A'}</td>
                    <td>${branch.lga || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p>No branches</p>'}
      </div>
    </div>
  `);
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

  let url = 'https://plateauigr.com/php/?getFacilities';
  if (facilityType) url += `&facility_type=${facilityType}`;
  if (lga) url += `&lga=${lga}`;
  if (ownershipType) url += `&ownership_type=${ownershipType}`;
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
          'Ownership': facility.facility.ownership_type,
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