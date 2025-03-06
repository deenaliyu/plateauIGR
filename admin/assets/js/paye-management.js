const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('type');

$("#pageName").html(category === "private" ? 'Private PAYE (PIT)' : 'Public PAYE')

$("#bodyDrop").attr("href", `body-registration.html?type=${category}`)

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 0,
  });
}

async function fetchPayeUsers() {

  const response = await fetch(`${HOST}/?getSpecialUsers`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

  } else {

    let theRightUSers = specialUsers.message.reverse().filter(rihuser => rihuser.category.toLowerCase() === category)

    theRightUSers.forEach((rhUser, i) => {
      let annual = parseFloat(rhUser.monthly_estimate * 12)
      let monthly = parseFloat(rhUser.monthly_estimate)

      let htmlData = ""

      htmlData = `
        <tr>
          <td>${i + 1}</td>
          <td><a class="textPrimary" href="payedetails.html?payerID=${rhUser.payer_id}&fullname=${rhUser.name}">${rhUser.payer_id}</a></td>
          <td>${rhUser.name}</td>
          <td>${rhUser.category}</td>
          <td>${rhUser.staff_quota}</td>
          <td>${formatMoney(annual)}</td>
          <td>${formatMoney(monthly)}</td>
          <td>${formatMoney(parseFloat(rhUser.total_remittance))}</td>
          <td>${rhUser.status === 'defaulter' ? '<span class="badge bg-danger rounded-pill">Defaulter</span>' : '<span class="badge bg-success rounded-pill">Current</span>'}</td>
          <td>${rhUser.last_payment ? rhUser.last_payment.split(' ')[0] : '-'}</td>
          <td><a href="payedetails.html?payerID=${rhUser.payer_id}" class="btn btn-sm button-3">View</a></td>
        </tr>
      `

      $("#payeMTabAll").append(htmlData)
    });



  }

}

fetchPayeUsers().then(e => {
  $('#dataTable').DataTable();
})


async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getSpecialUsersDash1&category=${category}`)
  const getDashData = await response.json()


  if (getDashData.status === 0) {
    // $('#dataTable').DataTable();

  } else {
    let dashData = getDashData.message[0]

    $("#reg_bodies").html(dashData.Total_Special_Users)
    $("#reg_staffs").html(dashData.Total_Staff)

  }

}

getSpecialUsersDash1()


async function getSpecialUsersDashAnnualEstimate(year) {
  $("#annEstimate").html('-')

  const response = await fetch(`${HOST}/?getSpecialUsersDashAnnualEstimate&year=${year}`)
  const getDashData = await response.json()

  if (getDashData.status === 0) {
    $("#annEstimate").html(0)

  } else {
    let dashData = getDashData.message[0]
    $("#annEstimate").html(formatMoney(parseInt(dashData.Total_Annual_Estimate)))

    // $("#monthlyEstimate").html(formatMoney(parseInt(dashData.Total_Annual_Estimate / 12)))
  }

}

$(document).ready(function () {
  let yearr = new Date().getFullYear()

  getSpecialUsersDashAnnualEstimate(yearr)
  getSpecialUsersDashMonthlyEstimate(yearr)
});

$('#selYear').on('change', function () {
  let value = $(this).val()

  getSpecialUsersDashAnnualEstimate(value)

})

let finalJson = {}

async function getSpecialUsersDashMonthlyEstimate(year) {
  $("#annEstimate").html('-')

  const response = await fetch(`${HOST}/?getSpecialUsersDashMonthlyEstimate&year=${year}`)
  const getDashData = await response.json()

  if (getDashData.status === 0) {
    $("#monthlyEstimate").html(0)

  } else {
    populateSelect(getDashData.message)

    finalJson = getDashData.message

    setTimeout(() => {
      displayEstimate()
    }, 1000);

  }

}

function getAbbreviatedMonthName(monthValue) {
  var date = new Date(monthValue + "-01");
  return date.toLocaleString('default', { month: 'short' });
}

function populateSelect(jsonData) {
  var select = $("#monthSelect");
  $.each(jsonData, function (index, item) {
    var monthAbbreviation = getAbbreviatedMonthName(item.Year_Month);
    select.append($("<option>").val(item.Year_Month).text(monthAbbreviation));
  });
}

function displayEstimate() {
  var selectedMonth = $("#monthSelect").val();
  var selectedEstimate = finalJson.find(item => item.Year_Month === selectedMonth).Total_Monthly_Estimate;
  $("#monthlyEstimate").text(formatMoney(parseFloat(selectedEstimate)));
}