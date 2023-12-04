const urlParams = new URLSearchParams(window.location.search);
const payerID = urlParams.get('payerID');
const fullname = urlParams.get('fullname');

$("#payeName").html(fullname)
$("#payeID").html(payerID)

async function fetchPayeUser() {

  const response = await fetch(`${HOST}/?getSpecialUsers&id=${payerID}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {

  } else {

    let theInfo = specialUsers.message[0]

    $("#contactSection").html(`
      <p class="text-sm mb-2"><span class="fontBold">Email Address: </span> ${theInfo.email}</p>
      <p class="text-sm mb-2"><span class="fontBold">Contact: </span> ${theInfo.phone}</p>
      <p class="text-sm mb-2"><span class="fontBold">Address: </span> ${theInfo.address}</p>
    `)

    $("#reg_staff").html(theInfo.staff_quota)
    $("#month_remm").html(theInfo.monthly_estimate)

  }

}

fetchPayeUser()

async function getStaffLists() {

  const response = await fetch(`${HOST}/?getSpecialUsersEmplyees&payer_id=${payerID}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

  } else {
    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#stafflistTable").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${rhUser.payer_id}</td>
            <td>${rhUser.fullname}</td>
            <td>${rhUser.annual_gross_income}</td>
            <td>&#8358; ${rhUser.basic_salary}</td>
            <td>&#8358; 2,400,000</td>
            <td>&#8358; 24,000,000</td>
            <td>${rhUser.timeIn}</td>
            <td>&#8358; 24,000,000</td>
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

getStaffLists().then(tt => {
  // $('#dataTable').DataTable();
})

