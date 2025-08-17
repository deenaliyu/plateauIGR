const urlParams = new URLSearchParams(window.location.search);
const payerID = urlParams.get('payerID');
const fullname = urlParams.get('fullname');

$("#payeID").html(payerID)
let AllEmployees;

let dataToExport;


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

    // $("#reg_staff").html(theInfo.staff_quota)
    $("#month_remm").html(theInfo.total_remittance ? formatMoney(parseFloat(theInfo.total_remittance)) : formatMoney(0))
    $("#payeName").html(theInfo.name)

    $("#pageName").html(theInfo.category === "Private" ? 'Private PAYE (PIT)' : 'Public PAYE')

    let addAStaff = document.querySelector("#addAStaff")
    if (addAStaff) {
      addAStaff.href = `add-employee.html?categ_id=${theInfo.payer_id}`
      addAStaff.classList.remove("hidden")
    }
  }

}

fetchPayeUser()

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

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

async function getStaffLists() {

  const response = await fetch(`${HOST}/?getSpecialUsersEmplyees&payer_id=${payerID}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable').DataTable();
    $("#reg_staff").html(0)
  } else {
    AllEmployees = specialUsers.message
    dataToExport = specialUsers.message
    $("#reg_staff").html(AllEmployees.length)
    specialUsers.message.reverse().forEach((rhUser, i) => {

      $("#stafflistTable").append(`
          <tr>
            <td><input class="form-check-input taxChecks" data-staffid="${rhUser.id}" data-amount="${rhUser.monthly}" type="checkbox" value="" onchange="checkTax(this)"></td>
            <td>${i + 1}</td>
            <td>${rhUser.payer_id}</td>
            <td>${rhUser.fullname}</td>
            <td>${formatMoney(parseFloat(rhUser.annual_gross_income))}</td>
            <td>${formatMoney(parseInt(rhUser.basic_salary))}</td>
            <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly * 12))}</td>
            <td>${rhUser.monthly === "" ? '-' : formatMoney(parseInt(rhUser.monthly))}</td>
            <td>${rhUser.timeIn}</td>
            <td>
              <div class="flex items-center gap-2">
                <button onclick="editMDAFunc(this)" data-revid="${rhUser.id}" data-bs-toggle="modal" data-bs-target="#editStaff"><iconify-icon class="fontBold text-lg"
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

function editMDAFunc(e) {
  let editaID = e.dataset.revid
  // console.log(editaID)
  sessionStorage.setItem("userUpdate", editaID)

  let theREV = AllEmployees.find(dd => dd.id === editaID)

  let allInputs = document.querySelectorAll(".enumInput")

  allInputs.forEach(theInpt => {
    if (theREV[theInpt.dataset.name]) {
      theInpt.value = theREV[theInpt.dataset.name]
    }
  })
}

$("#theButton").on("click", () => {
  let theRevId = sessionStorage.getItem("userUpdate")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#theButton").addClass("hidden")

  let allInputs = document.querySelectorAll(".enumInput")

  let obj = {
    endpoint: "updateSpecialUsers",
    data: {
      id: theRevId,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  })

  $.ajax({
    type: "POST",
    url: HOST,
    data: JSON.stringify(obj),
    dataType: "json",
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#theButton").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#theButton").removeClass("hidden")
        setTimeout(() => {
          $('#theButton').modal('hide');
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again !</p>
      `)
      $("#theButton").removeClass("hidden")
      console.log(error);
    }
  });
})

function generateInv(amount, staff_id) {
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
              `${HOST}?generateSingleInvoices&tax_number=${payerID}&price=${amount}&revenue_head_id=1359&invoice_type=invoice&created_by=admin&by_account=${userInfo2.id}`
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
    // console.log(result.value);
    if (result.isConfirmed) {
      registerEmployeesInvoice(amount, result.value.invoice_number, staff_id)

      Swal.fire({
        icon: "success",
        title: `Invoice Generated successfully !`,
        confirmButtonText: "Open Invoice",
      }).then((result3) => {
        if (result3.isConfirmed) {
          window.open(`../viewinvoice.html?invnumber=${result.value.invoice_number}&load=true`, '_blank')
        }
      });
    }
  });

}

async function registerEmployeesInvoice(amount, invoice_num, staff_id) {
  let dataToSend = {
    endpoint: "registerPayeInvoiceStaff",
    data: {
      invoice_number: invoice_num,
      staff_id: staff_id,
      associated_special_user_id: payerID,
      monthly_tax_payable: amount,
    }
  }
  try {
    const response = await fetch(HOST, {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    console.log(data)

  } catch (error) {
    console.log(error)
  }
}

$("#generating_inv").on("click", function () {
  let allSelected = document.querySelectorAll(".taxChecks");

  // let  = document.querySelectorAll(".")
  let theArray = [];
  let staffArr = []
  allSelected.forEach((slt) => {
    if (slt.checked) {
      theArray.push(parseFloat(slt.dataset.amount));
      staffArr.push(slt.dataset.staffid)
      // console.log(slt)
    }
  });
  // console.log()

  // console.log(theArray)
  if (theArray.length === 0) {
    alert('Please select atleast one Staff')
  } else {
    generateInv(sumArray(theArray), staffArr.join(","));
  }

});


function checkTax(input) {
  let selectedCheck = document.querySelector(".taxChecks:checked");
  // if (selectedCheck) {
  //   // showButton
  //   $("#generating_inv").removeClass("hidden");
  // } else {
  //   // hideButton
  //   $("#generating_inv").addClass("hidden");
  // }
}

function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

async function getPaymentHistory() {

  const response = await fetch(`${HOST}/?getSpecialUsersPayments&offset=0&payer_id=${payerID}`)
  const specialUsers = await response.json()

  $("#loader").css("display", "none")

  if (specialUsers.status === 0) {
    $('#dataTable2').DataTable();

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
                <a href="./viewreceipt.html?invnumber=${rhUser.invoice_number}&load=true" class="btn btn-sm button-3">View</a>
                <button class="btn btn-sm button-3" onclick="fetchTheStaffs('${rhUser.invoice_number}')">View Staffs</button>
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

  const response = await fetch(`${HOST}/?userInvoices&payer_id=${payerID}`)
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
            <td>${rhUser.created_by}</td>
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
  a.download = "staff_list.csv";
  a.click();
}