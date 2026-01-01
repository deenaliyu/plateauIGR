let download_link = null;

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function showSpinner(elementId) {
  $(`#${elementId}`).html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
}

function getFormattedDate(date) {
  date = new Date(date)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Get current month and year in YYYY-MM format
function getCurrentMonthYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return { year, month, formatted: `${year}-${month}` };
}

// Initialize month filter with current month/year
$(document).ready(function () {
  const current = getCurrentMonthYear();
  $("#globalMonthFilter").val(current.formatted);

  // Add event listener for month filter change
  $("#globalMonthFilter").on("change", function () {
    const selectedValue = $(this).val();
    if (selectedValue) {
      const [year, month] = selectedValue.split("-");
      // Fetch both with selected month/year
      fetchInvoice(month, year);
      fetchAnalytics(month, year);
    }
  });
});

let AllInvoiceData = {}

function fetchInvoice(month = null, year = null) {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  $('#showThem').empty();

  $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    pageLength: 50,   // Number of items per page
    searchDelay: 1500,
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      // Build request data
      const requestData = {
        fetchAllPayment: true,
        page: pageNumber,
        limit: data.length,
        search: data.search.value,
        revenue_head: $('#listOfpayable').val(),
        mda_id: $('#getMDAs').val(),
        payment_channel: $('#listOfchannel').val(),
        payment_gateway: $('#paymentGateway').val(),
        payment_method: $('#paymentMethod').val(),
        start_date: $('#fromDateInput').val(),
        end_date: $('#toDateInput').val(),
      };

      // Add month/year if provided
      if (month && year) {
        requestData.month = month;
        requestData.year = year;
      }

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: requestData,
        success: function (response) {
          // Map the API response to DataTables expected format
          download_link = response.download_link;
          if (response.status === 1) {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.filtered_total_records, // Total records in your database
              recordsFiltered: response.filtered_total_records, // Filtered records count
              data: response.data, // The actual data array from your API
            });
          } else {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: 0, // Total records in your database
              recordsFiltered: 0, // Filtered records count
              data: [], // The actual data array from your API
            });
          }
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
      { data: 'MDA ID' },
      { data: 'Revenue Head' },
      { data: 'Payer Name' },
      { data: 'Tax Number' },
      { data: 'Payer TIN' },
      {
        data: 'Sector',
        render: function (data, type, row) {
          return data || 'N/A';
        }
      },
      {
        data: 'Industry',
        render: function (data, type, row) {
          return data || 'N/A';
        }
      },
      { data: 'Invoice Type' },
      { data: 'Invoice Number' },
      {
        data: 'Amount Paid',
        render: function (data, type, row) {
          return formatMoney(parseFloat(data));
        }
      },
      { data: 'Payment Channel' },
      { data: 'Payment Method' },
      { data: 'Payment Bank' },
      { data: 'Payment Reference' },
      { data: 'Receipt Number' },
      { data: 'Payment Date' },
      {
        data: 'Invoice Number',
        render: function (data, type, row) {
          return `<a href="./viewreceipt.html?invnumber=${data}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser">View Receipt</a>`;
        }
      }
    ],
  });
}

$("#filterMdaCollect").on("click", function () {
  // Get current month/year from global filter
  const selectedValue = $("#globalMonthFilter").val();
  let month = null, year = null;
  if (selectedValue) {
    [year, month] = selectedValue.split("-");
  }
  fetchInvoice(month, year);
  fetchAnalytics(month, year);
  $('#filterInvoice').modal('hide');
})


fetchInvoice();

async function fetchAnalytics(month = null, year = null) {
  // Default to current month/year if not provided
  if (!month || !year) {
    const current = getCurrentMonthYear();
    month = current.month;
    year = current.year;
  }

  showSpinner("totalAmountCollected");
  showSpinner("NumberOfTransaction");

  try {
    const response = await fetch(
      `${HOST}/php/index.php?invoiceSummaryTiles&month=${month}&year=${year}`
    );

    const userAnalytics = await response.json();
    const stats = userAnalytics.data;

    console.log(stats)
    $("#totalAmountCollected").html(stats.total_amount_paid.toLocaleString() || 0)
    $("#NumberOfTransaction").html(stats.total_invoice_paid.toLocaleString() || 0)


  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()

function exportData() {
  const $btn = $("#collReportd");
  const originalText = ($btn && $btn.length) ? $btn.text() : null;
  if ($btn && $btn.length) {
    $btn.prop('disabled', true).text('Preparing download...');
  }

  // Get current month/year from global filter
  const selectedValue = $("#globalMonthFilter").val();
  let requestData = {
    fetchAllPayment: true,
    export: 'csv',
    revenue_head: $('#listOfpayable').val(),
    mda_id: $('#getMDAs').val(),
    payment_channel: $('#listOfchannel').val(),
    payment_gateway: $('#paymentGateway').val(),
    payment_method: $('#paymentMethod').val(),
    start_date: $('#fromDateInput').val(),
    end_date: $('#toDateInput').val(),
  };

  // Add month/year if filter has been changed (not default)
  if (selectedValue) {
    const [year, month] = selectedValue.split("-");
    requestData.month = month;
    requestData.year = year;
  }

  $.ajax({
    url: HOST,
    type: 'GET',
    data: requestData,
    success: function (response) {
      download_link = response.download_link;
      if (download_link) {
        // trigger download
        window.location.href = download_link;
      } else {
        alert('No download link available.');
      }
    },
    error: function () {
      alert('Failed to prepare download.');
    },
    complete: function () {
      if ($btn && $btn.length && originalText !== null) {
        $btn.prop('disabled', false).text(originalText);
      }
    }
  });
}