function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

let AllInvoiceData = {}

async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");


  const response = await fetch(`${HOST}?AllDueInvoice`);
  const userInvoices = await response.json();


  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    AllInvoiceData = userInvoices.message

    displayData(userInvoices.message.reverse())
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
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
            <td>${userInvoice.office_name}</td>
            <td>${userInvoice.invoice_number}</td>
            <td>&#8358; ${parseFloat(userInvoice.amount_paid).toLocaleString()}</td>
            <td>${userInvoice.date_created.split(" ")[0]}</td>
            <td>${userInvoice.due_date}</td>
              `
    if (userInvoice.payment_status === "paid") {
      addd += `
                <td id="" class="checking">
                  <p class='text-success'>${userInvoice.payment_status}</p>
                </td>
                
                `
    } else {
      addd += `
                <td id="" class="checking">
                  <p class='text-danger'>${userInvoice.payment_status}</p>
                </td>
                `
    }

    addd += `
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
                <td>${userInvoice.first_name.replace(/,/g, '')} ${userInvoice.surname.replace(/,/g, '')}</td>
                <td>${userInvoice.office_name}</td>
                <td>${userInvoice.invoice_number}</td>
                <td>&#8358; ${userInvoice.amount_paid}</td>
                <td>${userInvoice.date_created.split(" ")[0]}</td>
                <td>${userInvoice.due_date}</td>
                <td>${userInvoice.payment_status}</td>
            </tr>
          `)
  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

function convertToTwoDigitsEx(number) {
  // Using padStart to add a leading zero if needed
  return String(number).padStart(2, '0');
}

function sortByDateDescendingExpired(data) {
  return data.sort((a, b) => new Date(b.month) - new Date(a.month));
}

function getMonthNameEx(monthValue) {
  const [year, month] = monthValue.split('-');
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}


function getYearEx(monthValue) {
  return monthValue.split('-')[0];
}

function filterByMonthEx(monthsArray, targetMonth) {
  const result = monthsArray.find(monthData => monthData.month === targetMonth);
  return result ? result.total_expired_revenue : 0;
}

var ThecurrentDateEx = new Date();
var theCurrentYearEx = ThecurrentDateEx.getFullYear();
var theCurrentMonthEx = ThecurrentDateEx.getMonth() + 1;

let allExpectedRevenueDataEx = []

function refreshTheMonth1() {
  let theMonth = document.querySelector("#theMonth1").value

  let genAmount = filterByMonthEx(allExpectedRevenueDataEx, theMonth)
  $("#total_amount_invoicedE").html(formatMoney(genAmount))
}


async function totalExpiredInvoiceAmount() {
  $("#total_amount_invoicedE").html(`
          <div class="flex mb-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
      `)

  try {
    const response = await fetch(`${HOST}?getFilteredInv&sort=expired`);
    const userAnalytics = await response.json();

    // console.log(userAnalytics)
    if (userAnalytics.status === 0) {
      $("#total_amount_invoicedE").html(0)
    } else {
      allExpectedRevenueDataEx = userAnalytics.message
      const monthSelector = document.getElementById('theMonth1');

      let theSortedData = sortByDateDescendingExpired(userAnalytics.message)

      for (const monthData of theSortedData) {
        const option = document.createElement('option');
        const monthValue = monthData.month;
        const displayText = `${getMonthNameEx(monthValue)} ${getYearEx(monthValue)}`;

        option.value = monthValue;
        option.text = displayText;

        // Set the default selected option to the current month and year
        if (monthValue === `${theCurrentYearEx}-${theCurrentMonthEx}`) {
          option.selected = true;
        }

        monthSelector.add(option);
      }


      let theAmountGen = filterByMonthEx(theSortedData, `${theCurrentYearEx}-${convertToTwoDigitsEx(theCurrentMonthEx)}`)
      // console.log(theAmountGen, theCurrentYearEx, theCurrentMonthEx)
      $("#total_amount_invoicedE").html(formatMoney(theAmountGen))
    }



  } catch (error) {
    console.log(error)
    $("#total_amount_invoicedE").html(0)
  }
}

totalExpiredInvoiceAmount()

// EXPIRED COUNT

let allExpectedRevenueDataEx2 = []

function refreshTheMonth2() {
  let theMonth = document.querySelector("#theMonth2").value

  let genAmount = filterByMonthEx(allExpectedRevenueDataEx2, theMonth)
  $("#totalInvE").html(genAmount)
}


async function totalExpiredInvoiceCount() {
  $("#totalInvE").html(`
          <div class="flex mb-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
      `)

  try {
    const response = await fetch(`${HOST}?getFilteredInv`);
    const userAnalytics = await response.json();

    // console.log(userAnalytics)
    if (userAnalytics.status === 0) {
      $("#totalInvE").html(0)
    } else {
      allExpectedRevenueDataEx2 = userAnalytics.message
      const monthSelector = document.getElementById('theMonth2');

      let theSortedData = sortByDateDescendingExpired(userAnalytics.message)

      for (const monthData of theSortedData) {
        const option = document.createElement('option');
        const monthValue = monthData.month;
        const displayText = `${getMonthNameEx(monthValue)} ${getYearEx(monthValue)}`;

        option.value = monthValue;
        option.text = displayText;

        // Set the default selected option to the current month and year
        if (monthValue === `${theCurrentYearEx}-${theCurrentMonthEx}`) {
          option.selected = true;
        }

        monthSelector.add(option);
      }


      let theAmountGen = filterByMonthEx(theSortedData, `${theCurrentYearEx}-${convertToTwoDigitsEx(theCurrentMonthEx)}`)
      $("#totalInvE").html(theAmountGen)
    }



  } catch (error) {
    console.log(error)
    $("#totalInvE").html(0)
  }
}

totalExpiredInvoiceCount()
