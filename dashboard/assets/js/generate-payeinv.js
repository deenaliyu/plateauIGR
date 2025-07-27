let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));

function selectAll(eee) {

  const checkboxes = document.querySelectorAll('.taxChecks');

  checkboxes.forEach(checkbox => {
    checkbox.checked = eee.checked;
  });

}

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 0,
  });
}

async function generatePayeinv() {

  const response = await fetch(`${HOST}/?getSpecialUsersEmplyees&payer_id=${userInfo.tax_number}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();

  } else {

    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#stafflistTable").append(`
        <tr>
          <td><input class="form-check-input taxChecks" data-amount="${rhUser.monthly}" type="checkbox" value="" onchange="checkTax(this)"></td>
          <td>${i + 1}</td>
          <td>${rhUser.payer_id}</td>
          <td>${rhUser.fullname}</td>
          <td>${formatMoney(parseInt(rhUser.annual_gross_income))}</td>
          <td>${formatMoney(parseInt(rhUser.basic_salary))}</td>
          <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly))}</td>

        </tr>
        `)
    });



  }

}

generatePayeinv()


function generateInv(amount) {
  Swal.fire({
    title: "Generating Invoice",
    icon: "info",
    backdrop: true,
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "Generate Invoice",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const response = await fetch(
          `${HOST}?generateSingleInvoices&tax_number=${userInfo.tax_number}&price=${amount}&revenue_head_id=1359`
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return await response.json();
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    console.log(result.value);
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully !`,
        confirmButtonText: "Open Invoice",
      }).then((result3) => {
        if (result.isConfirmed) {
          window.location.href = `../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`;
        }
      });
    }
  });

}

$("#generating_inv").on("click", function () {
  let allSelected = document.querySelectorAll(".taxChecks");

  // let  = document.querySelectorAll(".")
  let theArray = [];
  allSelected.forEach((slt) => {
    if (slt.checked) {
      theArray.push(parseFloat(slt.dataset.amount));
      // console.log(slt)
    }
  });
  // console.log()

  // console.log(theArray)
  generateInv(sumArray(theArray));
});


function checkTax(input) {
  let selectedCheck = document.querySelector(".taxChecks:checked");
  if (selectedCheck) {
    // showButton
    $("#generating_inv").removeClass("hidden");
  } else {
    // hideButton
    $("#generating_inv").addClass("hidden");
  }
}

function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}