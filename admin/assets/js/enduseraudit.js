$(document).ready(function () {
  fetchAuditTrail('login');
});

function fetchAuditTrail(categoryType) {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }

  const userCategory = $('#filterByCategory').val();
  const timeInFrom = $('#filterDfrom').val();
  const timeInTo = $('#filterDto').val();

  table = $('#dataTable').DataTable({
    processing: true,
    serverSide: true,
    paging: true,
    searching: false,
    pageLength: 50,
    ajax: function (data, callback) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        getAllActivityLogs: true,
        page: pageNumber,
        limit: data.length,
        user_category: userCategory,
        timeIn_from: timeInFrom,
        timeIn_to: timeInTo,
        category_type: categoryType
      };

      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          callback({
            draw: data.draw,
            recordsTotal: response.total,
            recordsFiltered: response.total,
            data: response.data
          });
        },
        error: function () {
          alert('Failed to fetch data.');
        }
      });
    },
    columns: [
      {
        data: null,
        orderable: false,
        render: function (data, type, row, meta) {
          return meta.row + 1 + meta.settings._iDisplayStart;
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          switch (row.user_category) {
            case 'Payer User': return row.payer_fullname;
            case 'Admin User': return row.admin_fullname;
            case 'Mda User': return row.mda_fullname;
            default: return row.enumerator_fullname;
          }
        }
      },
      { data: 'user_category' },
      { data: 'comment' },
      {
        data: null,
        render: function () {
          return '<span class="badge bg-success">success</span>';
        }
      },
      { data: 'timeIn' },
      {
        data: null,
        render: function (data, type, row) {
          const name = row.payer_fullname || row.admin_fullname || row.mda_fullname || row.enumerator_fullname;
          return `<button data-bs-toggle="modal" onclick="viewActii('${row.timeIn}', '${row.comment}', '${name}', '${row.user_category}', '${row.session_id}', '${row.ip_address}')" data-bs-target="#viewActivity" class="btn btn-primary btn-sm">View Activities</button>`;
        }
      }
    ]
  });
}

$('#filterBtn').on('click', function () {
  fetchAuditTrail('login');
});

async function fetchActivityMetrics() {
  try {
    const response = await fetch(`${HOST}?getActivityMetrics`);
    const data = await response.json();

    if (data.status === 1) {
      const metrics = data.data;

      document.getElementById('totalRegis').innerText = metrics.total_user_logins || '-';
      document.getElementById('totalRegCateg').innerText = metrics.total_change || '-';
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
// setCurrentMonth()

function viewActii(timeIn, comment, first_name, user_category, session_id, ip_address) {
  let names = first_name;
  $("#theRe").html(comment)
  $("#time").html(timeIn)
  $("#theName2").html(names)
  $("#theEm").html(user_category)
  $("#thess").html(session_id)
  $("#theip").html(ip_address)

}