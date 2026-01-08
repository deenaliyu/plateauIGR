let isLoading = false;


let selectcategory = document.querySelectorAll(".cardi")
selectcategory.forEach(selecti => {
  selecti.addEventListener("click", () => {
    selectcategory.forEach(element => {
      element.classList.remove("selectedcat");
    });
    selecti.classList.add("selectedcat");
    let btnclicked = document.querySelector(".bb");
    var dataId = selecti.getAttribute("data-name");
    // console.log(dataId)

  })
})

$(".multiple-select1").selectize({
  create: false,
  sortField: 'text',
  placeholder: 'Select options',
  dropdownParent: 'body'
});

function initializeSelectize() {
  document.querySelectorAll('.multiple-select').forEach(function (select) {
    if (!select.classList.contains('selectized')) {
      $(select).selectize({
        create: false,
        sortField: 'text',
        placeholder: 'Select options',
        dropdownParent: 'body'
      });
    }
  });
}

initializeSelectize();

// Form navigation
const sections = document.querySelectorAll('.form-section');
const sideTabs = document.querySelectorAll('.sideTabs')

let currentSection = 0;

// Show first section by default
showSection(currentSection);

// Next button click handler
document.querySelectorAll('.next-section').forEach(button => {
  button.addEventListener('click', function () {
    if (validateSection(currentSection)) {
      currentSection++;
      showSection(currentSection);
      generateSummary()
    }
  });
});

// Previous button click handler
document.querySelectorAll('.prev-section').forEach(button => {
  button.addEventListener('click', function () {
    currentSection--;
    showSection(currentSection);
  });
});

// Show the specified section and hide others
function showSection(index) {
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === index);
  });

  sideTabs.forEach((sideTab, i) => {
    sideTab.classList.toggle('active', i === index)
  })

  // Hide/show navigation buttons based on current section
  const prevButtons = document.querySelectorAll('.prev-section');
  const nextButtons = document.querySelectorAll('.next-section');

  if (index === 0) {
    prevButtons.forEach(btn => btn.disabled = true);
  } else {
    prevButtons.forEach(btn => btn.disabled = false);
  }

  if (index === sections.length - 1) {
    nextButtons.forEach(btn => btn.style.display = 'none');
  } else {
    nextButtons.forEach(btn => btn.style.display = 'block');
  }
}

const yesRadio = document.getElementById('hasTINYes');
const noRadio = document.getElementById('hasTINNo');
const selectionContainer = document.getElementById('selectionContainer');

function updateTINSelection() {
  if (yesRadio.checked) {
    selectionContainer.innerHTML = `
        <form>
          <div class="mt-3">
            <label class="form-label font-bold text-lg required">TIN Type</label>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="tinType" id="jtbTin" value="JTB">
              <label class="form-check-label" for="jtbTin">
                JTB TIN (Joint Tax Board)
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="tinType" id="plateauTin" value="PlateauIGR" checked>
              <label class="form-check-label" for="plateauTin">
                Plateau IGR TIN
              </label>
            </div>
          </div>
          <div class="mt-3">
            <label for="tinNumber" class="form-label required">TIN Number</label>
            <input placeholder='Enter your TIN number' type="number" class="form-control" id="tinNumber" name="tinNumber" required>
          </div>
          <button type="button" class="button mt-4" id="validate-btn">
            Validate
            <iconify-icon class="align-middle" icon="material-symbols:line-end-arrow-notch-sharp"></iconify-icon>
          </button>
        </form>
      `;

    document.getElementById('validate-btn').addEventListener('click', validateTIN);

  } else if (noRadio.checked) {
    selectionContainer.innerHTML = `
        <div class="mt-3">
          <!-- <a href="../generatetin.html?callback=./schools/enumeration-schools.html" type="button" class="button" id="generateTIN">Generate TIN</a> -->
          <!-- <button class="button" type="button" id="proceedWithoutTIN">
            Proceed 
          </button> -->

          <button class="button" type="button" data-bs-target="#tingenerateModal" data-bs-toggle="modal">
            Generate TIN
          </button>
        </div>
      `;
    // document.getElementById('proceedWithoutTIN').addEventListener('click', function () {
    //   // Proceed without TIN logic
    //   currentSection++;
    //   showSection(currentSection);
    // });
  }
}

yesRadio.addEventListener('change', updateTINSelection);
noRadio.addEventListener('change', updateTINSelection);

// Initialize based on default selection if any
if (yesRadio.checked || noRadio.checked) {
  updateTINSelection();
}

async function validateTIN() {
  const validateBtn = document.querySelector("#validate-btn")
  const validationInput = document.querySelector("#tinNumber");
  const tinType = document.querySelector('input[name="tinType"]:checked').value;

  // e.preventDefault()
  const tinvalue = validationInput.value.trim();

  if (!tinvalue) {
    alert('Please enter a valid TIN number.');
    return;
  }

  validateBtn.disabled = true;
  validateBtn.innerHTML = `
        Validating...
        <iconify-icon icon="eos-icons:loading"></iconify-icon>
      `;

  try {
    let endpoint;
    if (tinType === 'JTB') {
      endpoint = `${HOST}?checkUsers&data=${tinvalue}`;
    } else {
      endpoint = `${HOST}?checkUsers&data=${tinvalue}`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.status === 1 && data.user) {
      // Populate the form fields with user data
      console.log(data.user.old_user);
      if (data.user.old_user) {
        document.getElementById('legalName').value = data.user.company_name || data.user.name || "";
        document.getElementById('phoneNumber').value = data.user.office_number || data.user.phone || "";
        document.getElementById('email').value = data.user.office_email || data.user.email || "";
      } else {
        document.getElementById('phoneNumber').value = data.user.phone;
        document.getElementById('email').value = data.user.email;
        document.getElementById('legalName').value = `${data.user.first_name} ${data.user.surname}`;
      }

      // document.getElementById('legalName').readOnly = true;
      document.getElementById('taxIdentificationNumber').value = data.user.tin;
      document.getElementById('taxIdentificationNumber').readOnly = true;
      document.getElementById('address').value = data.user.address || data.user.payer_address || "";
      // document.getElementById('address').readOnly = true;
      document.getElementById('city').value = data.user.lga;
      // document.getElementById('city').readOnly = true;
      document.getElementById('lga').value = data.user.lga;
      // document.getElementById('lga').disabled = true;
      document.getElementById('state').value = data.user.state || "Plateau";
      // document.getElementById('state').readOnly = true;
      // document.getElementById('phoneNumber').value = data.user.phone;
      // document.getElementById('phoneNumber').readOnly = true;
      // document.getElementById('email').value = data.user.email;
      // document.getElementById('email').readOnly = true;

      // Select the appropriate category card
      const categoryCards = document.querySelectorAll(".cardi");
      const userCategory = data.user.category.toLowerCase(); // Convert to lowercase to match data-name

      categoryCards.forEach(card => {
        card.classList.remove("selectedcat");
        if (card.getAttribute("data-name") === userCategory) {
          card.classList.add("selectedcat");

          // Also enable the next button if it exists
          const nextBtn = document.querySelector(".bb");
          if (nextBtn) {
            nextBtn.classList.remove("disabled");
          }
        }
      });

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'TIN Verified!',
        text: 'TIN verification successful! User details have been populated.',
        confirmButtonText: 'Proceed',
        confirmButtonColor: '#CDA544',
      }).then(() => {
        currentSection++;
        showSection(currentSection);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'TIN Verification Failed',
        text: data.message || 'TIN verification failed. User not found.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CDA544'
      });
    }
  } catch (error) {
    console.error('Error during TIN validation:', error);
    Swal.fire({
      icon: 'error',
      title: 'TIN Validation Error',
      text: 'An error occurred during TIN validation. Please try again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#CDA544'
    });
  } finally {
    validateBtn.disabled = false;
    validateBtn.innerHTML = `Validate <iconify-icon class="align-middle" icon="material-symbols:line-end-arrow-notch-sharp"></iconify-icon>`;
  }
};

// Validate current section before proceeding
function validateSection(index) {
  const section = sections[index];
  const inputs = section.querySelectorAll('input, select, textarea, checkbox');
  let isValid = true;

  // Check each input in the current section
  inputs.forEach(input => {
    if (input.required && !input.value) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  if (!isValid) {
    section.querySelector('.form-control.is-invalid').focus();
  }

  return isValid;
}

// Toggle branches section
document.getElementById('hasBranches').addEventListener('change', function () {
  const branchesContainer = document.getElementById('branchesContainer');
  branchesContainer.style.display = this.checked ? 'block' : 'none';
});

// Add this JavaScript function to handle state-LGA relationship
function updateLgas(selectElement) {
  const state = selectElement.value;
  const lgaSelect = selectElement.closest('.row').querySelector('.branch-lga');

  // Clear existing options
  lgaSelect.innerHTML = '<option value="">Select LGA</option>';
  lgaSelect.disabled = !state;

  if (!state) return;

  // Get LGAs for the selected state
  const lgas = getLgasForState(state);

  // Add LGAs to select
  lgas.forEach(lga => {
    const option = document.createElement('option');
    option.value = lga;
    option.textContent = lga;
    lgaSelect.appendChild(option);
  });
}

// Helper function with LGA data for all states
function getLgasForState(state) {
  const stateLgas = lgaList;

  return stateLgas[state] || [];
}

// Add branch
document.getElementById('addBranch').addEventListener('click', function () {
  const branchEntries = document.getElementById('branchEntries');
  const branchCount = branchEntries.children.length;

  const branchEntry = document.createElement('div');
  branchEntry.className = 'branch-entry';
  branchEntry.innerHTML = `
      <h6>Branch ${branchCount + 1}</h6>
      <div class="row">
        <div class="col-md-6">
          <label class="form-label required">Branch Name</label>
          <input type="text" class="form-control branch-name" required>
          <div class="invalid-feedback">Please provide the branch name.</div>
        </div>
        <div class="col-md-6">
          <label class="form-label required">Branch Address</label>
          <input type="text" class="form-control branch-address" required>
          <div class="invalid-feedback">Please provide the branch address.</div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-md-4">
          <label class="form-label required">Branch City/Town</label>
          <input type="text" class="form-control branch-city" required>
          <div class="invalid-feedback">Please provide the branch city.</div>
        </div>
        <div class="col-md-4">
          <label class="form-label required">State</label>
          <select class="form-select branch-state" required>
            <option value="">Select State</option>
            <option value="Abia">Abia</option>
            <option value="Adamawa">Adamawa</option>
            <option value="AkwaIbom">Akwa Ibom</option>
            <option value="Anambra">Anambra</option>
            <option value="Bauchi">Bauchi</option>
            <option value="Bayelsa">Bayelsa</option>
            <option value="Benue">Benue</option>
            <option value="Borno">Borno</option>
            <option value="Cross River">Cross River</option>
            <option value="Delta">Delta</option>
            <option value="Ebonyi">Ebonyi</option>
            <option value="Edo">Edo</option>
            <option value="Ekiti">Ekiti</option>
            <option value="Enugu">Enugu</option>
            <option value="FCT">Federal Capital Territory</option>
            <option value="Gombe">Gombe</option>
            <option value="Imo">Imo</option>
            <option value="Jigawa">Jigawa</option>
            <option value="Kaduna">Kaduna</option>
            <option value="Kano">Kano</option>
            <option value="Katsina">Katsina</option>
            <option value="Kebbi">Kebbi</option>
            <option value="Kogi">Kogi</option>
            <option value="Kwara">Kwara</option>
            <option value="Lagos">Lagos</option>
            <option value="Nasarawa">Nasarawa</option>
            <option value="Niger">Niger</option>
            <option value="Ogun">Ogun</option>
            <option value="Ondo">Ondo</option>
            <option value="Osun">Osun</option>
            <option value="Oyo">Oyo</option>
            <option value="Plateau">Plateau</option>
            <option value="Rivers">Rivers</option>
            <option value="Sokoto">Sokoto</option>
            <option value="Taraba">Taraba</option>
            <option value="Yobe">Yobe</option>
            <option value="Zamfara">Zamfara</option>
          </select>
          <div class="invalid-feedback">Please select the state.</div>
        </div>
        <div class="col-md-4">
          <label class="form-label required">Local Government</label>
          <select class="form-select branch-lga" required disabled>
            <option value="">Select State First</option>
          </select>
          <div class="invalid-feedback">Please select the LGA.</div>
        </div>
      </div>
      
      <button type="button" class="btn btn-danger btn-sm remove-branch">Remove Branch</button>
    `;

  branchEntries.appendChild(branchEntry);

  // Add event listener to the newly created element
  branchEntry.querySelector('.branch-state').addEventListener('change', function () {
    updateLgas(this);
  });

  // Add remove event listener
  branchEntry.querySelector('.remove-branch').addEventListener('click', function () {
    branchEntries.removeChild(branchEntry);
  });


});



// Add this to your document ready function
document.getElementById('printSummary').addEventListener('click', function () {
  // Clone the review summary to avoid affecting the original
  const printContent = document.getElementById('reviewSummary').cloneNode(true);

  // Create a print-specific container
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Facility Registration Summary</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h4, h5, h6 { color: #333; }
          .card { border: 1px solid #ddd; margin-bottom: 20px; }
          .card-header { background-color: #f8f9fa; padding: 10px 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .text-center { text-align: center; }
          .text-danger { color: #dc3545; }
          .text-success { color: #28a745; }
          .mt-3 { margin-top: 1rem; }
          .mb-3 { margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h3>Facility Registration Summary</h3>
        <p>Printed on: ${new Date().toLocaleString()}</p>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
});


// Form submission
document.getElementById('SubmitButton').addEventListener('click', function (e) {
  e.preventDefault();
  if (validateSection(currentSection)) {
    registerUser();
  }
});


// Generate review summary
function generateSummary() {
  const facilityType = document.getElementById('facilityType').value;

  let html = `
        <h3 class="mb-2">Payer Information</h3>
        <img src="${imageUrlInput.value || 'assets/img/userprofile.png'}" alt="Facility Image" style="max-width:150px;max-height:150px;display:block;margin-bottom:15px;border-radius:8px;">
        <p><strong>Legal Name:</strong> ${document.getElementById('legalName').value}</p>
        <p><strong>TIN:</strong> ${document.getElementById('taxIdentificationNumber').value}</p>
        <p><strong>Category:</strong> ${document.querySelector('.selectedcat')?.getAttribute('data-name') || "Not selected"}</p>
        <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('phoneNumber').value}</p>
        <p><strong>Address:</strong> ${document.getElementById('address').value}</p>
        <p><strong>State/LGA:</strong> ${document.getElementById('state').value} / ${document.getElementById('lga').value}</p>
        
        <h3 class="mt-4 mb-2">Facility Information</h3>
        <p><strong>Facility Name:</strong> ${document.getElementById('legalName').value}</p>
        <p><strong>Facility Type:</strong> ${facilityType}</p>
        <p><strong>Registration Number:</strong> ${document.getElementById('registrationNumber').value}</p>
        <p><strong>Ownership Type:</strong> ${document.getElementById('ownershipType').value}</p>
        <p><strong>Operating License:</strong> ${document.getElementById('operatingLicenseNumber').value}</p>
        <p><strong>License Expiry:</strong> ${document.getElementById('licenseExpiryDate').value}</p>
        <p><strong>Date Established:</strong> ${document.getElementById('dateOfEstablishment').value}</p>

        <h3 class="mt-4 mb-2">Representative Information</h3>
        <p><strong>Full Name:</strong> ${document.getElementById('repName').value}</p>
        <p><strong>TIN:</strong> ${document.getElementById('repTIN').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('repemail').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('repphonenumber').value}</p>
        <p><strong>Address:</strong> ${document.getElementById('repAddress').value}</p>
    `;

  // Add facility type specific details
  html += `
  <h3 class="mt-4 mb-2">Facility Operations</h3>
    <p><strong>Number of Staff:</strong> ${document.getElementById('numberOfStaff')?.value || "0"}</p>
  <p><strong>Average Number of New Intakes per Session:</strong> ${document.getElementById('avgNewIntakes')?.value || "0"}</p>
  <p><strong>Average Number of Students:</strong> ${document.getElementById('avgStudents')?.value || "0"}</p>
  
  `;

  // Add branches if any
  if (document.getElementById('hasBranches').checked) {
    const branches = document.querySelectorAll('.branch-entry');
    if (branches.length > 0) {
      html += `<h3 class="mt-4 mb-2">Branches</h3>`;
      branches.forEach((branch, index) => {
        html += `
                    <p><strong>Branch ${index + 1}:</strong> ${branch.querySelector('.branch-name').value}</p>
                    <p><strong>Address:</strong> ${branch.querySelector('.branch-address').value}</p>
                    <p><strong>City:</strong> ${branch.querySelector('.branch-city').value}</p>
                    <p><strong>LGA:</strong> ${branch.querySelector('.branch-lga').value}</p>
                `;
      });
    }
  }
  const selectedTaxes = Array.from(document.querySelectorAll('.tax-checkbox:checked')).map(checkbox => checkbox.value);
  html += `
  <div class="tax-liabilities mt-4">
    <h5>Applicable Tax Liabilities</h5>
    <ul class="tax-list">
      ${selectedTaxes.length > 0
      ? selectedTaxes.map(tax => `<li>${tax}</li>`).join('')
      : '<li>No taxes selected</li>'
    }
    </ul>
  </div>`;

  document.getElementById('reviewSummary').innerHTML = html;


}

// Prepare payload for API submission
function preparePayload() {
  const facilityType = document.getElementById('facilityType').value;
const facilityTypeData = prepareFacilityTypeData();

  // Construct the full payload
  const payload = {
    endpoint: "NewcreateFacilityEducation",
    data: {
      payer_user: {
        tin: document.getElementById('taxIdentificationNumber').value,
        nin: "", // Will need to add this field to the form
        bvn: "", // Will need to add this field to the form
        category: document.querySelector('.selectedcat')?.getAttribute('data-name') || "corporate",
        first_name: document.getElementById('legalName').value || "",
        surname: "",
        email: document.getElementById('email').value,
        phone: document.getElementById('phoneNumber').value,
        state: document.getElementById('state').value,
        business_type: "Schools",
        employment_status: "active",
        number_of_staff: document.getElementById('staffCount')?.value || "0",
        lga: document.getElementById('lga').value,
        address: document.getElementById('address').value,
        postal_code: document.getElementById('postalCode').value,
        img: imageUrlInput.value || "assets/img/userprofile.png",
        password: generateRandomPassword(), // Helper function needed
        created_by: "enumerator",
        by_account: userInfo2?.id || null,
        business_own: document.getElementById('ownershipType').value,
        id_type: "CAC",
        id_number: document.getElementById('registrationNumber').value,
        annual_revenue: "",
        value_business: "",
        verification_status: "pending",
        verification_code: "",
        tin_status: "active",
        tin_response: yesRadio.checked ? "yes" : "no",
        rep_firstname: document.getElementById('repName').value.split(' ')[0] || "",
        rep_surname: document.getElementById('repName').value.split(' ').slice(1).join(' ') || "",
        rep_email: document.getElementById('repemail').value,
        rep_phone: document.getElementById('repphonenumber').value,
        rep_position: "",
        rep_state: document.getElementById('state').value,
        rep_lga: document.getElementById('lga').value,
        rep_address: document.getElementById('repAddress').value,
        enumlatitude: document.getElementById('latitude').value,
        enumlongitude: document.getElementById('longitude').value,
        timeIn: new Date().toISOString(),
        new_tin: "",
        industry: "Education",
        annual_income: ""
      },
      facility_education: {
        facility_name: document.getElementById('legalName').value,
        facility_type: facilityType,
        cac_rc_number: document.getElementById('registrationNumber').value,
        ownership_type: document.getElementById('ownershipType').value,
        license_number: document.getElementById('operatingLicenseNumber').value,
        liabilities: Array.from(document.querySelectorAll('.tax-checkbox:checked'))
          .map(checkbox => checkbox.value),
        license_expiry: document.getElementById('licenseExpiryDate').value,
        date_established: document.getElementById('dateOfEstablishment').value,
      },
      facility_type_data: facilityTypeData,
      branches: prepareBranchesData(),
      facility_documents: {
        cac_certificate_path: "", // Will need to handle file uploads
        operating_license_path: "" // Will need to handle file uploads
      }
    }
  };

  return payload;
}

// Helper function to map facility type to API key

// Prepare facility type specific data
function prepareFacilityTypeData() {
  // Same three fields for ALL facility types
  return {
    number_of_staff: document.getElementById('numberOfStaff')?.value || "0",
    avg_new_intakes_per_session: document.getElementById('avgNewIntakes')?.value || "0",
    avg_number_of_students: document.getElementById('avgStudents')?.value || "0"
  };
}

// Prepare branches data
function prepareBranchesData() {
  if (!document.getElementById('hasBranches').checked) return [];

  const branches = [];
  const branchEntries = document.querySelectorAll('.branch-entry');

  branchEntries.forEach(branch => {
    branches.push({
      branch_name: branch.querySelector('.branch-name').value,
      physical_address: branch.querySelector('.branch-address').value,
      city: branch.querySelector('.branch-city').value,
      lga: branch.querySelector('.branch-lga').value,
      phone_numbers: "", // Will need to add phone field to branch form
      email: "", // Will need to add email field to branch form
      website: "", // Will need to add website field to branch form
      latitude: "0.0", // Will need to add geo-tagging for branches
      longitude: "0.0"
    });
  });

  return branches;
}

// Generate random password for new payer accounts
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8);
}

// Update the registerUser function
async function registerUser() {
  if (isLoading) return;

  try {
    // Show loader
    isLoading = true;
    $("#SubmitButton").addClass("hidden");
    $("#msg_box").html(`
            <div class="flex justify-center items-center mb-4">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                <span class="ml-3">Submitting facility registration...</span>
            </div>
        `);

    // Prepare the payload
    const payload = preparePayload();

    // Submit to API
    const response = await fetch(HOST, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || result.status !== 1) {
      let errorMessage = result.message || 'Registration failed';

      // Handle specific error cases
      if (errorMessage.includes('already exists')) {
        errorMessage = 'This facility or taxpayer is already registered';
      } else if (errorMessage.includes('validation')) {
        errorMessage = 'Please check your form data and try again';
      }

      throw new Error(errorMessage);
    }

    // Success - show SweetAlert
    await Swal.fire({
      title: 'Success!',
      text: 'Facility registration completed successfully',
      icon: 'success',
      confirmButtonText: 'Continue',
      allowOutsideClick: false,
      willClose: () => {
        // Redirect or reset form
        window.location.href = `enumeration-schools-preview.html?id=${result.id}`;
      }
    }).then(() => {
      window.location.href = `enumeration-schools-preview.html?id=${result.id}`;
    })
    // Clear form after success;

  } catch (error) {
    console.error('Registration error:', error);

    // Show appropriate error message
    $("#msg_box").html(`
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong>Error!</strong> ${error.message}
                <button type="button" class="absolute top-0 bottom-0 right-0 px-4 py-3" onclick="this.parentElement.remove()">
                    <iconify-icon icon="mdi:close"></iconify-icon>
                </button>
            </div>
        `);

    // Scroll to error message
    document.getElementById('msg_box').scrollIntoView({ behavior: 'smooth' });

  } finally {
    // Hide loader
    isLoading = false;
    $("#SubmitButton").removeClass("hidden");
  }
}




function getLocationAndSubmit() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success - got GPS coordinates
        submitLocation(position.coords.latitude, position.coords.longitude, 'gps');
      },
      function (error) {
        // GPS permission denied or error - fallback to IP-based location
        console.log("Geolocation error:", error);
        getLocationFromIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Browser doesn't support Geolocation
    getLocationFromIP();
  }
}

function getRandomPlateauLocation() {
  // Plateau State, Nigeria bounding box
  // Approximate: lat 8.3 to 10.2, lon 8.2 to 10.6
  const minLat = 8.3, maxLat = 10.2;
  const minLon = 8.2, maxLon = 10.6;
  const lat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6);
  const lon = (Math.random() * (maxLon - minLon) + minLon).toFixed(6);
  return { lat, lon };
}

function getLocationFromIP() {
  // Using ip-api.com's free service (no API key needed)
  fetch('http://ip-api.com/json/?fields=lat,lon')
    .then(response => response.json())
    .then(data => {
      if (data.lat && data.lon) {
        submitLocation(data.lat, data.lon, 'ip');
      } else {
        console.error("Could not get location from IP");
        const plateauLocation = getRandomPlateauLocation();
        submitLocation(plateauLocation.lat, plateauLocation.lon, 'failed');
      }
    })
    .catch(error => {
      console.error("IP location error:", error);
      const plateauLocation = getRandomPlateauLocation();
      submitLocation(plateauLocation.lat, plateauLocation.lon, 'failed');
    });
}

function submitLocation(lat, lon, source) {
  // console.log(`Submitting location: ${lat}, ${lon} from ${source}`);
  // Set the form values
  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lon;

}

$(document).ready(function () {
  getLocationAndSubmit();
});

// Camera variables
let stream = null;
const video = document.getElementById('video');
const imagePreview = document.getElementById('imagePreview');
const imageUrlInput = document.getElementById('imageUrl');

// Open camera
function openCamera() {
  const cameraModal = document.getElementById('cameraModal');
  cameraModal.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (mediaStream) {
      stream = mediaStream;
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access the camera. Please check permissions.");
    });
}

// Close camera
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  document.getElementById('cameraModal').classList.add('hidden');
}

// Capture photo from camera
function capturePhoto() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async function (blob) {
    try {
      await uploadImageToPublitio(blob);
    } catch (error) {
      alert(error.message);
    }
  }, 'image/jpeg', 0.95);

  closeCamera();
}

// Handle file upload
async function handleFileUpload(files) {
  if (files && files[0]) {
    if (files[0].size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      await uploadImageToPublitio(files[0]);
    } catch (error) {
      alert(error.message);
    }
  }
}

// Upload to Publitio
const publitio = new PublitioAPI(publitioKey1, publitioKey2);

async function uploadImageToPublitio(file) {
  // Show loading state
  imagePreview.src = 'https://i.gifer.com/ZZ5H.gif'; // Online loading GIF
  $("#uploaderContinua").prop("disabled", true)

  try {
    // Upload using SDK
    const uploadResponse = await publitio.uploadFile(file, 'file', {
      folder: 'taxpayer_profiles',
      public_id: 'profile_' + Date.now(),
      title: 'Profile Picture'
    });

    // Update preview and hidden input
    imagePreview.src = uploadResponse.url_preview;
    imageUrlInput.value = uploadResponse.url_preview;

    $("#uploaderContinua").prop("disabled", false)
    return uploadResponse.url_preview;
  } catch (error) {
    $("#uploaderContinua").prop("disabled", false)
    console.error('Upload error:', error);
    imagePreview.src = 'assets/img/userprofile.png';
    throw new Error('Failed to upload image: ' + error.message);
  }
}