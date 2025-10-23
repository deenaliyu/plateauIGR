function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function getFormattedDate(date) {
  date = new Date(date)    
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

let AllInvoiceData = {}

function fetchInvoice() {
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  // $('#dataTable').empty(); 

  $('#dataTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    pageLength: 50,   // Number of items per page
    searchDelay: 1500,
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      // Call your API with the calculated page number
      $.ajax({
        url: HOST,
        type: 'GET',
        data: {
          fetchAllPayment: true,
          page: pageNumber,
          limit: data.length,
          search: data.search.value,
          
        },
        success: function (response) {
          // Map the API response to DataTables expected format
          if (response.status === 1) {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.total_records, // Total records in your database
              recordsFiltered: response.total_records, // Filtered records count
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
      { data: 'mda_id' },
      { data: 'COL_4' },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname === '?' ? '' : row.surname}`;
        }
      },
      { data: 'tax_number' },
      { data: 'tin' },
      { data: 'industry' },
      { data: 'invoice_type' },
      { data: 'invoice_number' },
      {
        data: 'amount_paid',
        render: function (data, type, row) {
          return formatMoney(parseFloat(data));
        }
      },
      { data: 'payment_channel' },
      { data: 'payment_method' },
      { data: 'payment_bank' },
      { data: 'payment_reference_number' },
      { data: 'invoice_number' },
      { data: 'timeIn' },
      {
        data: 'invoice_number',
        render: function (data, type, row) {
          return `<a href="./viewreceipt.html?invnumber=${data}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser">View Receipt</a>`;
        }
      }
    ],
  });
}


function displayData(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.tin}</td>
        <td>${userInvoice.business_type}</td>
          <td>${userInvoice.industry}</td>
        <td>${userInvoice.invoice_type}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${formatMoney(parseFloat(userInvoice.amount_paid))}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_method}</td>
        <td>${userInvoice.payment_bank}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${getFormattedDate(userInvoice.timeIn)}</td>
        
          `
    addd += `
      <td>
      <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
    </td> 
        </tr>
        `
    $("#showThem").append(addd);
    $("#showThem2").append(`
      <tr class="relative">
          <td>${i + 1}</td>
          <td>${userInvoice.mda_id.replace(/,/g, '')}</td>
          <td>${userInvoice.COL_4.replace(/,/g, '')}</td>
          <td>${userInvoice.first_name?.replace(/,/g, '')} ${userInvoice.surname?.replace(/,/g, '')}</td>
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.tin}</td>
          <td>${userInvoice.business_type}</td>
          <td>${userInvoice.industry}</td>
          <td>${userInvoice.invoice_type}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${(parseFloat(userInvoice.amount_paid))}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>${userInvoice.payment_method}</td>
          <td>${userInvoice.payment_bank}</td>
          <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${getFormattedDate(userInvoice.timeIn)}</td>
      </tr>
    `)
  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

