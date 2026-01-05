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
      fetchInvoice(month, year).then(() => {
        $("#dataTable").DataTable();
      });;
      fetchAnalytics(month, year);
    }
  });
});

$("#genInvBtn").on("click", function () {
  window.location.href = `../generateinvoice.html?created_by=admin&id=${userInfo2?.id}`
})

let AllInvoiceData = {}

async function fetchInvoice(month = null, year = null) {

  $("#showThem").html("");
  $("#showThem2").html("");
  $("#loader").css("display", "flex");

  // Destroy existing DataTable if it exists
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };

  // Build URL with optional month/year params
  let url = `${HOST}?AllInvoices`;
  if (month && year) {
    url += `&month=${month}&year=${year}`;
  }

  const response = await fetch(url);
  const userInvoices = await response.json();
  // console.log(userInvoices);

  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    AllInvoiceData = userInvoices.message

    displayData(userInvoices.message)
  } else {
    // $("#showInvoice").html("<tr></tr>");
  }
  $("#dataTable").DataTable();
}

function displayData(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
            <td>${i + 1}</td>
            <td>${userInvoice.tax_number}</td>
            <td>${userInvoice.COL_3}</td>
            <td>${userInvoice.COL_4}</td>
            <td>${userInvoice.first_name} ${userInvoice.surname}</td>
            <td>${userInvoice.invoice_number}</td>
            <td>&#8358; ${parseFloat(userInvoice.amount_paid).toLocaleString()}</td>
            <td id="" class="checking">
              ${userInvoice.payment_status === "paid" ? "<span class='badge bg-success'>Paid</span>" : "<span class='badge bg-danger'>Unpaid</span>"}
            </td>
            <td>${userInvoice.admin_email ? userInvoice.admin_email : "self"}</td>
            <td>${getFormattedDate(userInvoice.date_created)}</td>
            <td>${getFormattedDate(userInvoice.due_date)}</td>
            <td>
              <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
            </td>
        </tr>
        `
    $("#showThem").append(addd);
    $("#showThem2").append(`
        <tr>
            <td>${i + 1}</td>
            <td>${userInvoice.tax_number}</td>
            <td>${userInvoice.COL_3.replace(/,/g, '')}</td>
            <td>${userInvoice.COL_4}</td>
            <td>${userInvoice.first_name.replace(/,/g, '')} ${userInvoice.surname?.replace(/,/g, '')}</td>
            <td>${userInvoice.invoice_number}</td>
            <td>${userInvoice.amount_paid}</td>
            <td>${getFormattedDate(userInvoice.date_created)}</td>
            <td>${getFormattedDate(userInvoice.due_date)}</td>
            <td>${userInvoice.payment_status}</td>
        </tr>
      `)
  });
}

fetchInvoice().then(() => {
  $("#dataTable").DataTable();
});

async function fetchAnalytics(month = null, year = null) {
  // Default to current month/year if not provided
  if (!month || !year) {
    const current = getCurrentMonthYear();
    month = current.month;
    year = current.year;
  }

  showSpinner("totalInv");
  showSpinner("total_amount_invoiced");
  showSpinner("total_amountP");
  showSpinner("total_receiptC");

  try {
    const response = await fetch(
      `${HOST}/php/index.php?invoiceSummaryTiles&month=${month}&year=${year}`
    );

    const userAnalytics = await response.json();
    const stats = userAnalytics.data;

    console.log(stats)
    $("#totalInv").html(stats.total_invoice.toLocaleString() || 0)
    $("#total_amount_invoiced").html(stats.total_amount_invoiced.toLocaleString() || 0)
    $("#total_amountP").html(stats.total_amount_paid.toLocaleString() || 0)
    $("#total_receiptC").html(stats.total_receipt_count || 0)


  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()