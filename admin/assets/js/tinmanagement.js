let theUserDataTin = JSON.parse(localStorage.getItem("adminDataPrime"))

if (theUserDataTin) {
  $("#createTaxP").attr('href', `../generatetin.html?user=${theUserDataTin.id}`)
}
let allTinData = []

async function getTinManagements() {
  try {
    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php`)
    const data = await response.json()

    $("#loader").html('')
    allTinData = data.data

    data.data.reverse().forEach((tinmngment, i) => {
      $("#showreport").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${tinmngment.type}</td>
          <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.middle_name} ${tinmngment.last_name}`}</td>
          <td>${tinmngment.phone_number}</td>
          <td>${tinmngment.email}</td>
          <td>${tinmngment.tin}</td>
          <td>${tinmngment.state}</td>
          <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
          <td>${tinmngment.payer_id === null ? 'Self' : 'Admin'}</td>
          <td>${new Date(tinmngment.created_at).toDateString()}</td>
          <td><a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-userid="${tinmngment.id}" class="btn btn-primary btn-sm">View</a></td>
        </tr>
      `)
    });

    $("#registered").html(data.data.length)
    $("#indregistered").html(data.data.filter(e => e.type === 'individual').length)
    $("#corpregistered").html(data.data.filter(e => e.type === 'corporate').length)
    $("#registered2").html(data.data.length)
    $("#admincreated").html(data.data.filter(e => e.payer_id !== null).length)



  } catch (error) {
    console.log(error)
  }

}

getTinManagements().then(e => {
  $("#dataTable").DataTable();
})

function clearfilter() {
  $("#filterInvoice").modal('hide')
  $("#showreport").html('')
  $("#loader").html(`
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
  `)

  getTinManagements().then(e => {
    $("#dataTable").DataTable();
  })
}

function viewUser(e) {
  let theID = e.dataset.userid

  let theuser = allTinData.find(alluser => alluser.id === parseInt(theID))
  // console.log(theuser, theID)
  if (theuser) {
    $('#userDataID').html(`
      <tr>
        <th>Name of business</th>
        <td>${theuser.organization_name}</td>
      </tr>

      <tr>
        <th>Name</th>
        <td>${theuser.type === 'corporate' ? '-' : `${theuser.first_name} ${theuser.middle_name} ${theuser.last_name}`}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>${theuser.type}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${theuser.email}</td>
      </tr>
      <tr>
        <th>TIN</th>
        <td>${theuser.tin}</td>
      </tr>
      <tr>
        <th>Phone</th>
        <td>${theuser.phone_number}</td>
      </tr>
      <tr>
        <th>State</th>
        <td>${theuser.state}</td>
      </tr>
      <tr>
        <th>LGA</th>
        <td>${theuser.lga}</td>
      </tr>
      <tr>
        <th>Industry</th>
        <td>${theuser.industry ? theuser.industry : '-'}</td>
      </tr>
      <tr>
        <th>Sector</th>
        <td>${theuser.sector ? theuser.sector : '-'}</td>
      </tr>
      <tr>
        <th>Created by</th>
        <td>${theuser.payer_id === null ? 'Self' : 'Admin'}</td>
      </tr>
      <tr>
        <th>Date Created</th>
        <td>${new Date(theuser.created_at).toDateString()}</td>
      </tr>
    `)
  }
}

async function filterTinModule() {
  try {
    $("#msg_boxer").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#filterTinModule").addClass("hidden")

    let allInputs = document.querySelectorAll(".payInputs")

    let obj = {}
    allInputs.forEach(allInput => {
      if (allInput.value === "") {

      } else {
        obj[allInput.dataset.name] = allInput.value
      }
    })

    const urlParam = new URLSearchParams(obj).toString()

    console.log(urlParam)

    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php?${urlParam}`)
    const data = await response.json()

    if (data.success) {
      $("#filterTinModule").removeClass("hidden")
      $("#msg_boxer").html('')

      $("#showreport").html('')
      $("#filterInvoice").modal('hide')

      data.data.reverse().forEach((tinmngment, i) => {
        $("#showreport").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${tinmngment.type}</td>
          <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.middle_name} ${tinmngment.last_name}`}</td>
          <td>${tinmngment.phone_number}</td>
          <td>${tinmngment.email}</td>
          <td>${tinmngment.state}</td>
          <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
          <td>self</td>
          <td>${new Date(tinmngment.created_at).toDateString()}</td>
          <td><a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-userid="${tinmngment.id}" class="btn btn-primary btn-sm">View</a></td>
        </tr>
      `)
      });
    } else {
      $("#msg_boxer").html(`<p class="text-danger text-center">Something went wrong, Try again</p>`)

      $("#filterTinModule").removeClass("hidden")
    }


  } catch (error) {
    console.log(error)
    $("#msg_boxer").html(`<p class="text-danger text-center">${error.error ? error.error : 'something went wrong, Try Again.'}</p>`)

    $("#filterTinModule").removeClass("hidden")
  }
}