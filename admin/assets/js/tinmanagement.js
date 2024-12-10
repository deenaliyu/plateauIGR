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
          <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.last_name}`}</td>
          <td>${tinmngment.phone_number}</td>
          <td>${tinmngment.email}</td>
          <td>${tinmngment.tin}</td>
          <td>${tinmngment.state}</td>
          <td>${tinmngment.sector ? tinmngment.sector : '-'}</td>
          <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
          <td>${tinmngment.payer_id === null ? 'Self' : 'Admin'}</td>
          <td>${getFormattedDate(tinmngment.created_at)}</td>
          <td>
          <div class="flex gap-3 items-center">
            <a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-userid="${tinmngment.id}" class="btn btn-primary btn-sm">View</a>
            <a href="#EditInfo" data-bs-toggle="modal" onclick="editUser(this)" data-userid="${tinmngment.id}">
              <iconify-icon icon="uil:edit"></iconify-icon></button>
            </a>
          </div>
          </td>

        </tr>
      `)

      $("#tinTableFull").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${tinmngment.type}</td>
          <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.last_name}`}</td>
          <td>${tinmngment.phone_number}</td>
          <td>${tinmngment.email}</td>
          <td>${tinmngment.tin}</td>
          <td>${tinmngment.state}</td>
          <td>${tinmngment.sector ? tinmngment.sector : '-'}</td>
          <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
          <td>${tinmngment.payer_id === null ? 'Self' : 'Admin'}</td>
          <td>${getFormattedDate(tinmngment.created_at)}</td>
        </tr>
      `)
    });



  } catch (error) {
    console.log(error)
  }

}

getTinManagements().then(e => {
  $("#dataTable").DataTable();
})

async function getTinMetrics() {
  try {
    const response = await fetch(`https://plateauigr.com/php/tinGeneration/metrics.php`)
    const data = await response.json()


    if (data.success) {
      $("#registered").html(data.data.total_tin_created)
      $("#indregistered").html(data.data.total_created_by_individual)
      $("#corpregistered").html(data.data.total_created_by_corporate)
      $("#registered2").html(data.data.total_self_created)
      $("#admincreated").html(data.data.total_admin_created)
    }

  } catch (error) {
    console.log(error)
  }

}

getTinMetrics()

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
        <th>TIN</th>
        <td>${theuser.tin}</td>
      </tr>
      <tr>
        <th>Name</th>
        <td>${theuser.type === 'corporate' ? '-' : `${theuser.first_name} ${theuser.last_name}`}</td>
      </tr>
      <tr>
        <th>Name of business</th>
        <td>${theuser.organization_name}</td>
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
        <th>Phone</th>
        <td>${theuser.phone_number}</td>
      </tr>
      <tr>
        <th>Sector</th>
        <td>${theuser.sector ? theuser.sector : '-'}</td>
      </tr>
      <tr>
        <th>Industry</th>
        <td>${theuser.industry ? theuser.industry : '-'}</td>
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

function editUser(e) {
  let theID = e.dataset.userid

  let payInputs = document.querySelectorAll(".payInputs2")
  let theuser = allTinData.find(alluser => alluser.id === parseInt(theID))
  // console.log(theuser)

  if (theuser) {
    payInputs.forEach(payInpt => {
      payInpt.value = theuser[payInpt.dataset.name]
    })
  }

}

async function editTinModule() {
  try {
    $("#msg_boxeredit").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#editTinModule").addClass("hidden")
    let allInputs = document.querySelectorAll(".payInputs2")

    let dataToSend = {}

    allInputs.forEach(allInput => {
      dataToSend[allInput.dataset.name] = allInput.value
    })

    // console.log(JSON.stringify(dataToSend))
    const response = await fetch('https://plateauigr.com/php/tinGeneration/updateTINInfo.php', {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    const resdata = await response.json()

    // console.log(resdata)
    if (resdata.success) {
      $("#msg_boxeredit").html(`<p class="text-success text-center mt-4 text-lg">TIN Updated successfully.</p>`)
      $("#editTinModule").removeClass("hidden")

      $("#dataTable").DataTable().clear().destroy();
      $("#EditInfo").modal("hide")
      getTinManagements()
    } else {
      $("#msg_boxeredit").html(`<p class="text-warning text-center mt-4 text-lg">${resdata.error}.</p>`)
      $("#editTinModule").removeClass("hidden")
    }


  } catch (error) {
    console.log(error)
    $("#msg_boxeredit").html(`<p class="text-danger text-center mt-4 text-lg">${error.error ? error.error : 'something went wrong, Try Again.'}.</p>`)
    $("#editTinModule").removeClass("hidden")
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

    // console.log(urlParam)

    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php?${urlParam}`)
    const data = await response.json()

    if (data.success) {
      $("#filterTinModule").removeClass("hidden")
      $("#msg_boxer").html('')

      $("#showreport").html('')
      $("#tinTableFull").html('')
      $("#filterInvoice").modal('hide')

      data.data.reverse().forEach((tinmngment, i) => {
        $("#showreport").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${tinmngment.type}</td>
            <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.last_name}`}</td>
            <td>${tinmngment.phone_number}</td>
            <td>${tinmngment.email}</td>
            <td>${tinmngment.tin}</td>
            <td>${tinmngment.state}</td>
            <td>${tinmngment.sector ? tinmngment.sector : '-'}</td>
            <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
            <td>${tinmngment.payer_id === null ? 'Self' : 'Admin'}</td>
            <td>${getFormattedDate(tinmngment.created_at)}</td>
            <td>
            <div class="flex gap-3 items-center">
              <a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-userid="${tinmngment.id}" class="btn btn-primary btn-sm">View</a>
              <a href="#EditInfo" data-bs-toggle="modal" onclick="editUser(this)" data-userid="${tinmngment.id}">
                <iconify-icon icon="uil:edit"></iconify-icon></button>
              </a>
            </div>
            </td>

          </tr>
        `)

        $("#tinTableFull").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${tinmngment.type}</td>
            <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.last_name}`}</td>
            <td>${tinmngment.phone_number}</td>
            <td>${tinmngment.email}</td>
            <td>${tinmngment.tin}</td>
            <td>${tinmngment.state}</td>
            <td>${tinmngment.sector ? tinmngment.sector : '-'}</td>
            <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
            <td>${tinmngment.payer_id === null ? 'Self' : 'Admin'}</td>
            <td>${getFormattedDate(tinmngment.created_at)}</td>
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

async function filterSummary() {
  try {
    $("#summaryBox").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#filterSummary").addClass("hidden")

    let startDate = document.querySelector("#dateStart").value
    let toDate = document.querySelector("#dateEnd").value

    let obj = {
      total_tin_start: startDate,
      total_tin_end: toDate,
      individual_start: startDate,
      individual_end: toDate,
      corporate_start: startDate,
      corporate_end: toDate,
      self_start: startDate,
      self_end: toDate,
      admin_start: startDate,
      admin_end: toDate,
    }


    const urlParam = new URLSearchParams(obj).toString()

    // console.log(urlParam)

    const response = await fetch(`https://plateauigr.com/php/tinGeneration/metrics.php?${urlParam}`)
    const data = await response.json()

    $("#filterSummary").removeClass("hidden")

    if (data.success) {

      $("#summaryBox").html("")

      $("#registered").html(data.data.total_tin_created)
      $("#indregistered").html(data.data.total_created_by_individual)
      $("#corpregistered").html(data.data.total_created_by_corporate)
      $("#registered2").html(data.data.total_self_created)
      $("#admincreated").html(data.data.total_admin_created)


    } else {
      $("#summaryBox").html(`<p class="text-danger text-center">${data.message}</p>`)


    }


  } catch (error) {
    console.log(error)
    $("#summaryBox").html(`<p class="text-danger text-center">${error.error ? error.error : 'something went wrong, Try Again.'}</p>`)

    $("#filterTinModule").removeClass("hidden")
  }
}

function getFormattedDate(date) {
  date = new Date(date)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function printSlip(thecard) {
  var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  mywindow.document.write('<html><head><title></title>');
  mywindow.document.write('<link rel="stylesheet" href="./assets/vendor/css/core.css" type="text/css" />');
  mywindow.document.write('</head><body >');
  mywindow.document.write(document.getElementById(thecard).innerHTML);
  mywindow.document.write('</body></html>');
  mywindow.document.close();
  mywindow.focus();

  setTimeout(function () {
    mywindow.print();
    mywindow.close();
  }, 1000);


  return true;

}

async function getIndustriesSectors() {
  try {
    const response = await fetch(`${HOST}?getIndustriesSectors`);
    const resdata = await response.json();

    if (resdata.status === 1) {
      const data = resdata.message;

      const sectors = [...new Set(data.map(item => item.SectorName))];

      const sectorSelect = document.getElementById('sectorSelect');
      sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });

      sectorSelect.addEventListener('change', () => {
        const selectedSector = sectorSelect.value;

        const filteredIndustries = data.filter(
          item => item.SectorName === selectedSector
        );

        const industrySelect = document.getElementById('industrySelect');
        industrySelect.innerHTML = '<option value="">Select</option>';

        filteredIndustries.forEach(industry => {
          const option = document.createElement('option');
          option.value = industry.IndustryName;
          option.textContent = industry.IndustryName;
          industrySelect.appendChild(option);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getIndustriesSectors();

async function getIndustriesSectors2() {
  try {
    const response = await fetch(`${HOST}?getIndustriesSectors`);
    const resdata = await response.json();

    if (resdata.status === 1) {
      const data = resdata.message;

      const sectors = [...new Set(data.map(item => item.SectorName))];

      const sectorSelect = document.getElementById('sectorSelect2');
      sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });

      sectorSelect.addEventListener('change', () => {
        const selectedSector = sectorSelect.value;

        const filteredIndustries = data.filter(
          item => item.SectorName === selectedSector
        );

        const industrySelect = document.getElementById('industrySelect2');
        industrySelect.innerHTML = '<option value="">Select</option>';

        filteredIndustries.forEach(industry => {
          const option = document.createElement('option');
          option.value = industry.IndustryName;
          option.textContent = industry.IndustryName;
          industrySelect.appendChild(option);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getIndustriesSectors2();