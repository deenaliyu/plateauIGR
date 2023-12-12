const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('type');

$("#pageName").html(category === "private" ? 'Private PAYE (PIT)' : 'Public PAYE')

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
      let annual = parseFloat(rhUser.annual_estimate)
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
          <td>&#8358; 24,000,000</td>
          <td><span class="badge bg-danger rounded-pill">Defaulter</span></td>
          <td><a href="payedetails.html?payerID=${rhUser.payer_id}" class="btn btn-sm button-3">View</a></td>
        </tr>
      `

      $("#payeMTabAll").append(htmlData)
    });



  }

}

fetchPayeUsers()


async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getSpecialUsersDash1`)
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


