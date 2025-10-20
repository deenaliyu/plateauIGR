let theUserDataTin = JSON.parse(localStorage.getItem("adminDataPrime"))

if (theUserDataTin) {
  $("#createTaxP").attr('href', `../generatetin.html?user=${theUserDataTin.id}`)
}
let allTinData = []
let tinTable;
let downloadLink = '';

function initializeDataTable() {
  if ($.fn.DataTable.isDataTable('#tinTable')) {
    $('#tinTable').DataTable().destroy();
    // $('#tinTable').empty();
  }

  tinTable = $('#tinTable').DataTable({
    processing: true, // Show processing indicator
    serverSide: true, // Enable server-side processing
    paging: true,     // Enable pagination
    pageLength: 50,   // Number of items per page
    searchDelay: 1500,
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;
      $.ajax({
        url: 'https://plateauigr.com/php/tinGeneration/fetch.php',
        type: 'GET',
        data: {
          page: pageNumber,
          created_at_min: $('#dateStart').val(),
          created_at_max: $('#dateEnd').val(),
          type: $('#categorySel').val(),
          industry: $('#industrySelect').val(),
          sector: $('#sectorSelect').val(),
          limit: data.length, // Number of rows per page
          search: data.search.value, // Search term
        },
        success: function (response) {
          // Map the API response to DataTables expected format

          if (response.success) {
            if (response.download_link) {
              downloadLink = response.download_link;
            }
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.total_records, // Total records in your database
              recordsFiltered: response.total_records, // Filtered records count
              data: response.data, // The actual data array from your API
            });
          } else {
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: 0, // Total records in your database
              recordsFiltered: 0, // Filtered records count
              data: [], // The actual data array from your API
            });
          }
        },
        error: function () {
          alert('Failed to fetch data.');
        }
      });
    },
    columns: [
      {
        data: null,
        orderable: false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        }
      },
      {
        data: 'type',
        render: function (data) {
          return data ? data.charAt(0).toUpperCase() + data.slice(1) : '-';
        }
      },
      {
        data: null,
        render: function (data) {
          if (data.type === 'corporate') {
            return data.organization_name || '-';
          } else {
            const firstName = data.first_name || '';
            const lastName = data.last_name || '';
            return `${firstName} ${lastName}`.trim() || '-';
          }
        }
      },
      {
        data: 'phone_number',
        render: function (data) {
          return data || '-';
        }
      },
      {
        data: 'email',
        render: function (data) {
          return data || '-';
        }
      },
      {
        data: 'tin',
        render: function (data) {
          return data || '-';
        }
      },
      {
        data: 'state',
        render: function (data) {
          return data || '-';
        }
      },
      {
        data: 'sector',
        render: function (data) {
          return data ? data : '-';
        }
      },
      {
        data: 'industry',
        render: function (data) {
          return data ? data : '-';
        }
      },
      {
        data: null,
        render: function (data) {
          return data.admin_email ? data.admin_email : 'Self';
        }
      },
      {
        data: 'created_at',
        render: function (data) {
          return data ? getFormattedDate(data) : '-';
        }
      },
      {
        data: 'id',
        orderable: false,
        render: function (data, type, row) {
          return `
                        <div class="flex gap-3 items-center">
                            <a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-tin="${row.tin}" data-userid="${data}" class="btn btn-primary btn-sm">View</a>
                            <a href="#EditInfo" data-bs-toggle="modal" onclick="editUser(this)" data-userid="${data}" data-tin="${row.tin}" class="btn">
                                <iconify-icon icon="uil:edit"></iconify-icon>
                            </a>
                        </div>
                    `;
        }
      }
    ]
  });
}

initializeDataTable()

$("#filterTinData").on('click', function () {
  $("#filterInvoice").modal('hide')
  initializeDataTable()
})

function clearfilter() {
 $("#filterInvoice").modal('hide')
  $("#categorySel").val('')
  $("#sectorSelect").val('')
  $("#industrySelect").val('')

  initializeDataTable()
}
// Download data
function downloadData() {
  if (downloadLink) {
    window.open(downloadLink, '_blank');
  } else {
    alert('No download link available. Please wait for the data to finish loading.');
  }
}


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

async function viewUser(e) {
  let theID = e.dataset.tin;

  try {
    // Show loading indicator
    $('#userDataID').html('<tr><td colspan="2">Loading...</td></tr>');

    // Fetch single user data from endpoint
    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php?tin=${theID}`);
    const result = await response.json();

    if (result.success && result.data) {
      const theuser = result.data[0];
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
          <th>Address</th>
          <td>${theuser.address}</td>
        </tr>
        <tr>
          <th>Created by</th>
          <td>${theuser.payer_id === null ? 'Self' : 'Admin'}</td>
        </tr>
        <tr>
          <th>Date Created</th>
          <td>${new Date(theuser.created_at).toDateString()}</td>
        </tr>
      `);
    } else {
      $('#userDataID').html('<tr><td colspan="2">User data not found.</td></tr>');
    }
  } catch (error) {
    $('#userDataID').html('<tr><td colspan="2">Error loading user data.</td></tr>');
    console.error(error);
  }
}

function editUser(e) {
  let theID = e.dataset.userid
  let theTin = e.dataset.tin

  let payInputs = document.querySelectorAll(".payInputs2")
  // Show loading indicator
  payInputs.forEach(payInpt => {
    payInpt.value = '';
  });

  $("#msg_boxeredit").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);

  // Fetch user data from endpoint
  fetch(`https://plateauigr.com/php/tinGeneration/fetch.php?tin=${theTin}`)
    .then(res => res.json())
    .then(result => {
      $("#msg_boxeredit").html('');
      let theuser = result.success && result.data ? result.data[0] : null;
      console.log(theuser)
      if (theuser) {
        payInputs.forEach(payInpt => {
          payInpt.value = theuser[payInpt.dataset.name] || '';
        });
      }
    })
    .catch(error => {
      $("#msg_boxeredit").html(`<p class="text-danger text-center mt-4 text-lg">Error loading user data.</p>`);
      console.error(error);
    });
  // console.log(theuser)

  // if (theuser) {
  //   payInputs.forEach(payInpt => {
  //     payInpt.value = theuser[payInpt.dataset.name]
  //   })
  // }

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
    initializeDataTable()
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

function downloadSlip(thecard) {
  const element = document.getElementById(thecard);

  var HTML_Width = $("#" + thecard).width();
  var HTML_Height = $("#" + thecard).height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + (top_left_margin * 2);
  var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($("#" + thecard)[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save('Tin Slip' + ".pdf");
  });

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