$(document).ready(function () {
  fetchAuditTrail()
});

function fetchAuditTrail() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }

  const userCategory = $('#filterByCategory').val();
  const timeInFrom = $('#filterDfrom').val();
  const timeInTo = $('#filterDto').val();

  table = $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    searching: false,  // Enable search box
    pageLength: 50,   // Number of items per page
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        getAllActivityLogs: true,
        page: pageNumber,
        limit: data.length,
        user_category: userCategory,
        timeIn_from: timeInFrom,
        timeIn_to: timeInTo,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.total, // Total records in your database
            recordsFiltered: response.total, // Filtered records count
            data: response.data, // The actual data array from your API
          });
        },
        error: function () {
          alert('Failed to fetch data.');
        },
      });
    },
    columns: [
      {
        data: null,
        orderable: false, // Disable ordering for the numbering column
        render: function (data, type, row, meta) {
          // Calculate the row number based on the page
          return meta.row + 1 + meta.settings._iDisplayStart;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `Name`;
        }
      },
      { data: 'user_category' },
      { data: 'comment' },
      {
        data: null,
        render: function (data, type, row) {
          return `<span class="badge bg-success">success</span>`;
        }
      },
      { data: 'timeIn' },
      {
        data: null,
        render: function (data, type, row) {
          return `<button 
          data-bs-toggle="modal" 
          onclick="viewActii('${row.timeIn}', '${row.comment}','first Name', '${row.user_category}','Surname', '${row.session_id}',  '${row.ip_address}')" 
          data-bs-target="#viewActivity" 
          class="btn btn-primary btn-sm">View Activities</button>`;
        }
      },
    ],
  });
}

$('#filterBtn').on('click', function () {
  fetchAuditTrail();
});

async function fetchActivityMetrics() {
  try {
    const response = await fetch('https://plateauigr.com/php/index.php?getActivityMetrics');
    const data = await response.json();

    if (data.status === 1) {
      const metrics = data.data;

      document.getElementById('totalRegis').innerText = metrics.total_activities || '-';
      document.getElementById('totalRegCateg').innerText = metrics.total_user_logins || '-';
      document.getElementById('totalRegCategRege').innerText = metrics.total_errors || '-';

      document.querySelector('.total-activities-count').innerText = Number(metrics.total_activities).toLocaleString() || '0';
      document.querySelector('.user-activities-count').innerText = Number(metrics.payer_user_activities).toLocaleString() || '0';
      document.querySelector('.admin-activities-count').innerText = Number(metrics.admin_user_activities).toLocaleString() || '0';
    }
  } catch (error) {
    console.error('Error fetching activity metrics:', error);
  }
}



function setCurrentMonth() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const currentYearMonth = `${today.getFullYear()}-${formattedMonth}`;
  document.getElementById('categgg2').value = currentYearMonth;
  document.getElementById('categgg3').value = currentYearMonth;
  document.getElementById('categgg').value = currentYearMonth;
}

fetchActivityMetrics()
setCurrentMonth()

function viewActii(timeIn, comment, first_name, user_category, surname, session_id, ip_address) {
  let names = first_name + " " + surname;
  $("#theRe").html(comment)
  $("#time").html(timeIn)
  $("#theName2").html(names)
  $("#theEm").html(user_category)
  $("#thess").html(session_id)
  $("#theip").html(ip_address)

}