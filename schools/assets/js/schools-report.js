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

// Load school facilities
function loadFacilities() {
  try {
    const facilityType = $('#facilityTypeFilter').val();
    const lga = $('#lgaFilter').val();
    const category = $('#categoryFilter').val();
    const dateRange = $('#dateRangeFilter').val();
    const search = $('#searchFilter').val();

    let url = `${HOST}?getSchoolFacilities=1&enumerator_id=${userInfo2.id}`;
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
        console.log('Facilities data:', data); // Debug
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
    list.innerHTML = `<tr><td colspan="12" class="text-center text-muted">No schools found</td></tr>`;
    return;
  }

  let html = '';
  facilities.forEach((facility, index) => {
    // Get school-specific data
    const numberOfStaff = facility.type_data?.number_of_staff || '0';
    const avgIntakes = facility.type_data?.avg_new_intakes_per_session || '0';
    const avgStudents = facility.type_data?.avg_number_of_students || '0';

    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${facility.enumeration_id || 'N/A'}</td>
        <td>${facility.first_name || 'N/A'}</td>
        <td>${formatFacilityType(facility.facility_type) || 'N/A'}</td>
        <td>${numberOfStaff}</td>
        <td>${avgStudents}</td>
        <td>${facility.state || 'N/A'}</td>
        <td>${facility.lga || 'N/A'}</td>
        <td>${facility.phone || 'N/A'}</td>
        <td>${facility.email || 'N/A'}</td>
        <td><span class="badge bg-success">Active</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-facility" 
            data-id="${facility.enumeration_id}" 
            title="View Details">
            <iconify-icon icon="mdi:eye-outline"></iconify-icon>
          </button>
        </td>
      </tr>
    `;
  });

  list.innerHTML = html;

  // Add click handler for view buttons
  $('.view-facility').click(function () {
    const facilityId = $(this).data('id');
    showFacilityDetails(facilityId);
  });
}

// Show facility details
function showFacilityDetails(enumerationId) {
  const url = `${HOST}?getSchoolFacilities=1&enumeration_id=${enumerationId}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1 && data.facilities && data.facilities.length > 0) {
        const facilityData = data.facilities[0];
        renderFacilityDetails(facilityData);
        $('#facilityDetailsModal').modal('show');
      } else {
        Swal.fire({
          title: 'Not Found',
          text: 'School facility details not found',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      console.error('Error loading facility details:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load school facility details',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
}

// Render facility details modal
function renderFacilityDetails(facilityData) {
  // Get school-specific type data
  const typeData = facilityData.type_data || {};
  const numberOfStaff = typeData.number_of_staff || 'N/A';
  const avgIntakes = typeData.avg_new_intakes_per_session || 'N/A';
  const avgStudents = typeData.avg_number_of_students || 'N/A';

  // Process liabilities
  let liabilitiesHTML = 'N/A';
  if (facilityData.liabilities) {
    const liabilitiesArray = facilityData.liabilities.split('\n').filter(Boolean);
    if (liabilitiesArray.length > 0) {
      liabilitiesHTML = '<ul class="mb-0">';
      liabilitiesArray.forEach(liability => {
        liabilitiesHTML += `<li>${liability}</li>`;
      });
      liabilitiesHTML += '</ul>';
    }
  }

  // Process branches
  let branchDataHTML = '';
  if (facilityData.facility_branches && facilityData.facility_branches.length > 0) {
    facilityData.facility_branches.forEach((branch, index) => {
      branchDataHTML += `
        <div class="mb-3 p-3 border rounded" style="background-color: #f8f9fa;">
          <h6 style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Branch ${index + 1}</h6>
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
        <h5 class="text-xl fontBold text-black">School Information</h5>
        <table class="table table-sm table-bordered">
          <tr>
            <th>Enumeration ID:</th>
            <td>${facilityData.enumeration_id || 'N/A'}</td>
          </tr>
          <tr>
            <th>School Name:</th>
            <td>${facilityData.first_name || 'N/A'}</td>
          </tr>
          <tr>
            <th>Facility Type:</th>
            <td>${formatFacilityType(facilityData.facility_type) || 'N/A'}</td>
          </tr>
          <tr>
            <th>CAC/RC Number:</th>
            <td>${facilityData.cac_rc_number || 'N/A'}</td>
          </tr>
          <tr>
            <th>Ownership Type:</th>
            <td>${facilityData.ownership_type || 'N/A'}</td>
          </tr>
          <tr>
            <th>License Number:</th>
            <td>${facilityData.license_number || 'N/A'}</td>
          </tr>
          <tr>
            <th>License Expiry:</th>
            <td>${facilityData.license_expiry || 'N/A'}</td>
          </tr>
          <tr>
            <th>Date Established:</th>
            <td>${facilityData.date_established || 'N/A'}</td>
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
            <th>Address:</th>
            <td>${facilityData.address || 'N/A'}</td>
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
        <h5 class="text-xl fontBold text-black">Operational Information</h5>
        <table class="table table-sm table-bordered">
          <tr>
            <th>Number of Staff:</th>
            <td>${numberOfStaff}</td>
          </tr>
          <tr>
            <th>Average New Intakes per Session:</th>
            <td>${avgIntakes}</td>
          </tr>
          <tr>
            <th>Average Number of Students:</th>
            <td>${avgStudents}</td>
          </tr>
        </table>
      </div>
      
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Tax Liabilities</h5>
        <div class="p-3 border rounded" style="background-color: #f8f9fa;">
          ${liabilitiesHTML}
        </div>
      </div>
      
      <div class="col-md-12 mb-4">
        <h5 class="text-xl fontBold text-black">Representative Information</h5>
        <table class="table table-sm table-bordered">
          <tr>
            <th>Name:</th>
            <td>${facilityData.rep_firstname || ''} ${facilityData.rep_surname || ''}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${facilityData.rep_email || 'N/A'}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>${facilityData.rep_phone || 'N/A'}</td>
          </tr>
          <tr>
            <th>Position:</th>
            <td>${facilityData.rep_position || 'N/A'}</td>
          </tr>
          <tr>
            <th>State:</th>
            <td>${facilityData.rep_state || 'N/A'}</td>
          </tr>
          <tr>
            <th>LGA:</th>
            <td>${facilityData.rep_lga || 'N/A'}</td>
          </tr>
          <tr>
            <th>Address:</th>
            <td>${facilityData.rep_address || 'N/A'}</td>
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
    responsive: true,
    pageLength: 25
  });
}

// Helper function to format facility type
function formatFacilityType(type) {
  if (!type) return 'N/A';
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Export data
function exportData(format) {
  // Match filter logic
  const facilityType = $('#facilityTypeFilter').val();
  const lga = $('#lgaFilter').val();
  const category = $('#categoryFilter').val();
  const dateRange = $('#dateRangeFilter').val();
  const search = $('#searchFilter').val();

  let url = `${HOST}?getSchoolFacilities=1&enumerator_id=${userInfo2.id}`;
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
      if (data.status === 1 && data.facilities) {
        const facilities = data.facilities;

        // Map facilities and merge type_data dynamically
        const exportData = facilities.map(facility => {
          // Base fields
          let row = {
            "Enumeration ID": facility.enumeration_id,
            "Payer User ID": facility.payer_user_id,
            "School Name": facility.first_name,
            "Facility Type": facility.facility_type,
            "CAC/RC Number": facility.cac_rc_number,
            "Ownership Type": facility.ownership_type,
            "License Number": facility.license_number,
            "License Expiry": facility.license_expiry,
            "Date Established": facility.date_established,
            "Email": facility.email,
            "Phone": facility.phone,
            "State": facility.state,
            "LGA": facility.lga,
            "Address": facility.address,
            "TIN": facility.tin,
            "TIN Response": facility.tin_response,
            "Liabilities": facility.liabilities,
            "Enumerator ID": facility.enumerator_id,
            "Category": facility.category,
            "Industry": facility.industry,
            "Postal Code": facility.postal_code
          };

          // Add school-specific operational data
          if (facility.type_data) {
            row["Number of Staff"] = facility.type_data.number_of_staff || '0';
            row["Avg New Intakes per Session"] = facility.type_data.avg_new_intakes_per_session || '0';
            row["Avg Number of Students"] = facility.type_data.avg_number_of_students || '0';
          }

          // Add representative info
          row["Rep First Name"] = facility.rep_firstname;
          row["Rep Surname"] = facility.rep_surname;
          row["Rep Email"] = facility.rep_email;
          row["Rep Phone"] = facility.rep_phone;
          row["Rep Position"] = facility.rep_position;
          row["Rep State"] = facility.rep_state;
          row["Rep LGA"] = facility.rep_lga;
          row["Rep Address"] = facility.rep_address;

          // Add branch info if available
          if (facility.facility_branches && facility.facility_branches.length > 0) {
            const branch = facility.facility_branches[0]; // First branch
            row["Branch Name"] = branch.branch_name;
            row["Branch Address"] = branch.physical_address;
            row["Branch City"] = branch.city;
            row["Branch LGA"] = branch.lga;
            row["Branch Phone"] = branch.phone_numbers;
            row["Branch Email"] = branch.email;
            row["Branch Website"] = branch.website;
          }

          return row;
        });

        // Convert to Excel or CSV
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Schools");

        const fileExtension = format === 'csv' ? 'csv' : 'xlsx';
        const bookType = format === 'csv' ? 'csv' : 'xlsx';
        const fileName = `Schools_Export_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;

        XLSX.writeFile(wb, fileName, { bookType });

        Swal.fire({
          title: 'Export Successful',
          text: `School facilities data has been exported as ${format.toUpperCase()}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'No Data',
          text: 'No school facilities found to export',
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