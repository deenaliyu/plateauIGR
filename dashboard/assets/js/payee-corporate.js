

async function getStaffLists() {

  const response = await fetch(`${HOST}/?getSpecialUsersEmplyees&payer_id=PL-PAYE-3978265401`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

    $('#noUsers').removeClass("hidden")


  } else {
    $('#yesUsers').removeClass("hidden")


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
  $('#dataTable').DataTable();
})
