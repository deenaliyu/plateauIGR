const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('type');

async function fetchPayeUsers() {

  const response = await fetch(`${HOST}/?getSpecialUsers`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

  } else {

    let theRightUSers = specialUsers.message.reverse().filter(rihuser => rihuser.category.toLowerCase() === category)

    theRightUSers.forEach((rhUser, i) => {
      let annual = rhUser.annual_estimate
      let monthly = rhUser.monthly_estimate

      let htmlData = ""

      htmlData = `
        <tr>
          <td>${i + 1}</td>
          <td><a class="textPrimary" href="payedetails.html?payerID=${rhUser.payer_id}&fullname=${rhUser.name}">${rhUser.payer_id}</a></td>
          <td>${rhUser.name}</td>
          <td>${rhUser.category}</td>
          <td>${rhUser.staff_quota}</td>
          <td>&#8358; ${annual.toLocaleString("en-US")}</td>
          <td>&#8358; ${monthly.toLocaleString("en-US")}</td>
          <td>&#8358; 24,000,000</td>
          <td><span class="badge bg-danger rounded-pill">Defaulter</span></td>
          <td><a href="payedetails.html?payerID=${rhUser.payer_id}&fullname=${rhUser.name}" class="btn btn-sm button-3">View</a></td>
        </tr>
      `

      $("#payeMTabAll").append(htmlData)
    });

   

  }

}

fetchPayeUsers()