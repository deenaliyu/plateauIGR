function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

let AllDemanData = {}
let dataToExport;

const the_sectors = [
  "Construction Sector",
  "Education Sector",
  "Agricultural Sector",
  "Financial Institutions",
  "Health Sector",
  "Hospitality Sector",
  "ICT Sector",
  "Oil and Gas Sector",
]

the_sectors.forEach((sect) => {
  $('#sectorSelect').append(`
    <option value='${sect}'>${sect}</option>  
  `)
})

async function fetchInvoice() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().clear().destroy();
  }


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
        getAllDemandNotice: true,
        page: pageNumber,
        limit: data.length,
        sector: $('#sectorSelect').val(),
        invoice_number: $('#invnumberInput').val(),
        payment_status: $('#paymentStatusSelect').val(),
        date_from: $('#fromDateInput').val(),
        date_to: $('#toDateInput').val()
      };

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: filters,
        success: function (response) {
          // Map the API response to DataTables expected format
          dataToExport = response.data
          $("#totalInv").html(response.total)
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
      { data: 'tax_number' },
      // { data: 'COL_3' },
      // { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return row.first_name + " " + row.surname;
        }
      },
      { data: 'invoice_number' },
      {
        data: null,
        render: function (data, type, row) {
          return formatMoney(row.total_amount_paid);
        }
      },
      { data: 'admin_email' },
      { data: 'sector' },
      { data: 'date_created' },
      { data: 'due_date' },
      {
        data: null,
        render: function (data, type, row) {
          return row.payment_status === "paid" ? `<span class="badge bg-success">Paid</span>` : `<span class="badge bg-danger">Unpaid</span>`;
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return `<a href="./viewdemand.html?invnumber=${row.invoice_number}&load=true" class="btn btn-primary btn-sm viewUser">View CDM/Invoice</a>`;
        }
      },
    ],
  });

}

fetchInvoice()


$("#filterDemand").on('click', function () {
  $("#filterInvoice").modal('hide')
  fetchInvoice()
})

function clearfilter3() {
  $('#sectorSelect').val('')
  $('#invnumberInput').val('')
  $('#paymentStatusSelect').val('')
  $('#fromDateInput').val('')
  $('#toDateInput').val('')

  $('#filterInvoice').modal('hide')
  fetchInvoice()
}

async function fetchAnalytics() {
  try {
    const response = await fetch(
      `${HOST}/php/index.php?dashboardAnalyticsAdminDemandNotice`
    );

    const userAnalytics = await response.json();

    // $("#totalInv").html(userAnalytics.total_invoice)
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())
    $("#total_amountU").html(userAnalytics.due_amount.toLocaleString())

    // let total = (userAnalytics.total_amount_paid / userAnalytics.total_amount_invoiced) * 100
    // $("#Compliance").html(total + "%")
    // console.log(userAnalytics)
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()

async function exportData() {
  try {
    // Show loading indicator
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = 'Downloading...';
    exportBtn.disabled = true;

    // Fetch all data without pagination
    const filters = {
      getAllDemandNotice: true,
      page: 1,
      limit: 1000000, // Large number to get all records
      sector: $('#sectorSelect').val(),
      invoice_number: $('#invnumberInput').val(),
      payment_status: $('#paymentStatusSelect').val(),
      date_from: $('#fromDateInput').val(),
      date_to: $('#toDateInput').val()
    };

    const response = await fetch(`${HOST}?${new URLSearchParams(filters).toString()}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      alert('No data to export');
      exportBtn.innerHTML = originalText;
      exportBtn.disabled = false;
      return;
    }

    const csvRows = [];
    // Extract headers (keys) excluding 'id'
    const headers = Object.keys(data.data[0]).filter((key) => key !== "id");
    csvRows.push(headers.join(","));

    // Loop through the data to create CSV rows
    for (const row of data.data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Handle values that might contain commas
        const escapedValue = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        return escapedValue;
      });
      csvRows.push(values.join(","));
    }

    // Combine all rows into a single string
    const csvString = csvRows.join("\n");

    // Export to a downloadable file
    const blob = new Blob([csvString], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "demand_notice_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Restore button text
    exportBtn.innerHTML = originalText;
    exportBtn.disabled = false;
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');

    // Restore button text in case of error
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.innerHTML = 'Export to CSV';
    exportBtn.disabled = false;
  }
}