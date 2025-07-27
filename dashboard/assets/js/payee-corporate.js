let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
let dataToExport;

async function getStaffLists() {

  const response = await fetch(`${HOST}/?getSpecialUsersEmplyees&payer_id=${userInfo.tax_number}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

    $('#noUsers').removeClass("hidden")


  } else {
    $('#yesUsers').removeClass("hidden")

    $("#reg_staffs").html(specialUsers.message.length)

    dataToExport = specialUsers.message.reverse()
    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#stafflistTable").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${rhUser.payer_id}</td>
          <td>${rhUser.fullname}</td>
          <td>${formatMoney(parseInt(rhUser.annual_gross_income))}</td>
          <td>${formatMoney(parseInt(rhUser.basic_salary))}</td>
          <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly * 12))}</td>
          <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly))}</td>
          <td>${rhUser.timeIn}</td>
          <!-- <td>&#8358; 24,000,000</td> -->
          <td>
            <div class="flex items-center gap-2">
              <button><iconify-icon class="fontBold text-lg"
                  icon="basil:edit-outline"></iconify-icon></button>
              <button><iconify-icon class="fontBold text-lg"
                  icon="fluent:delete-24-regular"></iconify-icon></button>
            </div>
          </td>
        </tr>
        `)
    });
  }
}

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 0,
  });
}

getStaffLists().then(tt => {
  $('#dataTable').DataTable();
})

async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getSpecialUsersDash1&payer_id=${userInfo.tax_number}`)
  const getDashData = await response.json()


  if (getDashData.status === 0) {
    // $('#dataTable').DataTable();

  } else {
    let dashData = getDashData.message[0]

    $("#reg_bodies").html(dashData.Total_Special_Users)


  }

}

getSpecialUsersDash1()

async function fetchPayeUser() {
  const response = await fetch(`${HOST}/?getSpecialUsers&id=${userInfo.tax_number}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {

  } else {

    let theInfo = specialUsers.message[0]

    // $("#reg_staff").html(theInfo.staff_quota)
    $("#total_remitance").html(theInfo.total_remittance ? formatMoney(parseFloat(theInfo.total_remittance)) : formatMoney(0))

  }

}

fetchPayeUser()




async function getSpecialUsersDashAnnualEstimate(year) {
  $("#annEstimate").html('-')

  const response = await fetch(`${HOST}/?getSpecialUsersDashAnnualEstimate&year=${year}&payer_id=${userInfo.tax_number}`)
  const getDashData = await response.json()

  if (getDashData.status === 0) {
    $("#annEstimate").html(0)

  } else {
    let dashData = getDashData.message[0]
    $("#annEstimate").html(formatMoney(parseInt(dashData.Total_Annual_Estimate)))
  }

}

$(document).ready(function () {
  let yearr = new Date().getFullYear()

  getSpecialUsersDashAnnualEstimate(yearr)
});

$('#selYear').on('change', function () {
  let value = $(this).val()

  getSpecialUsersDashAnnualEstimate(value)

})



async function getPaymentHistory() {

  const response = await fetch(`${HOST}/?getSpecialUsersPayments&offset=0&payer_id=${userInfo.tax_number}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

  } else {
    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#paymentHistoryTable").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${rhUser.payment_reference_number}</td>
            <td>Pay as you Earn(PAYE)</td>
            <td>${getMonthInWordFromDate(rhUser.timeIn)}</td>
            <td>&#8358; ${rhUser.amount_paid}</td>
            <td>${rhUser.payment_channel}</td>
            <td>${rhUser.timeIn}</td>
            <td><span class="badge bg-success rounded-pill">paid</span></td>
            <td>
              <div class="flex gap-2">
                <a href="../viewreceipt.html?invnumber=${rhUser.invoice_number}&load=true" class="button">view receipt</a>
                <button class="button" onclick="fetchTheStaffs('${rhUser.invoice_number}')">View Staffs</button>
              </div>
            </td>
          </tr>

      `)
    });
  }
}

getPaymentHistory().then(tt => {
  $('#dataTable2').DataTable();
})

async function getInvoiceHistory() {

  const response = await fetch(`${HOST}/?userInvoices&payer_id=${userInfo.tax_number}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable3').DataTable();

  } else {
    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#invoiceHistoryTable").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${rhUser.payer_id}</td>
            <td>${rhUser.invoice_number}</td>
            <td>${rhUser.COL_4}</td>
            <td>${rhUser.amount_paid}</td>
            <td>${rhUser.amount_paid}</td>
            <td>${rhUser.date_created.split(' ')[0]}</td>
            <td>${rhUser["due_date"]}</td>
            <td>${rhUser.status === "paid" ? `<span class='badge bg-success'>Paid</span>` : `<span class='badge bg-danger'>Un-paid</span>`}</td>
            <td>
              <div class="flex gap-2">
                <a href="../viewinvoice.html?invnumber=${rhUser.invoice_number}&load=true" class="button">View</a>
                <button class="button" onclick="fetchTheStaffs('${rhUser.invoice_number}')">View Staffs</button>
              </div>
            </td>
            
          </tr>

      `)
    });
  }
}

getInvoiceHistory().then(tt => {
  $('#dataTable3').DataTable();
})

async function fetchTheStaffs(invNumber) {
  $("#invoiceStaffModal").modal('show')
  $("#staffListInvoices").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  try {
    const response = await fetch(`${HOST}/?getStaffInvoices&invoice_number=${invNumber}`)
    const data = await response.json()

    if (data.status === 0) {
      $('#staffListInvoices').html(`
        <tr colspan="9">
          <td colspan="9"><p class="text-center">No Staff Lists Found</p><td>
        </tr>  
      `);
    } else {
      $("#staffListInvoices").html("")
      data.message.staff_details.forEach((rhUser, i) => {
        $("#staffListInvoices").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${rhUser.payer_id}</td>
            <td>${rhUser.fullname}</td>
            <td>${formatMoney(parseFloat(rhUser.annual_gross_income))}</td>
            <td>${formatMoney(parseInt(rhUser.basic_salary))}</td>
            <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly * 12))}</td>
            <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly))}</td>
            <td>${rhUser.timeIn}</td>
          </tr>
        `)
      })
    }

  } catch (error) {
    console.log(error)
    $('#staffListInvoices').html(`
      <tr colspan="9">
        <td colspan="9"><p class="text-center">No Staff Lists Found</p><td>
      </tr>  
    `);
  }
}

function getMonthInWordFromDate(dateString) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Create a Date object from the input string
  const dateObject = new Date(dateString);

  // Get the month (returns a number from 0 to 11)
  const monthNumber = dateObject.getMonth();

  // Get the month name from the array using the month number
  const monthInWord = months[monthNumber];

  return monthInWord;
}

function exportData() {
  // console.log(dataToExport)
  const csvRows = [];

  // Extract headers (keys) excluding 'id'
  const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop through the data to create CSV rows
  for (const row of dataToExport) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${value}"`; // Escape values with quotes
    });
    csvRows.push(values.join(","));
  }

  // Combine all rows into a single string
  const csvString = csvRows.join("\n");

  // Export to a downloadable file
  const blob = new Blob([csvString], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "staff-list.csv";
  a.click();
}