$(document).ready(function () {
  // Initialize date range picker
  $('.date-range-picker').daterangepicker({
    opens: 'left',
    autoUpdateInput: false,
    locale: {
      format: 'YYYY-MM-DD',
      cancelLabel: 'Clear'
    }
  });

  // Apply date range
  $('.date-range-picker').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
  });

  // Clear date range
  $('.date-range-picker').on('cancel.daterangepicker', function () {
    $(this).val('');
  });

  // Initial load
  loadFacilities();
  loadSummaryTiles();

  // Apply filters
  $('#applyFilters').click(function () {
    const dateRange = $('#dateRangeFilter').val();
    if (dateRange && dateRange.split(' - ').length !== 2) {
      alert('Please select a valid date range');
      return;
    }
    loadFacilities();
    $('#filterModal').modal('hide');
  });

  // Reset filters
  $('#resetFilters').click(function () {
    $('#filterForm')[0].reset();
    $('.date-range-picker').val('');
    const drp = $('.date-range-picker').data('daterangepicker');
    drp.setStartDate(new Date());
    drp.setEndDate(new Date());
    loadFacilities();
  });

  // Export
  $('.dropdown-item-download').click(function () {
    const format = $(this).text().toLowerCase();
    exportData(format);
  });
});

// Load facilities
function loadFacilities() {
  try {
    const facilityType = $('#facilityTypeFilter').val();
    const lga = $('#lgaFilter').val();
    const category = $('#categoryFilter').val();
    const dateRange = $('#dateRangeFilter').val();
    const search = $('#searchFilter').val();

    let url = `${HOST}?gettHospitalFacilities`;
    if (facilityType) url += `&facility_type=${encodeURIComponent(facilityType)}`;
    if (lga) url += `&lga=${encodeURIComponent(lga)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (dateRange) {
      const [start, end] = dateRange.split(' - ');
      url += `&start_date=${start}&end_date=${end}`;
    }
    if (search) url += `&search=${encodeURIComponent(search)}`;

    // Show loading spinner
    $('#showFacilitiesList').html(`
      <tr>
        <td colspan="12" class="text-center">
          <div class="flex justify-center items-center my-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        </td>
      </tr>
    `);

    // Destroy DataTable if exists
    if ($.fn.DataTable.isDataTable('#dataTable')) {
      $('#dataTable').DataTable().clear().destroy();
    }

    // Fetch data with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        clearTimeout(timeoutId);
        if (data.status === 1 && data.facilities) {
          renderFacilities(data.facilities);
          initializeDataTable();
        } else {
          showNoDataMessage();
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error('Error loading facilities:', err);
        showErrorMessage(err.name === 'AbortError' ? 'Request timed out' : 'Error loading facilities');
      });

  } catch (err) {
    console.error('Error in loadFacilities:', err);
    showErrorMessage('An unexpected error occurred');
  }
}


// Render facilities table
function renderFacilities(facilities) {
  const list = document.getElementById('showFacilitiesList');
  list.innerHTML = ''; // clear previous rows

  if (!facilities || facilities.length === 0) {
    list.innerHTML = `<tr><td colspan="11" class="text-center text-muted">No facilities found</td></tr>`;
    return;
  }

  let html = '';
  facilities.forEach((facility, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${facility.enumeration_id}</td>
        <td>${facility.first_name || 'N/A'}</td>
        <td>${formatFacilityType(facility.facility_type) || 'N/A'}</td>
        <!-- <td>${facility.number_of_employees || '0'}</td> -->
        <td>${facility.tin_response.toUpperCase() || 'NO'}</td>
        <td>${facility.state || 'N/A'}</td>
        <td>${facility.lga || 'N/A'}</td>
        <td>${facility.phone || 'N/A'}</td>
        <td>${facility.email || 'N/A'}</td>
        <td>${facility.status || 'Active'}</td>
        <td>${facility.created_at.split(" ")[0]}</td>
        <td>
        <div class="btn-group d-flex space-x-4">
         <button class="btn btn-sm btn-outline-primary view-facility" 
              data-id="${facility.enumeration_id}" 
              title="View Details">
        <iconify-icon icon="mdi:eye-outline"></iconify-icon>
      </button>
      <a class="btn btn-secondary btn-sm print-btn" href="../hospital/enumeration-hospital-preview.html?id=${facility.enumeration_id}">
          <i class="fas fa-print"></i> Print
        </a>
        </td>
        </div>
      </tr>
    `;
  });

  list.innerHTML = html;

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



// Show error message
function showErrorMessage(message) {
  document.getElementById('showFacilitiesList').innerHTML = `
    <tr>
      <td colspan="12" class="text-center text-danger">
        ${message}
      </td>
    </tr>
  `;
}

// Show "no data" message
function showNoDataMessage() {
  document.getElementById('showFacilitiesList').innerHTML = `
    <tr>
      <td colspan="12" class="text-center text-muted">
        No data available for the selected filters.
      </td>
    </tr>
  `;
}

// Initialize DataTable
function initializeDataTable() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }

  $('#dataTable').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    responsive: true
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
    const type = facility.facility_type;
    const lga = facility.lga;

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
            <h5 class="card-title text-black fontBold">${type.replaceAll('_', ' ')}</h5>
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


  fetch(`https://plateauigr.com/php/?gettHospitalFacilities&enumeration_id=${facilityId}`)
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

  // Generate branch data HTML
  let branchDataHTML = '';
  const facilityBranches = facility.facility_branches || [];

  // Handle both single object and array cases
  let branchesArray = [];
  if (Array.isArray(facilityBranches)) {
    branchesArray = facilityBranches;
  } else if (facilityBranches && typeof facilityBranches === 'object' && facilityBranches.branch_name) {
    // Single branch object
    branchesArray = [facilityBranches];
  }

  if (branchesArray.length > 0) {
    branchesArray.forEach((branch, index) => {
      branchDataHTML += `
        <div class="mb-3 p-3 border rounded" style="background-color: #f8f9fa;">
          <h6 class="fw-bold mb-2" style="font-size: 14px; color: #495057;">Branch ${index + 1}</h6>
          <div class="row">
            <div class="col-6">
              <div class="mb-1">
                <strong style="font-size: 13px;">Branch Name:</strong><br>
                <span style="font-size: 13px;">${branch.branch_name || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">Physical Address:</strong><br>
                <span style="font-size: 13px;">${branch.physical_address || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">City:</strong><br>
                <span style="font-size: 13px;">${branch.city || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">LGA:</strong><br>
                <span style="font-size: 13px;">${branch.lga || 'N/A'}</span>
              </div>
            </div>
            <div class="col-6">
              <div class="mb-1">
                <strong style="font-size: 13px;">Phone Numbers:</strong><br>
                <span style="font-size: 13px;">${branch.phone_numbers || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">Email:</strong><br>
                <span style="font-size: 13px;">${branch.email || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">Website:</strong><br>
                <span style="font-size: 13px;">${branch.website || 'N/A'}</span>
              </div>
              <div class="mb-1">
                <strong style="font-size: 13px;">Coordinates:</strong><br>
                <span style="font-size: 13px;">${branch.latitude || 'N/A'}, ${branch.longitude || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    branchDataHTML = `
      <div class="mb-3 p-3 border rounded" style="background-color: #f8f9fa;">
        <div class="text-center" style="font-size: 13px; color: #6c757d;">
          No branch information available
        </div>
      </div>
    `;
  }

  $('#facilityDetailsContent').html(`
    <div class="row">
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Facility Information</h5>
        <table class="table table-sm">
        <tr>
            <th>Enumeration ID:</th>
            <td>${facilityData.enumeration_id ||'N/A'}</td>
          </tr>
          <tr>
            <th>Legal Name:</th>
            <td>${facilityData.first_name ||'N/A'}</td>
          </tr>
          <tr>
            <th>Facility Type:</th>
            <td>${formatFacilityType(facilityData.facility_type) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Registration Number:</th>
            <td>${facilityData.cac_rc_number || 'N/A'}</td>
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
            <td>${facilityData.phone || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${facilityData.email || 'N/A'}</td>
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
      
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Branch Information</h5>
        ${branchDataHTML}
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
  // Match filter logic
  const facilityType = $('#facilityTypeFilter').val();
  const lga = $('#lgaFilter').val();
  const category = $('#categoryFilter').val();
  const dateRange = $('#dateRangeFilter').val();
  const search = $('#searchFilter').val();

  let url = `${HOST}?gettHospitalFacilities`;
  if (facilityType) url += `&facility_type=${encodeURIComponent(facilityType)}`;
  if (lga) url += `&lga=${encodeURIComponent(lga)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (dateRange) {
    const dates = dateRange.split(' - ');
    url += `&start_date=${dates[0]}&end_date=${dates[1]}`;
  }
  if (search) url += `&search=${encodeURIComponent(search)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1) {
        const facilities = data.facilities;
console.log('Facilities to export:', facilities);
        // Map facilities and merge type_data dynamically
        const exportData = facilities.map(facility => {
          // Base fields
          let row = {
            "Enumeration ID": facility.enumeration_id,
            "Facility Name": facility.first_name,
            "Email": facility.email,
            "Phone": facility.phone,
            "State": facility.state,
            "LGA": facility.lga,
            "TIN": facility.tin,
            "Address": facility.address,
            // "Facility Hospital ID": facility.facility_hospital_id,
            "Facility Type": facility.facility_type,
            "Number of Beds": facility.number_of_beds,
            "Liabilities": facility.liabilities,
            "Average Monthly Visits": facility.avg_monthly_visits,
            "Branch Name": facility.branch_name,
            "Physical Address": facility.physical_address,
            "City": facility.city,
            "Branch Name": facility.branch_name,
            "Branch Email": facility.branch_email,
            "TIN Response": facility.tin_response,
            "Staff Range": facility.facility_classification.staff_range,
            "Payment Point Range": facility.facility_classification.payment_point_range,
            "Room Range": facility.facility_classification.room_range,
            "Branch Range": facility.facility_classification.branch_range,
          };

          // Merge type_data if available
          if (facility.type_data) {
            Object.entries(facility.type_data).forEach(([key, value]) => {
              // Use the original key as heading
              row[key] = value;
            });
          }

          // if (facility.facility_classification) {
          //   Object.entries(facility.facility_classification).forEach(([key, value]) => {
          //     // Use the original key as heading
          //     row[key] = value;
          //   });
          // }

          return row;
        });

        // Convert to Excel or CSV
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Facilities");

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


// function exportData(format) {
//   const facilityType = $('#facilityTypeFilter').val();
//   const lga = $('#lgaFilter').val();
//   const ownershipType = $('#ownershipTypeFilter').val();
//   const dateRange = $('#dateRangeFilter').val();
//   const search = $('#searchFilter').val();

//   let url = 'https://plateauigr.com/php/?gettHospitalFacilities';
//   if (facilityType) url += `&facility_type=${facilityType}`;
//   if (lga) url += `&lga=${lga}`;
//   if (ownershipType) url += `&Category=${ownershipType}`;
//   if (dateRange) {
//     const dates = dateRange.split(' - ');
//     url += `&start_date=${dates[0]}&end_date=${dates[1]}`;
//   }
//   if (search) url += `&search=${search}`;

//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       if (data.status === 1) {
//         const facilities = data.facilities;
//         const exportData = facilities.map(facility => ({
//           'Name': facility.facility.legal_name,
//           'Facility Type': facility.facility.facility_type,
//           'Number of Staff': facility.operations.number_of_employees,
//           'TIN Number': facility.facility.tax_identification_number,
//           'LGA': facility.location.lga,
//           'Phone': facility.location.phone_number,
//           'Category': facility.facility.category,
//           'Branches': facility.branches.length,
//           'Enumerated By': facility.facility.created_by,
//           'Address': facility.location.address,
//           'Email': facility.location.email,
//           'Date Established': facility.facility.date_of_establishment
//         }));

//         const ws = XLSX.utils.json_to_sheet(exportData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Facilities");

//         // Fix for Excel export - use correct bookType
//         const fileExtension = format === 'csv' ? 'csv' : 'xlsx';
//         const bookType = format === 'csv' ? 'csv' : 'xlsx';
//         const fileName = `Facilities_Export_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;

//         XLSX.writeFile(wb, fileName, { bookType });

//         Swal.fire({
//           title: 'Export Successful',
//           text: `Facilities data has been exported as ${format.toUpperCase()}`,
//           icon: 'success',
//           confirmButtonText: 'OK'
//         });
//       } else {
//         Swal.fire({
//           title: 'No Data',
//           text: 'No facilities found to export',
//           icon: 'warning',
//           confirmButtonText: 'OK'
//         });
//       }
//     })
//     .catch(error => {
//       console.error('Export error:', error);
//       Swal.fire({
//         title: 'Export Failed',
//         text: 'An error occurred while exporting data',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     });
// }