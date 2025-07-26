const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

const enumerated = urlParams.get('enumerated')
let userrrData = {}


async function facilityDetails(tax_number) {
  // Add the new tab
  const tabList = document.getElementById('pills-tab');
  const newTab = document.createElement('li');
  newTab.className = 'nav-item text-center';
  newTab.role = 'presentation';
  newTab.innerHTML = `
    <button class="nav-link" id="pills-facility-tab" data-bs-toggle="pill"
      data-bs-target="#pills-facility" type="button" role="tab" 
      aria-controls="pills-facility" aria-selected="false">
      Facility Details
    </button>
  `;
  tabList.appendChild(newTab);

  // Create the tab content container
  const tabContent = document.getElementById('pills-tabContent');
  const facilityContent = document.createElement('div');
  facilityContent.className = 'tab-pane fade';
  facilityContent.id = 'pills-facility';
  facilityContent.role = 'tabpanel';
  facilityContent.setAttribute('aria-labelledby', 'pills-facility-tab');
  facilityContent.innerHTML = '<div class="text-center mt-3"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  tabContent.appendChild(facilityContent);

  try {
    // Fetch facility data
    const response = await fetch(`https://plateauigr.com/php/?getFacilities&&tax_number=${tax_number}`);
    const data = await response.json();

    if (data.status === 1 && data.facilities.length > 0) {
      const facility = data.facilities[0];

      // Format the data for display
      const services = JSON.parse(facility.operations.services_offered || '[]').join(', ');
      const equipment = JSON.parse(facility.operations.major_equipment || '[]').join(', ');
      const issuingAuthority = JSON.parse(facility.facility.issuing_authority || '[]').join(', ');

      // Create the facility details HTML
      facilityContent.innerHTML = `
        <div class="container mt-4">
          <div class="row">
            <div class="col-md-4 text-center mb-4">
              <img src="${facility.facility.img}" alt="Facility Image" class="img-fluid rounded" style="max-height: 200px;">
              <h4 class="mt-3">${facility.facility.legal_name}</h4>
              <p class="text-muted">${facility.facility.facility_type}</p>
            </div>
            
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5>Facility Information</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Tax Number:</strong> ${facility.facility.tax_number}</p>
                      <p><strong>Registration Number:</strong> ${facility.facility.registration_number}</p>
                      <p><strong>Ownership Type:</strong> ${facility.facility.ownership_type}</p>
                      <p><strong>Operating License:</strong> ${facility.facility.operating_license_number}</p>
                      <p><strong>Health Facility Code:</strong> ${facility.facility.health_facility_code}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>License Expiry:</strong> ${facility.facility.license_expiry_date}</p>
                      <p><strong>Issuing Authority:</strong> ${issuingAuthority}</p>
                      <p><strong>TIN:</strong> ${facility.facility.tax_identification_number}</p>
                      <p><strong>Established:</strong> ${facility.facility.date_of_establishment}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card mt-4">
                <div class="card-header">
                  <h5>Location Information</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Address:</strong> ${facility.location.address}</p>
                      <p><strong>City:</strong> ${facility.location.city}</p>
                      <p><strong>LGA:</strong> ${facility.location.lga}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Phone:</strong> ${facility.location.phone_number}</p>
                      <p><strong>Email:</strong> ${facility.location.email}</p>
                      <p><strong>Coordinates:</strong> ${facility.location.latitude}, ${facility.location.longitude}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card mt-4">
                <div class="card-header">
                  <h5>Operations</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Services Offered:</strong> ${services}</p>
                      <p><strong>Major Equipment:</strong> ${equipment}</p>
                      <p><strong>Number of Employees:</strong> ${facility.operations.number_of_employees}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Number of Beds:</strong> ${facility.operations.number_of_beds}</p>
                      <p><strong>Avg Monthly Patients:</strong> ${facility.operations.avg_monthly_patient_visits}</p>
                      <p><strong>Surgeries/Month:</strong> ${facility.operations.number_of_surgeries_per_month}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              ${facility.branches && facility.branches.length > 0 ? `
              <div class="card mt-4">
                <div class="card-header">
                  <h5>Branches (${facility.branches.length})</h5>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Branch Name</th>
                          <th>Address</th>
                          <th>City</th>
                          <th>LGA</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${facility.branches.map(branch => `
                          <tr>
                            <td>${branch.branch_name}</td>
                            <td>${branch.address}</td>
                            <td>${branch.city}</td>
                            <td>${branch.lga}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      facilityContent.innerHTML = '<div class="alert alert-danger mt-3">No facility details found for this tax number.</div>';
    }
  } catch (error) {
    console.error('Error fetching facility details:', error);
    facilityContent.innerHTML = '<div class="alert alert-danger mt-3">Error loading facility details. Please try again later.</div>';
  }

  // Activate the new tab
  const tabButton = document.getElementById('pills-facility-tab');
  const tabInstance = new bootstrap.Tab(tabButton);
  tabInstance.show();
}

async function getTaxPayer() {
  try {
    const response = await fetch(`${HOST}/?userProfile&id=${userIdo}`)
    const data = await response.json()

    let taxPayerData = data.user
    userrrData = taxPayerData
    // console.log(taxPayerData)
    let theimg = taxPayerData.img
    if (theimg === "") {
      theimg = "./assets/img/avatars/1.png"
    }

    if (taxPayerData.category === "Hospital") {
      facilityDetails(taxPayerData.tax_number);
    }

    $("#userInfo").html(`
      <div class="flex gap-x-2">
        <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
        <div class="mt-2">
          <h6 class="font-bold text-[20px]">${taxPayerData.first_name} ${taxPayerData.surname}</h6>
          <p><span class="font-bold">Payer ID:</span> ${taxPayerData.tax_number}</p>
        </div>
      </div>
          
      <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
        <p><span class="font-bold">Category:</span> ${taxPayerData.category}</p>
        <p><span class="font-bold">State:</span> ${taxPayerData.state}</p>
        <p><span class="font-bold">LGA:</span> ${taxPayerData.lga}</p>
        <p><span class="font-bold">Address:</span> ${taxPayerData.address}</p>
        <p><span class="font-bold">Email address:</span> ${taxPayerData.email}</p>
        <p><span class="font-bold">Contact:</span> ${taxPayerData.phone}</p>
        <p><span class="font-bold">Tin Status:</span> ${taxPayerData.tin_status}</p>
        <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tin == "" ? '-' : taxPayerData.tin}</p>
        <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type == "" ? '-' : taxPayerData.business_type}</p>
        <p><span class="font-bold">Employment Status:</span> ${taxPayerData.employment_status == "" ? '-' : taxPayerData.employment_status}</p>
        <p><span class="font-bold">Number of Staff:</span> ${taxPayerData.number_of_staff == "" ? '-' : taxPayerData.number_of_staff}</p>
      </div>
    `)

  } catch (error) {
    console.log(error)
  }

}

getTaxPayer().then(thee => {
  getTaxesCateg().then(res => {
    $(".dataTable").DataTable();
    $(".dataTable2").DataTable();
  })
})

async function fetchPayment() {
  $("#showInvoice").html("");
  $("#loader").css("display", "flex");

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  const response = await fetch(
    `${HOST}/php/index.php?fetchPayment&user_id=${userIdo}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    for (let i = 0; i < userInvoices.message.length; i++) {
      const userInvoice = userInvoices.message[i];
      $("#showPayment").append(`
        <tr>
        <td>${userInvoice.user_id}</td>
        <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>&#8358;${userInvoice.amount_paid}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>
            <p class="text-success">Successful</p>
          </td>
        </tr>
        `);

      if (i === 4) {
        break;
      }
    }
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable4").DataTable();
  }
}

fetchPayment().then(rr => {
  $("#dataTable4").DataTable();
})

async function fetchInvoices() {
  $("#showInvoice").html("");
  $(".showInvoice2").html("");
  $("#loader").css("display", "flex");


  const response = await fetch(
    `${HOST}/php/index.php?userInvoices&payer_id=${userIdo}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      let invo = ""
      addd += `
        <tr class="relative">    
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${userInvoice.COL_4}</td>
          <td>${userInvoice.amount_paid}</td>
          <td>${userInvoice["due_date"]}</td>
          `
      if (userInvoice.payment_status === "paid") {
        addd += `
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.payment_status}</p>
            </td>
            <td>
            <div class="flex gap-2 check-bt" id="">
            <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
            </div>
            </td>
            `
        invo += `
            <tr class="relative">    
            <td>${userInvoice.tax_number}</td>
            <td><a class="textPrimary" href="../viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true">${userInvoice.invoice_number}</a></td>
            <td>${userInvoice.COL_4}</td>
            <td>${userInvoice.COL_6}</td>
            <td>${userInvoice["due_date"]}</td>
            <td id="" class="checking">
              <p class='text-success'>${userInvoice.payment_status}</p>
            </td>
            <td>
            <div class="flex gap-2 check-bt" id="">
            <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
            </div>
            </td>
            </tr>
            `
      } else {
        addd += `
            <td id="" class="checking">
              <p class='text-danger'>${userInvoice.payment_status}</p>
            </td>
            <td>
              <div class="flex gap-2 check-bt" id="">
                <a href="./viewinvoice.html?invnumber=${userInvoice.invoice_number}&load=true" class="px-3 py-1 rounded-lg bgPrimary text-white block">View</a>
              </div>
            </td>
            `
      }
      $("#showInvoice3").append(invo);
      addd += `
            
        </tr>
        `
      $("#showInvoice1").append(addd);
      // showInvoice3
    });

  } else {
    // $(".showInvoice").html("<tr></tr>");
    $("#dataTable3").DataTable();
  }
}

fetchInvoices().then((uu) => {
  $("#dataTable3").DataTable();
});

function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: 'csv',
    // file name
    filename: 'report.csv'
  });
}



async function getApplicableTaxes() {
  const response = await fetch(
    `${HOST}?getApplicableTaxes&tax_number=${userIdo}`
  );
  const revenueHeads = await response.json();

  // console.log(revenueHeads);
  $("#loaderr").remove();
  for (const item of revenueHeads) {

    let aa = ""

    aa += `
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.business_type_id}" aria-expanded="true" aria-controls="collapseOne">
          ${item.business_type}
      </button>
    </h2>
     <div id="collapse${item.business_type_id}" class="accordion-collapse collapse mee" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
     <div class="accordion-body">
     <div class="table-responsive -mt-6">
                  <table class="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>S/N</th>
                        <th>Description</th>
                        <th>Frequency</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody id="showTaxes">
    `

    for (const key in item) {

      if (item[key].id) {
        aa += `

                      <tr>
                       <td><input class="form-check-input taxChecks" data-theidd="${item[key].id}" type="checkbox" value="" onchange="checkTax(this)"></td>
                       <td>hhh</td>
                       <td>${item[key].COL_4}</td>
                       <td>Monthly</td>
                       <td>${item[key].COL_6}</td>
                       <td><button class="button text-sm" onclick="generateInv(${item[key].id})">Generate Invoice</button></td>
                       </tr>
      `
      } else {
        aa += `

       
`
      }

    }


    aa += `
    </tbody>
    </table>
  </div>

</div>
      </div>
      </div>
    `

    $(".apt").append(aa)
  }
}

getApplicableTaxes().then((res) => {
  // $("#dataTable3").DataTable({
  //   'processing': true,
  //   'paging': false,
  //   'serverSide': false,
  // });
  // $("#dataTable3").DataTable();
});

async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}


async function getAnalytics() {
  try {

    const response = await fetch(`${HOST}?inAppNotification&user_id=${userIdo}`)
    const data = await response.json()
    console.log(data)
    if (data.status === 0) {
      $("#ActivityLogs").html(``)

    } else {
      // <button class="text-[#CDA545] text-[12px] underline underline-offset-1">clear</button>

      data.message.forEach((notification, i) => {
        $("#ActivityLogs").append(`
        <tr>
          <td>${notification.timeIn}</td>
          <td>${notification.comment}</td>
        </tr>
      `)

      });


    }

  } catch (error) {
    console.log(error)
  }
}

getAnalytics().then(ee => {
  $('#dataTable77').DataTable();
})
