let isLoading = false;

document.addEventListener('DOMContentLoaded', function () {

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
              <input class="form-check-input" type="radio" name="tinType" id="jtbTin" value="JTB" checked>
              <label class="form-check-label" for="jtbTin">
                JTB TIN (Joint Tax Board)
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="tinType" id="plateauTin" value="PlateauIGR">
              <label class="form-check-label" for="plateauTin">
                Plateau IGR TIN
              </label>
            </div>
          </div>
          <div class="mt-3">
            <label for="tinNumber" class="form-label required">TIN Number</label>
            <input placeholder='Enter your TIN number' type="text" class="form-control" id="tinNumber" name="tinNumber" required>
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
          <!-- <a href="../generatetin.html?callback=./hospital/enumeration-hospital.html" type="button" class="button" id="generateTIN">Generate TIN</a> -->
          <button class="button" type="button" id="proceedWithoutTIN">
            Proceed 
          </button>
        </div>
      `;
      document.getElementById('proceedWithoutTIN').addEventListener('click', function () {
        // Proceed without TIN logic
        currentSection++;
        showSection(currentSection);
      });
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
        document.getElementById('legalName').value = `${data.user.first_name} ${data.user.surname}`;
        document.getElementById('taxIdentificationNumber').value = data.user.tin;
        document.getElementById('address').value = data.user.address;
        document.getElementById('city').value = data.user.lga; // Assuming city is same as LGA
        document.getElementById('lga').value = data.user.lga;
        document.getElementById('state').value = data.user.state;
        document.getElementById('phoneNumber').value = data.user.phone;
        document.getElementById('email').value = data.user.email;

        // Representative fields (using user data if rep fields are empty in response)
        document.getElementById('repName').value = data.user.rep_firstname !== "null" ?
          `${data.user.rep_firstname} ${data.user.rep_surname}` :
          `${data.user.first_name} ${data.user.surname}`;

        document.getElementById('repemail').value = data.user.rep_email !== "null" ?
          data.user.rep_email : data.user.email;

        document.getElementById('repphonenumber').value = data.user.rep_phone !== "null" ?
          data.user.rep_phone : data.user.phone;

        document.getElementById('repTIN').value = data.user.tin;
        document.getElementById('repAddress').value = data.user.rep_address !== "null" ?
          data.user.rep_address : data.user.address;

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

      // Special validation for multi-select
      if (input.id === 'issuingAuthority' && input.required) {
        const select = input;
        if (select.selectedOptions.length === 0) {
          select.classList.add('is-invalid');
          isValid = false;
        } else {
          select.classList.remove('is-invalid');
        }
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


  // Generate operations content based on facility type
  document.getElementById('facilityType').addEventListener('change', function () {
    const facilityType = this.value;
    const operationsContent = document.getElementById('operationsContent');

    // Clear previous content
    operationsContent.innerHTML = '';

    if (!facilityType) return;

    // Generate content based on facility type
    let html = '';

    if (facilityType.includes('Primary Healthcare Facility')) {
      html = `
    <!-- General Information -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Departments</label>
        <input type="number" class="form-control" id="departmentsCount" required>
        <div class="invalid-feedback">Please provide the number of departments.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Wards</label>
        <input type="number" class="form-control" id="wardsCount" required>
        <div class="invalid-feedback">Please provide the number of wards.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Number of Staff</label>
        <input type="number" class="form-control" id="staffCount" required>
        <div class="invalid-feedback">Please provide the average number of staff.</div>
      </div>
    </div>

    <!-- Outpatient Consultation & Treatment -->
    <h5 class="mt-4">Outpatient Consultation & Treatment</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Services Offered</label>
        <select class="multiple-select" id="outpatientServices" multiple required>
          <option value="General Consultation">General Medical Consultation (e.g., malaria, typhoid)</option>
          <option value="Minor Wound Care">Minor Wound Care / Dressing</option>
          <option value="Minor Injuries">Management of Minor Injuries</option>
          <option value="First Aid">First Aid for Emergencies (before referral)</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Standard Consultation Fee (₦)</label>
        <input type="number" class="form-control" id="consultationFee" required>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Average Number of Consultations per Week</label>
        <input type="number" class="form-control" id="consultationsPerWeek" required>
      </div>
    </div>

    <!-- Maternal & Child Health Services -->
    <h5 class="mt-4">Maternal & Child Health (MCH) Services</h5>
    <div class="row mb-3">
      <div class="col-md-3">
        <label class="form-label required">ANC Fee – Initial Visit (₦)</label>
        <input type="number" class="form-control" id="ancInitialFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">ANC Fee – Subsequent Visit (₦)</label>
        <input type="number" class="form-control" id="ancSubsequentFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Pregnant Women per Week</label>
        <input type="number" class="form-control" id="pregnantWomenWeekly" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Deliveries per Week</label>
        <input type="number" class="form-control" id="deliveriesWeekly" required>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Postnatal Care Fee (₦)</label>
        <input type="number" class="form-control" id="postnatalFee" required>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Is Immunization Free?</label>
        <select class="form-select" id="immunizationFree" required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <!-- Family Planning Services -->
    <h5 class="mt-4">Family Planning Services</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Family Planning Methods Offered</label>
        <select class="multiple-select" id="familyPlanningServices" multiple required>
          <option value="Oral Pills">Oral Contraceptive Pills (OCPs)</option>
          <option value="Injectables">Injectable Contraceptives</option>
          <option value="Implants">Contraceptive Implants (Insertion/Removal)</option>
          <option value="IUDs">Intrauterine Devices (IUDs)</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost for Injectable Contraceptive (₦)</label>
        <input type="number" class="form-control" id="injectableCost" required>
      </div>
    </div>

    <!-- Basic Diagnostics -->
    <h5 class="mt-4">Basic Diagnostics</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Tests Offered</label>
        <select class="multiple-select" id="basicTests" multiple required>
          <option value="Malaria Test">Malaria Parasite Test</option>
          <option value="Blood Group">Blood Grouping</option>
          <option value="Genotype">Genotype Test</option>
          <option value="Urinalysis">Urinalysis</option>
          <option value="Blood Glucose">Blood Glucose Test</option>
          <option value="HIV Rapid">HIV Rapid Test</option>
          <option value="Hepatitis Screening">Hepatitis B/C Screening</option>
          <option value="Pregnancy Test">Pregnancy Test (Urine)</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Malaria Test (₦)</label>
        <input type="number" class="form-control" id="malariaTestCost" required>
      </div>
    </div>

    <!-- Pharmacy / Drug Dispensing -->
    <h5 class="mt-4">Pharmacy / Drug Dispensing</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Do you have an On-site Pharmacy?</label>
        <select class="form-select" id="hasPharmacy" required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  `;
    } else if (facilityType.includes('Secondary Healthcare Facility')) {
      html = `
    <!-- General Information -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Departments</label>
        <input type="number" class="form-control" id="departmentsCount" required>
        <div class="invalid-feedback">Please provide the number of departments.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Wards</label>
        <input type="number" class="form-control" id="wardsCount" required>
        <div class="invalid-feedback">Please provide the number of wards.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Total Number of Staff</label>
        <input type="number" class="form-control" id="staffCount" required>
        <div class="invalid-feedback">Please provide total number of staff.</div>
      </div>
    </div>

    <!-- Eye Clinic Subsection -->
    <h5 class="mt-4">Eye Clinic – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Eye Services Offered</label>
        <select class="multiple-select" id="eyeServices" multiple required>
          <option value="Glaucoma Tests and Surgery">Glaucoma Tests and Surgery</option>
          <option value="AMD Tests">Age-Related Macular Degeneration (AMD) Test</option>
          <option value="Retina Tests and Surgery">Retina Tests and Surgery</option>
          <option value="Cataract Surgery">Cataract Surgery</option>
          <option value="Pterygium Surgery">Pterygium Surgery</option>
          <option value="General Vision Screening">General Vision Screening / Eye Test</option>
          <option value="Optical Dispensing">Optical Dispensing (Glasses & Frames)</option>
          <option value="Contact Lens Fitting">Contact Lens Fitting & Dispensing</option>
          <option value="Pediatric Eye Care">Pediatric Eye Care Services</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Fee for Eye Test (₦)</label>
        <input type="number" class="form-control" id="eyeTestFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Cost of Eye Drops (₦)</label>
        <input type="number" class="form-control" id="eyeDropsCost" required>
      </div>
    </div>

    <!-- Maternity & Gynaecology Subsection -->
    <h5 class="mt-4">Maternity & Gynaecology – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Services Offered</label>
        <select class="multiple-select" id="maternityServices" multiple required>
          <option value="Antenatal Care">Antenatal Care</option>
          <option value="Postnatal Care">Postnatal Care</option>
          <option value="Ultrasound Scans">Ultrasound Scans</option>
          <option value="Prenatal Diagnostic Tests">Prenatal Diagnostic Tests</option>
          <option value="Family Planning Services">Family Planning Services</option>
          <option value="Cancer Screening">Cancer Screening & Cervical Procedures</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Consultation Fee with Gynecologist (₦)</label>
        <input type="number" class="form-control" id="gyneConsultationFee" required>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Average Normal Delivery Fee (₦)</label>
        <input type="number" class="form-control" id="normalDeliveryFee" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average C-Section Fee (₦)</label>
        <input type="number" class="form-control" id="cSectionFee" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Labour Wards/Beds</label>
        <input type="number" class="form-control" id="labourWards" required>
      </div>
    </div>

    <!-- Dental Subsection -->
    <h5 class="mt-4">Dental Clinic – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Dental Services Offered</label>
        <select class="multiple-select" id="dentalServices" multiple required>
          <option value="Teeth Whitening">Teeth Whitening</option>
          <option value="Dental Implants">Dental Implants</option>
          <option value="Scaling & Polishing">Scaling & Polishing</option>
          <option value="Simple Extractions">Simple Extractions</option>
          <option value="Orthodontic Wiring (Braces)">Orthodontic Wiring (Braces)</option>
          <option value="Root Canal Treatment">Root Canal Treatment</option>
          <option value="Oral and Maxillofacial Surgery">Oral & Maxillofacial Surgery</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Teeth Whitening Cost (₦)</label>
        <input type="number" class="form-control" id="teethWhiteningCost" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Implant Cost (₦)</label>
        <input type="number" class="form-control" id="implantCost" required>
      </div>
    </div>

    <!-- Imaging / Radiology Subsection -->
    <h5 class="mt-4">Imaging & Radiology – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Radiology Services Offered</label>
        <select class="multiple-select" id="radiologyServices" multiple required>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound (Doppler, 4D)</option>
          <option value="X-Ray">Digital X-Ray</option>
          <option value="Mammography">Mammography</option>
          <option value="Echocardiography">Echocardiography</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average MRI Fee (₦)</label>
        <input type="number" class="form-control" id="mriFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average CT Scan Fee (₦)</label>
        <input type="number" class="form-control" id="ctFee" required>
      </div>
    </div>

    <!-- Laboratory Subsection -->
    <h5 class="mt-4">Diagnostic Laboratory – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Lab Services Offered</label>
        <select class="multiple-select" id="labServices" multiple required>
          <option value="Clinical Chemistry">Clinical Chemistry</option>
          <option value="Haematology">Haematology</option>
          <option value="Microbiology & Parasitology">Microbiology & Parasitology</option>
          <option value="Serology & Immunology">Serology & Immunology</option>
          <option value="Histopathology & Cytopathology">Histopathology & Cytopathology</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Genotype Test (₦)</label>
        <input type="number" class="form-control" id="genotypeTestCost" required>
      </div>
    </div>
  `;
    } else if (facilityType.includes('Tertiary Healthcare Facilities')) {
      html = `
    <!-- General Information -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Departments</label>
        <input type="number" class="form-control" id="departmentsCount" required>
        <div class="invalid-feedback">Please provide the number of departments.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Wards</label>
        <input type="number" class="form-control" id="wardsCount" required>
        <div class="invalid-feedback">Please provide the number of wards.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Total Number of Staff</label>
        <input type="number" class="form-control" id="staffCount" required>
        <div class="invalid-feedback">Please provide total number of staff.</div>
      </div>
    </div>

    <!-- Eye Clinic Subsection -->
    <h5 class="mt-4">Eye Clinic – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Eye Services Offered</label>
        <select class="multiple-select" id="eyeServices" multiple required>
          <option value="Glaucoma Tests and Surgery">Glaucoma Tests and Surgery</option>
          <option value="AMD Tests">Age-Related Macular Degeneration (AMD) Test</option>
          <option value="Retina Tests and Surgery">Retina Tests and Surgery</option>
          <option value="Cataract Surgery">Cataract Surgery</option>
          <option value="Pterygium Surgery">Pterygium Surgery</option>
          <option value="General Vision Screening">General Vision Screening / Eye Test</option>
          <option value="Optical Dispensing">Optical Dispensing (Glasses & Frames)</option>
          <option value="Contact Lens Fitting">Contact Lens Fitting & Dispensing</option>
          <option value="Pediatric Eye Care">Pediatric Eye Care Services</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Fee for Eye Test (₦)</label>
        <input type="number" class="form-control" id="eyeTestFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Cost of Eye Drops (₦)</label>
        <input type="number" class="form-control" id="eyeDropsCost" required>
      </div>
    </div>

    <!-- Maternity & Gynaecology Subsection -->
    <h5 class="mt-4">Maternity & Gynaecology – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Services Offered</label>
        <select class="multiple-select" id="maternityServices" multiple required>
          <option value="Antenatal Care">Antenatal Care</option>
          <option value="Postnatal Care">Postnatal Care</option>
          <option value="Ultrasound Scans">Ultrasound Scans</option>
          <option value="Prenatal Diagnostic Tests">Prenatal Diagnostic Tests</option>
          <option value="Family Planning Services">Family Planning Services</option>
          <option value="Cancer Screening">Cancer Screening & Cervical Procedures</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Consultation Fee with Gynecologist (₦)</label>
        <input type="number" class="form-control" id="gyneConsultationFee" required>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Average Normal Delivery Fee (₦)</label>
        <input type="number" class="form-control" id="normalDeliveryFee" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average C-Section Fee (₦)</label>
        <input type="number" class="form-control" id="cSectionFee" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Labour Wards/Beds</label>
        <input type="number" class="form-control" id="labourWards" required>
      </div>
    </div>

    <!-- Dental Subsection -->
    <h5 class="mt-4">Dental Clinic – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Dental Services Offered</label>
        <select class="multiple-select" id="dentalServices" multiple required>
          <option value="Teeth Whitening">Teeth Whitening</option>
          <option value="Dental Implants">Dental Implants</option>
          <option value="Scaling & Polishing">Scaling & Polishing</option>
          <option value="Simple Extractions">Simple Extractions</option>
          <option value="Orthodontic Wiring (Braces)">Orthodontic Wiring (Braces)</option>
          <option value="Root Canal Treatment">Root Canal Treatment</option>
          <option value="Oral and Maxillofacial Surgery">Oral & Maxillofacial Surgery</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Teeth Whitening Cost (₦)</label>
        <input type="number" class="form-control" id="teethWhiteningCost" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Implant Cost (₦)</label>
        <input type="number" class="form-control" id="implantCost" required>
      </div>
    </div>

    <!-- Imaging / Radiology Subsection -->
    <h5 class="mt-4">Imaging & Radiology – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Radiology Services Offered</label>
        <select class="multiple-select" id="radiologyServices" multiple required>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound (Doppler, 4D)</option>
          <option value="X-Ray">Digital X-Ray</option>
          <option value="Mammography">Mammography</option>
          <option value="Echocardiography">Echocardiography</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average MRI Fee (₦)</label>
        <input type="number" class="form-control" id="mriFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average CT Scan Fee (₦)</label>
        <input type="number" class="form-control" id="ctFee" required>
      </div>
    </div>

    <!-- Laboratory Subsection -->
    <h5 class="mt-4">Diagnostic Laboratory – Services & Revenue</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Lab Services Offered</label>
        <select class="multiple-select" id="labServices" multiple required>
          <option value="Clinical Chemistry">Clinical Chemistry</option>
          <option value="Haematology">Haematology</option>
          <option value="Microbiology & Parasitology">Microbiology & Parasitology</option>
          <option value="Serology & Immunology">Serology & Immunology</option>
          <option value="Histopathology & Cytopathology">Histopathology & Cytopathology</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Genotype Test (₦)</label>
        <input type="number" class="form-control" id="genotypeTestCost" required>
      </div>
    </div>

    <!-- Surgery & ICU Subsection -->
    <h5 class="mt-4">Surgical & Critical Care Services</h5>
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Operating Theatres</label>
        <input type="number" class="form-control" id="operatingTheatres" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Cost of Major Surgery (₦)</label>
        <input type="number" class="form-control" id="majorSurgeryCost" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Cost of Minor Surgery (₦)</label>
        <input type="number" class="form-control" id="minorSurgeryCost" required>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Number of ICU Beds</label>
        <input type="number" class="form-control" id="icuBeds" required>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Daily Charge for ICU Bed (₦)</label>
        <input type="number" class="form-control" id="icuDailyCharge" required>
      </div>
    </div>
  `;
    } else if (facilityType.includes('Private Hospitals/Clinics')) {
      html = `
    <!-- General Information -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Departments</label>
        <input type="number" class="form-control" id="departmentsCount" required>
        <div class="invalid-feedback">Please provide the number of departments.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Wards</label>
        <input type="number" class="form-control" id="wardsCount" required>
        <div class="invalid-feedback">Please provide the number of wards.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Total Number of Staff</label>
        <input type="number" class="form-control" id="staffCount" required>
        <div class="invalid-feedback">Please provide total number of staff.</div>
      </div>
    </div>

    <!-- Core Clinical Services -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Primary Services Offered</label>
        <select class="multiple-select" id="primaryServices" multiple required>
          <option value="General Medical Consultation">General Medical Consultation</option>
          <option value="Minor Wound Care/Dressing">Minor Wound Care/Dressing</option>
          <option value="Management of Minor Injuries">Management of Minor Injuries</option>
          <option value="First Aid for Emergencies">First Aid for Emergencies</option>
          <option value="Antenatal Care">Antenatal Care</option>
          <option value="Postnatal Care">Postnatal Care</option>
          <option value="Ultrasound Scans">Ultrasound Scans</option>
          <option value="Prenatal Diagnostic Tests">Prenatal Diagnostic Tests</option>
          <option value="Child Health & Immunization">Child Health & Immunization</option>
          <option value="Family Planning Services">Family Planning Services</option>
        </select>
        <div class="invalid-feedback">Please select at least one service.</div>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Major Equipment in Facility</label>
        <select class="multiple-select" id="majorEquipment" multiple>
          <option value="MRI Scanner">MRI Scanner</option>
          <option value="CT Scanner">CT Scanner</option>
          <option value="X-ray Machine">X-ray Machine</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="Dialysis Machines">Dialysis Machines</option>
          <option value="Anesthesia Machines">Anesthesia Machines</option>
          <option value="Ventilators">Ventilators</option>
          <option value="Mammography Machine">Mammography Machine</option>
        </select>
      </div>
    </div>

    <!-- Revenue Related Questions -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Standard Consultation Fee (₦)</label>
        <input type="number" class="form-control" id="consultationFee" required>
        <div class="invalid-feedback">Please provide consultation fee.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Charge for Normal Delivery (₦)</label>
        <input type="number" class="form-control" id="normalDeliveryCost" required>
        <div class="invalid-feedback">Please provide average cost for normal delivery.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Fee for Caesarean Section (₦)</label>
        <input type="number" class="form-control" id="cSectionCost" required>
        <div class="invalid-feedback">Please provide average cost for C-section.</div>
      </div>
    </div>

    <!-- Capacity / Operations -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Number of Beds</label>
        <input type="number" class="form-control" id="numberOfBeds" required>
        <div class="invalid-feedback">Please provide number of beds.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Monthly Patient Visits</label>
        <input type="number" class="form-control" id="avgMonthlyPatientVisits" required>
        <div class="invalid-feedback">Please provide monthly patient visits.</div>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Number of Surgeries/Procedures per Month</label>
        <input type="number" class="form-control" id="surgeriesPerMonth" required>
        <div class="invalid-feedback">Please provide surgeries per month.</div>
      </div>
    </div>
  `;
    } else if (facilityType.includes('Maternity Home')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              
              <!-- Assisted Reproductive Technologies (ART) -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Assisted Reproductive Technologies (ART)</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artInfertilityEval">
                      <label class="form-check-label">Detailed Infertility Evaluation</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artIUI">
                      <label class="form-check-label">Intrauterine Insemination (IUI)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artIVF">
                      <label class="form-check-label">In-Vitro Fertilization (IVF)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artICSI">
                      <label class="form-check-label">Intracytoplasmic Sperm Injection (ICSI)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artSpermRetrieval">
                      <label class="form-check-label">Surgical Sperm Retrieval</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artCryopreservation">
                      <label class="form-check-label">Cryopreservation</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artAssistedHatching">
                      <label class="form-check-label">Assisted Hatching (Laser)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="artNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
              
              <!-- Specialized Gynaecological Procedures -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Specialized Gynaecological / Reproductive Tests & Procedures</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gynLaparoscopy">
                      <label class="form-check-label">Laparoscopy</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gynHysteroscopy">
                      <label class="form-check-label">Hysteroscopy</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gynFistulaManagement">
                      <label class="form-check-label">Management of Fistulas, Incontinence, and Prolapse</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gynOther">
                      <label class="form-check-label">Other (specify):</label>
                      <input type="text" class="form-control mt-1" id="gynOtherSpecify" placeholder="Specify other procedures">
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="gynNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
              
              <!-- Cancer Screening & Cervical Procedures -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Cancer Screening & Cervical Procedures</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerCervicalScreening">
                      <label class="form-check-label">Cervical Cancer Screening / HPV Vaccination</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerOvarianScreening">
                      <label class="form-check-label">Ovarian Cancer Screening</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerBreastScreening">
                      <label class="form-check-label">Breast Cancer Screening</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerColposcopy">
                      <label class="form-check-label">Colposcopy</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerCervicalCauterization">
                      <label class="form-check-label">Cervical Cauterization / Cold Coagulation</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="cancerNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
              
              <!-- Family Planning Services -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Family Planning Services</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="fpImplant">
                      <label class="form-check-label">Contraceptive Implant Insertion & Removal</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="fpInjectable">
                      <label class="form-check-label">Injectable Contraceptives</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="fpPills">
                      <label class="form-check-label">Oral Contraceptive Pills (COCs and POPs)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="fpNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
              
              <!-- Obstetrics & Maternity Services -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Obstetrics & Maternity Services</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="obsAntenatal">
                      <label class="form-check-label">Antenatal Care</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="obsPostnatal">
                      <label class="form-check-label">Postnatal Care</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="obsUltrasound">
                      <label class="form-check-label">Ultrasound Scans</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="obsPrenatalTests">
                      <label class="form-check-label">Prenatal Diagnostic Tests (CVS, Amniocentesis, Harmony Test, NT)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="obsNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
              
              <!-- Pediatric Services -->
              <div class="col-md-12 mb-3">
                  <label class="form-label">Pediatric Services</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="pedsNewborn">
                      <label class="form-check-label">Newborn / Well-Child Services (Neurodevelopment, Respiratory)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="pedsSickleCell">
                      <label class="form-check-label">Sickle-Cell & Nephrology Clinics</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="pedsPICU">
                      <label class="form-check-label">Pediatric Intensive Care Unit (PICU)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="pedsImmunizations">
                      <label class="form-check-label">Immunizations</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="pedsNone">
                      <label class="form-check-label">None</label>
                  </div>
              </div>
          </div>
          
          <!-- ===== REVENUE-RELATED QUESTIONS ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Revenue & Capacity</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Standard Consultation Fee (Consultant Gynecologist)</label>
                  <input type="number" class="form-control" id="consultationFee" required>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Number of Labour Wards/Beds</label>
                  <input type="number" class="form-control" id="labourWards" required>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Fee for Ultrasound Scan</label>
                  <input type="number" class="form-control" id="ultrasoundFee" required>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Fee for Antenatal Care (Package/Visit)</label>
                  <input type="number" class="form-control" id="antenatalFee" required>
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Charge for Normal Delivery</label>
                  <input type="number" class="form-control" id="normalDeliveryFee" required>
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Fee for Caesarean Section (C-section)</label>
                  <input type="number" class="form-control" id="csectionFee" required>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Fee for Epidural/Labour Pain Relief (if applicable)</label>
                  <input type="number" class="form-control" id="epiduralFee">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Cost of Contraceptive Implant (Insertion/Removal)</label>
                  <input type="number" class="form-control" id="implantCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Number of Antenatal/Postnatal Visits per Week</label>
                  <input type="number" class="form-control" id="visitsPerWeek" required>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Number of Births per Week</label>
                  <input type="number" class="form-control" id="birthsPerWeek" required>
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost of Cervical Cancer Screening</label>
                  <input type="number" class="form-control" id="cervicalScreeningCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost per HPV Vaccine Dose</label>
                  <input type="number" class="form-control" id="hpvVaccineCost">
              </div>
          </div>
          
          <!-- ===== STAFFING ===== -->
          <div class="row mb-3">
              <div class="col-md-6">
                  <label class="form-label required">Average Number of Employees</label>
                  <input type="number" class="form-control" id="numberOfEmployees" required>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Dental Clinic')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              <div class="col-md-12">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceWhitening">
                      <label class="form-check-label">Teeth Whitening</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceImplants">
                      <label class="form-check-label">Dental Implants</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceScaling">
                      <label class="form-check-label">Scaling & Polishing (Routine Cleaning)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceExtractions">
                      <label class="form-check-label">Simple Extractions</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceBraces">
                      <label class="form-check-label">Orthodontic Wiring (Braces)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceFillings">
                      <label class="form-check-label">Composite, GIC, or Amalgam Fillings (Restorations)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceJawFixation">
                      <label class="form-check-label">Inter-Maxillary Fixation (Jaw Stabilization)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceRootTip">
                      <label class="form-check-label">Apicectomy (Root-Tip Surgery)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceRootCanal">
                      <label class="form-check-label">Root Canal Treatment</label>
                  </div>
              </div>
          </div>

          <!-- ===== PRICING & REVENUE INDICATORS ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Pricing & Revenue Indicators</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Average Cost for Teeth Whitening</label>
                  <input type="number" class="form-control" id="whiteningCost" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Average Cost of a Dental Implant (Including Crown)</label>
                  <input type="number" class="form-control" id="implantCost" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Typical Fee for Scaling & Polishing</label>
                  <input type="number" class="form-control" id="scalingCost" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Cost of a Simple Extraction</label>
                  <input type="number" class="form-control" id="extractionCost" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Typical Cost for Orthodontic Wiring (Braces) per Arch</label>
                  <input type="number" class="form-control" id="bracesCost" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
          </div>

          <!-- ===== OPERATIONS OVERVIEW ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Operations Overview</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Average Number of Patients per Week</label>
                  <input type="number" class="form-control" id="patientsPerWeek" required>
                  <div class="invalid-feedback">Please provide the number of patients.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Number of Dental Chairs/Units</label>
                  <input type="number" class="form-control" id="dentalChairs" required>
                  <div class="invalid-feedback">Please provide the number of chairs.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Number of Clinical Staff (Dentists, Hygienists, Assistants)</label>
                  <input type="number" class="form-control" id="clinicalStaff" required>
                  <div class="invalid-feedback">Please provide the number of staff.</div>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Imaging / Radiology Centre')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              <div class="col-md-12">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMRI">
                      <label class="form-check-label">Magnetic Resonance Imaging (MRI)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceCT">
                      <label class="form-check-label">Computed Tomography (CT)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceUltrasound">
                      <label class="form-check-label">Ultrasound (including 4D and Doppler scans)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceXRay">
                      <label class="form-check-label">Digital X-Ray & Contrast Studies</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMammography">
                      <label class="form-check-label">Mammography & Breast Imaging (including 3D Tomosynthesis)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceEchocardiography">
                      <label class="form-check-label">Echocardiography (Adult, Fetal, Neonatal)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceFibroscan">
                      <label class="form-check-label">Fibroscan (Liver Elastography)</label>
                  </div>
              </div>
          </div>

          <!-- ===== PRICING INFORMATION ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Pricing Information</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Average Fee for MRI Scan</label>
                  <input type="number" class="form-control" id="mriFee" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Average Fee for CT Scan</label>
                  <input type="number" class="form-control" id="ctFee" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Average Price for Obstetric Ultrasound</label>
                  <input type="number" class="form-control" id="obstetricUltrasoundFee" required>
                  <div class="invalid-feedback">Please provide the price.</div>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Fee for Standard X-Ray</label>
                  <input type="number" class="form-control" id="xrayFee" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Cost of 3D Tomosynthesis Mammogram</label>
                  <input type="number" class="form-control" id="mammogram3dFee" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
          </div>

          <!-- ===== OPERATIONAL CAPACITY ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Operational Capacity</h5>
              
              <div class="col-md-6">
                  <label class="form-label required">Average Number of Scans/Procedures per Week</label>
                  <input type="number" class="form-control" id="scansPerWeek" required>
                  <div class="invalid-feedback">Please provide the number of scans.</div>
              </div>
              <div class="col-md-6">
                  <label class="form-label required">Number of Staff (Radiologists, Technicians, Support)</label>
                  <input type="number" class="form-control" id="staffCount" required>
                  <div class="invalid-feedback">Please provide the number of staff.</div>
              </div>
          </div>

          <!-- ===== EQUIPMENT ===== -->
          <div class="row mb-3">
              <div class="col-md-12">
                  <label class="form-label required">Type of Major Equipment</label>
                  <select class="multiple-select" id="majorEquipment" multiple required>
                      <option value="MRI Scanner">MRI Scanner</option>
                      <option value="CT Scanner">CT Scanner</option>
                      <option value="X-ray machine">X-ray machine</option>
                      <option value="Ultrasound Machine">Ultrasound Machine</option>
                      <option value="Mammography Machine">Mammography Machine</option>
                      <option value="Fluoroscopy">Fluoroscopy</option>
                      <option value="Angiography">Angiography</option>
                      <option value="Echocardiography Machine">Echocardiography Machine</option>
                      <option value="Fibroscan Machine">Fibroscan Machine</option>
                  </select>
                  <div class="invalid-feedback">Please select at least one equipment type.</div>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Eye Clinic')) {
      html = `
    <!-- Services Offered -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Services Offered</label>
        <select class="multiple-select" id="eyeServices" multiple required>
          <option value="Glaucoma Tests">Glaucoma Tests</option>
          <option value="Glaucoma Surgery">Glaucoma Surgery</option>
          <option value="AMD Test">Age-Related Macular Degeneration (AMD) Test</option>
          <option value="Retina Tests">Retina Tests</option>
          <option value="Retina Surgery">Retina Surgery</option>
          <option value="Cataract Surgery">Cataract Surgery</option>
          <option value="Chalazion Surgery">Chalazion Surgery</option>
          <option value="Pterygium Surgery">Pterygium Surgery</option>
          <option value="Vision Screening">General Vision Screening / Eye Test</option>
          <option value="Optical Dispensing">Optical Dispensing (Glasses and Frames)</option>
          <option value="Contact Lens Fitting">Contact Lens Fitting and Dispensing</option>
          <option value="Pediatric Eye Care">Pediatric Eye Care Services</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Standard Fee for Eye Test (₦)</label>
        <input type="number" class="form-control" id="eyeTestFee" required>
      </div>
      <div class="col-md-3">
        <label class="form-label required">Average Cost of Sodium Hyaluronate Drops (₦)</label>
        <input type="number" class="form-control" id="eyeDropsCost" required>
      </div>
    </div>

    <!-- Optical Dispensing -->
    <h5 class="mt-4">Optical Dispensing</h5>
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label required">Do you have an Optical Dispensing Unit?</label>
        <select class="form-select" id="hasOpticalUnit" required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Typical Price Range for Eyeglasses (₦)</label>
        <input type="number" class="form-control" id="eyeglassesPriceRange" required>
      </div>
      <div class="col-md-4">
        <label class="form-label required">Average Number of Eyeglasses Dispensed per Month</label>
        <input type="number" class="form-control" id="glassesDispensedPerMonth" required>
      </div>
    </div>

    <!-- Contact Lens Services -->
    <h5 class="mt-4">Contact Lens Services</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Do you provide Contact Lens Fitting Services?</label>
        <select class="form-select" id="contactLensService" required>
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Contact Lens Fitting (₦)</label>
        <input type="number" class="form-control" id="contactLensCost" required>
      </div>
    </div>

    <!-- Eye Surgeries -->
    <h5 class="mt-4">Eye Surgeries (Based on Services Selected)</h5>
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Retina Surgery (₦)</label>
        <input type="number" class="form-control" id="retinaSurgeryCost" required>
      </div>
      <div class="col-md-6">
        <label class="form-label required">Average Cost of Glaucoma Surgery (₦)</label>
        <input type="number" class="form-control" id="glaucomaSurgeryCost" required>
      </div>
    </div>

    <!-- Staffing -->
    <div class="row mb-3">
      <div class="col-md-12">
        <label class="form-label required">Average Number of Staff (Ophthalmologists & Optometrists)</label>
        <input type="number" class="form-control" id="eyeClinicStaffCount" required>
      </div>
    </div>
  `;
    } else if (facilityType.includes('Rehabilitation Centre')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              
              <!-- Mental Health & Counseling -->
              <div class="col-md-12 mb-3">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMentalHealth">
                      <label class="form-check-label">Mental Health & Counseling Services</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceAddiction">
                      <label class="form-check-label">Addiction (Detox) Treatment</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="servicePsychiatric">
                      <label class="form-check-label">Psychiatric & Therapy Programs</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceFamilyTherapy">
                      <label class="form-check-label">Family and Group Therapy</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceNeuroRehab">
                      <label class="form-check-label">Physical & Neuro-Rehabilitation</label>
                  </div>
              </div>
          </div>

          <!-- ===== PROGRAM AVAILABILITY ===== -->
          <div class="row mb-3">
              <div class="col-md-12">
                  <label class="form-label">Do you offer a drug detox program?</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="detoxProgram" id="detoxYes" value="yes">
                      <label class="form-check-label" for="detoxYes">Yes</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="detoxProgram" id="detoxNo" value="no">
                      <label class="form-check-label" for="detoxNo">No</label>
                  </div>
              </div>
          </div>

          <!-- ===== REVENUE INDICATORS ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Revenue Indicators</h5>
              
              <div class="col-md-4">
                  <label class="form-label">Average Cost of Complete Drug Detox Program</label>
                  <input type="number" class="form-control" id="detoxCost">
              </div>
              <div class="col-md-4">
                  <label class="form-label">Typical Consultation Fee (Mental Health/Psychiatric)</label>
                  <input type="number" class="form-control" id="mentalHealthFee">
              </div>
              <div class="col-md-4">
                  <label class="form-label">Average Cost for Trauma/PTSD Session</label>
                  <input type="number" class="form-control" id="traumaSessionFee">
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Fee for Physiotherapy Session</label>
                  <input type="number" class="form-control" id="physioFee">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost per Therapy Session (Mental Health)</label>
                  <input type="number" class="form-control" id="therapySessionFee">
              </div>
          </div>

          <!-- ===== CAPACITY ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Capacity</h5>
              
              <div class="col-md-6">
                  <label class="form-label required">Number of Therapy Rooms/Treatment Bays</label>
                  <input type="number" class="form-control" id="therapyRooms" required>
                  <div class="invalid-feedback">Please provide the number of therapy rooms.</div>
              </div>
              <div class="col-md-6">
                  <label class="form-label required">Total Number of Staff</label>
                  <input type="number" class="form-control" id="staffCount" required>
                  <div class="invalid-feedback">Please provide the number of staff.</div>
              </div>
          </div>

          <!-- ===== THERAPY SERVICES ===== -->
          <div class="row mb-3">
              <div class="col-md-12">
                  <label class="form-label required">Therapy Services Offered</label>
                  <select class="multiple-select" id="therapyServices" multiple required>
                      <option value="Physiotherapy">Physiotherapy</option>
                      <option value="Occupational Therapy">Occupational Therapy</option>
                      <option value="Speech Therapy">Speech Therapy</option>
                      <option value="Prosthetics/Orthotics">Prosthetics/Orthotics</option>
                      <option value="Chronic Pain Management">Chronic Pain Management</option>
                      <option value="Neurological Rehabilitation">Neurological Rehabilitation</option>
                      <option value="Mental Health Counseling">Mental Health Counseling</option>
                      <option value="Addiction Therapy">Addiction Therapy</option>
                      <option value="Trauma Therapy">Trauma Therapy</option>
                  </select>
                  <div class="invalid-feedback">Please select at least one therapy service.</div>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Diagnostic Laboratory')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              <div class="col-md-12">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceImaging">
                      <label class="form-check-label">Imaging & Scan Services</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceClinicalChem">
                      <label class="form-check-label">Clinical Chemistry & Chemical Pathology</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceHematology">
                      <label class="form-check-label">Haematology</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMicrobiology">
                      <label class="form-check-label">Medical Microbiology & Parasitology</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceSerology">
                      <label class="form-check-label">Serology & Immunology</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMolecularBio">
                      <label class="form-check-label">Molecular Biology & Genetics</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceHistopathology">
                      <label class="form-check-label">Histopathology & Cytopathology</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceImmunohistochem">
                      <label class="form-check-label">Immunohistochemistry</label>
                  </div>
              </div>
          </div>

          <!-- ===== PRICING & REVENUE INDICATORS ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Pricing & Revenue Indicators</h5>
              
              <div class="col-md-4">
                  <label class="form-label">Average Cost of Genotype Test</label>
                  <input type="number" class="form-control" id="genotypeCost">
              </div>
              <div class="col-md-4">
                  <label class="form-label">Do you offer paternity/maternity test service?</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="paternityTest" id="paternityYes" value="yes">
                      <label class="form-check-label" for="paternityYes">Yes</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="paternityTest" id="paternityNo" value="no">
                      <label class="form-check-label" for="paternityNo">No</label>
                  </div>
              </div>
              <div class="col-md-4">
                  <label class="form-label">Average Cost of DNA Paternity/Maternity Test</label>
                  <input type="number" class="form-control" id="dnaTestCost">
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost of HIV Viral Load Assay</label>
                  <input type="number" class="form-control" id="hivViralLoadCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost of Malaria Test</label>
                  <input type="number" class="form-control" id="malariaTestCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Fee for Routine MRI Scan</label>
                  <input type="number" class="form-control" id="mriScanCost">
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Fee for Standard CT Scan</label>
                  <input type="number" class="form-control" id="ctScanCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Fee for Standard X-ray Scan</label>
                  <input type="number" class="form-control" id="xrayScanCost">
              </div>
          </div>

          <!-- ===== OPERATIONS & CAPACITY ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Operations & Capacity</h5>
              
              <div class="col-md-4">
                  <label class="form-label">Do you have a drug dispensing unit on-site?</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="dispensingUnit" id="dispensingYes" value="yes">
                      <label class="form-check-label" for="dispensingYes">Yes</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="dispensingUnit" id="dispensingNo" value="no">
                      <label class="form-check-label" for="dispensingNo">No</label>
                  </div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Average Number of Diagnostic Tests per Week</label>
                  <input type="number" class="form-control" id="testsPerWeek" required>
                  <div class="invalid-feedback">Please provide the number of tests.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Number of Staff (Clinical + Support)</label>
                  <input type="number" class="form-control" id="staffCount" required>
                  <div class="invalid-feedback">Please provide the number of staff.</div>
              </div>
          </div>

          <!-- ===== PRIMARY SERVICES SELECTION ===== -->
          <div class="row mb-3">
              <div class="col-md-12">
                  <label class="form-label required">Primary Laboratory Services</label>
                  <select class="multiple-select" id="primaryServices" multiple required>
                      <option value="Pathology">Pathology</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Parasitology">Parasitology</option>
                      <option value="Immunology and Serology">Immunology and Serology</option>
                      <option value="Molecular Biology">Molecular Biology</option>
                      <option value="Urinalysis">Urinalysis</option>
                      <option value="Blood Transfusion">Blood Transfusion</option>
                      <option value="Histopathology and Cytology">Histopathology and Cytology</option>
                      <option value="Chemical Pathology">Chemical Pathology</option>
                      <option value="Genetic Testing">Genetic Testing</option>
                  </select>
                  <div class="invalid-feedback">Please select at least one primary service.</div>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Wellness Centre')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              <div class="col-md-12">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceSpa">
                      <label class="form-check-label">Spa Treatments</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMassage">
                      <label class="form-check-label">Massage Therapy</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceFitness">
                      <label class="form-check-label">Fitness Classes & Personal Training</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceSleep">
                      <label class="form-check-label">Insomnia & Sleep-Hygiene Programs</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceNutrition">
                      <label class="form-check-label">Nutritional Counselling & Diet Plans</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceWellness">
                      <label class="form-check-label">Wellness Coaching & Stress Management Workshops</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceHydro">
                      <label class="form-check-label">Sauna, Steam Room, or Hydrotherapy Services</label>
                  </div>
              </div>
          </div>

          <!-- ===== PRICING & REVENUE INDICATORS ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Pricing & Revenue Indicators</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Average Fee for Massage Session</label>
                  <input type="number" class="form-control" id="massageFee" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Typical Cost of Spa Treatment</label>
                  <input type="number" class="form-control" id="spaTreatmentCost" required>
                  <div class="invalid-feedback">Please provide the cost.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Fee for Personal Training Session</label>
                  <input type="number" class="form-control" id="trainingFee" required>
                  <div class="invalid-feedback">Please provide the fee.</div>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Average Cost of Fitness Membership Package</label>
                  <input type="number" class="form-control" id="membershipCost">
              </div>
              <div class="col-md-4 mt-3">
                  <label class="form-label required">Average Number of Customers per Week</label>
                  <input type="number" class="form-control" id="customersPerWeek" required>
                  <div class="invalid-feedback">Please provide the number of customers.</div>
              </div>
          </div>

          <!-- ===== FACILITY CAPACITY & STAFFING ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Facility Capacity & Staffing</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Number of Treatment Rooms/Massage Tables</label>
                  <input type="number" class="form-control" id="treatmentRooms" required>
                  <div class="invalid-feedback">Please provide the number of rooms/tables.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Number of Fitness Studios/Workout Stations</label>
                  <input type="number" class="form-control" id="fitnessStations" required>
                  <div class="invalid-feedback">Please provide the number of studios/stations.</div>
              </div>
              <div class="col-md-4">
                  <label class="form-label required">Total Number of Staff</label>
                  <input type="number" class="form-control" id="staffCount" required>
                  <div class="invalid-feedback">Please provide the number of staff.</div>
              </div>
          </div>

          <!-- ===== PRIMARY SERVICES SELECTION ===== -->
          <div class="row mb-3">
              <div class="col-md-6">
                  <label class="form-label required">Primary Services</label>
                  <select class="multiple-select" id="primaryServices" multiple required>
                      <option value="Spa Treatments">Spa Treatments</option>
                      <option value="Massage Therapy">Massage Therapy</option>
                      <option value="Fitness Classes">Fitness Classes</option>
                      <option value="Personal Training">Personal Training</option>
                      <option value="Sleep Programs">Sleep Programs</option>
                      <option value="Nutritional Counselling">Nutritional Counselling</option>
                      <option value="Wellness Coaching">Wellness Coaching</option>
                      <option value="Hydrotherapy">Hydrotherapy</option>
                  </select>
                  <div class="invalid-feedback">Please select at least one primary service.</div>
              </div>
              <div class="col-md-6">
                  <label class="form-label">Facility Equipment</label>
                  <select class="multiple-select" id="facilityEquipment" multiple>
                      <option value="Massage Tables">Massage Tables</option>
                      <option value="Sauna">Sauna</option>
                      <option value="Steam Room">Steam Room</option>
                      <option value="Hydrotherapy Pools">Hydrotherapy Pools</option>
                      <option value="Fitness Equipment">Fitness Equipment</option>
                      <option value="Yoga Studio">Yoga Studio</option>
                      <option value="Meditation Space">Meditation Space</option>
                  </select>
              </div>
          </div>
      `;
    } else if (facilityType.includes('Herbal Medicine Centre')) {
      html = `
          <!-- ===== SERVICES OFFERED ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Services Offered</h5>
              <div class="col-md-12">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceHerbal">
                      <label class="form-check-label">Herbal Medicine</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceBoneSetting">
                      <label class="form-check-label">Traditional Bone Setting (TBS)</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="serviceMassage">
                      <label class="form-check-label">Traditional Massage Therapy (e.g. Post-natal massage)</label>
                  </div>
              </div>
          </div>

          <!-- ===== SERVICE FEES ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Service Fees</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Standard Consultation Fee (₦)</label>
                  <input type="number" class="form-control" id="consultationFee" required>
                  <div class="invalid-feedback">Please provide the consultation fee.</div>
              </div>
              
              <div class="col-md-4">
                  <label class="form-label">Do you dispense prepared herbal remedies?</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="herbalDispensing" id="herbalYes" value="yes">
                      <label class="form-check-label" for="herbalYes">Yes</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="herbalDispensing" id="herbalNo" value="no">
                      <label class="form-check-label" for="herbalNo">No</label>
                  </div>
              </div>
              
              <div class="col-md-4">
                  <label class="form-label">Average Cost of Herbal Medicine (per bottle/dose) (₦)</label>
                  <input type="number" class="form-control" id="herbalMedicineCost">
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Do you offer bone setting services?</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="boneSetting" id="boneSettingYes" value="yes">
                      <label class="form-check-label" for="boneSettingYes">Yes</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="boneSetting" id="boneSettingNo" value="no">
                      <label class="form-check-label" for="boneSettingNo">No</label>
                  </div>
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Standard Fee for Bone Setting (₦)</label>
                  <input type="number" class="form-control" id="boneSettingFee">
              </div>
              
              <div class="col-md-4 mt-3">
                  <label class="form-label">Standard Fee for Traditional Massage (₦)</label>
                  <input type="number" class="form-control" id="massageFee">
              </div>
          </div>

          <!-- ===== OPERATIONAL CAPACITY ===== -->
          <div class="row mb-3">
              <h5 class="mb-3">Operational Capacity</h5>
              
              <div class="col-md-4">
                  <label class="form-label required">Average Number of Customers per Week</label>
                  <input type="number" class="form-control" id="customersPerWeek" required>
                  <div class="invalid-feedback">Please provide the number of customers.</div>
              </div>
              
              <div class="col-md-4">
                  <label class="form-label required">Number of Herbal Medicines Dispensed per Month</label>
                  <input type="number" class="form-control" id="herbalMedicineDispensed" required>
                  <div class="invalid-feedback">Please provide the number of herbal medicines dispensed.</div>
              </div>
              
              <div class="col-md-4">
                  <label class="form-label required">Number of Employees (Traditionalists)</label>
                  <input type="number" class="form-control" id="numberOfEmployees" required>
                  <div class="invalid-feedback">Please provide the number of employees.</div>
              </div>
          </div>

          <!-- ===== PRIMARY SERVICES SELECTION ===== -->
          <div class="row mb-3">
              <div class="col-md-12">
                  <label class="form-label required">Primary Services Offered</label>
                  <select class="multiple-select" id="primaryServices" multiple required>
                      <option value="Herbal Medicine">Herbal Medicine</option>
                      <option value="Traditional Bone Setting">Traditional Bone Setting</option>
                      <option value="Traditional Massage Therapy">Traditional Massage Therapy</option>
                      <option value="Post-natal Care">Post-natal Care</option>
                      <option value="Spiritual Healing">Spiritual Healing</option>
                  </select>
                  <div class="invalid-feedback">Please select at least one primary service.</div>
              </div>
          </div>
      `;
    }

    operationsContent.innerHTML = html;
    initializeSelectize();
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
    const facilityTypeKey = getFacilityTypeKey(facilityType);

    let html = `
        <h3 class="mb-2">Payer Information</h3>
        <img src="${imageUrlInput.value || 'assets/img/userprofile.png'}" alt="Facility Image" style="max-width:150px;max-height:150px;display:block;margin-bottom:15px;border-radius:8px;">
        <p><strong>Legal Name:</strong> ${document.getElementById('repName').value}</p>
        <p><strong>TIN:</strong> ${document.getElementById('repTIN').value}</p>
        <p><strong>Category:</strong> ${document.querySelector('.selectedcat')?.getAttribute('data-name') || "Not selected"}</p>
        <p><strong>Email:</strong> ${document.getElementById('repemail').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('repphonenumber').value}</p>
        <p><strong>Address:</strong> ${document.getElementById('repAddress').value}</p>
        <p><strong>State/LGA:</strong> ${document.getElementById('state').value} / ${document.getElementById('lga').value}</p>
        
        <h3 class="mt-4 mb-2">Facility Information</h3>
        <p><strong>Facility Name:</strong> ${document.getElementById('legalName').value}</p>
        <p><strong>Facility Type:</strong> ${facilityType}</p>
        <p><strong>Registration Number:</strong> ${document.getElementById('registrationNumber').value}</p>
        <p><strong>Ownership Type:</strong> ${document.getElementById('ownershipType').value}</p>
        <p><strong>Operating License:</strong> ${document.getElementById('operatingLicenseNumber').value}</p>
        <p><strong>Issuing Authority:</strong> ${Array.from(document.getElementById('issuingAuthority').selectedOptions).map(opt => opt.value).join(', ')}</p>
        <p><strong>License Expiry:</strong> ${document.getElementById('licenseExpiryDate').value}</p>
        <p><strong>Health Facility Code:</strong> ${document.getElementById('healthFacilityCode').value}</p>
        <p><strong>Date Established:</strong> ${document.getElementById('dateOfEstablishment').value}</p>
    `;

    // Add facility type specific details
    html += `<h3 class="mt-4 mb-2">Facility Operations</h3>`;

    switch (facilityTypeKey) {
      case "primary_healthcare":
        html += `
      <p><strong>Departments:</strong> ${document.getElementById('departmentsCount')?.value || "0"}</p>
      <p><strong>Wards:</strong> ${document.getElementById('wardsCount')?.value || "0"}</p>
      <p><strong>Staff Count:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Outpatient Services:</strong> ${Array.from(document.getElementById('outpatientServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Consultation Fee:</strong> ₦${document.getElementById('consultationFee')?.value || "0"}</p>
      <p><strong>ANC Initial Visit Fee:</strong> ₦${document.getElementById('ancInitialFee')?.value || "0"}</p>
      <p><strong>ANC Subsequent Visit Fee:</strong> ₦${document.getElementById('ancSubsequentFee')?.value || "0"}</p>
      <p><strong>Postnatal Care Fee:</strong> ₦${document.getElementById('postnatalFee')?.value || "0"}</p>
      <p><strong>Immunization Free:</strong> ${document.getElementById('immunizationFree')?.value || "No"}</p>
    `;
        break;

      case "secondary_healthcare":
        html += `
      <p><strong>Departments:</strong> ${document.getElementById('departmentsCount')?.value || "0"}</p>
      <p><strong>Wards:</strong> ${document.getElementById('wardsCount')?.value || "0"}</p>
      <p><strong>Total Staff:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Eye Services:</strong> ${Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Eye Test Fee:</strong> ₦${document.getElementById('eyeTestFee')?.value || "0"}</p>
      <p><strong>Eye Drops Cost:</strong> ₦${document.getElementById('eyeDropsCost')?.value || "0"}</p>
      <p><strong>Maternity Services:</strong> ${Array.from(document.getElementById('maternityServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Normal Delivery Fee:</strong> ₦${document.getElementById('normalDeliveryFee')?.value || "0"}</p>
      <p><strong>C-Section Fee:</strong> ₦${document.getElementById('cSectionFee')?.value || "0"}</p>
      <p><strong>Gyne Consultation Fee:</strong> ₦${document.getElementById('gyneConsultationFee')?.value || "0"}</p>
    `;
        break;

      case "tertiary_healthcare":
        html += `
      <p><strong>Departments:</strong> ${document.getElementById('departmentsCount')?.value || "0"}</p>
      <p><strong>Wards:</strong> ${document.getElementById('wardsCount')?.value || "0"}</p>
      <p><strong>Total Staff:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Surgical Theatres:</strong> ${document.getElementById('operatingTheatres')?.value || "0"}</p>
      <p><strong>ICU Beds:</strong> ${document.getElementById('icuBeds')?.value || "0"}</p>
      <p><strong>Major Surgery Cost:</strong> ₦${document.getElementById('majorSurgeryCost')?.value || "0"}</p>
      <p><strong>ICU Daily Charge:</strong> ₦${document.getElementById('icuDailyCharge')?.value || "0"}</p>
      <p><strong>Eye Services:</strong> ${Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Maternity Services:</strong> ${Array.from(document.getElementById('maternityServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
    `;
        break;

      case "private_hospital_clinic":
        html += `
      <p><strong>Departments:</strong> ${document.getElementById('departmentsCount')?.value || "0"}</p>
      <p><strong>Wards:</strong> ${document.getElementById('wardsCount')?.value || "0"}</p>
      <p><strong>Total Staff:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Consultation Fee:</strong> ₦${document.getElementById('consultationFee')?.value || "0"}</p>
      <p><strong>Emergency Services:</strong> ${document.getElementById('emergencyServices')?.value || "No"}</p>
      <p><strong>Operating Hours:</strong> ${document.getElementById('operatingHours')?.value || "Not specified"}</p>
      <p><strong>Ambulance Services:</strong> ${document.getElementById('ambulanceServices')?.value || "No"}</p>
    `;
        break;

      case "maternity_home_clinic":
        html += `
      <p><strong>Consultation Fee:</strong> ₦${document.getElementById('consultationFee')?.value || "0"}</p>
      <p><strong>Labour Wards:</strong> ${document.getElementById('labourWards')?.value || "0"}</p>
      <p><strong>Ultrasound Fee:</strong> ₦${document.getElementById('ultrasoundFee')?.value || "0"}</p>
      <p><strong>Normal Delivery Fee:</strong> ₦${document.getElementById('normalDeliveryFee')?.value || "0"}</p>
      <p><strong>C-Section Fee:</strong> ₦${document.getElementById('cSectionFee')?.value || "0"}</p>
      <p><strong>Assisted Reproductive Services:</strong> ${Array.from(document.getElementById('artServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Cancer Screening:</strong> ${Array.from(document.getElementById('cancerScreening')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
    `;
        break;

      case "dental_clinic":
        html += `
      <p><strong>Teeth Whitening Cost:</strong> ₦${document.getElementById('teethWhiteningCost')?.value || "0"}</p>
      <p><strong>Dental Implant Cost:</strong> ₦${document.getElementById('implantCost')?.value || "0"}</p>
      <p><strong>Scaling/Polishing Fee:</strong> ₦${document.getElementById('scalingCost')?.value || "0"}</p>
      <p><strong>Extraction Cost:</strong> ₦${document.getElementById('extractionCost')?.value || "0"}</p>
      <p><strong>Patients Per Week:</strong> ${document.getElementById('patientsPerWeek')?.value || "0"}</p>
      <p><strong>Dental Chairs:</strong> ${document.getElementById('dentalChairs')?.value || "0"}</p>
      <p><strong>Clinical Staff:</strong> ${document.getElementById('clinicalStaff')?.value || "0"}</p>
    `;
        break;

      case "diagnostic_laboratory":
        html += `
      <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('labServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Genotype Test Cost:</strong> ₦${document.getElementById('genotypeTestCost')?.value || "0"}</p>
      <p><strong>HIV Viral Load Cost:</strong> ₦${document.getElementById('hivViralLoadCost')?.value || "0"}</p>
      <p><strong>Tests Per Week:</strong> ${document.getElementById('testsPerWeek')?.value || "0"}</p>
      <p><strong>Staff Count:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Paternity Tests:</strong> ${document.getElementById('paternityTest')?.value === "yes" ? "Yes" : "No"}</p>
    `;
        break;

      case "imaging_radiology_centre":
        html += `
      <p><strong>MRI Fee:</strong> ₦${document.getElementById('mriFee')?.value || "0"}</p>
      <p><strong>CT Scan Fee:</strong> ₦${document.getElementById('ctFee')?.value || "0"}</p>
      <p><strong>X-Ray Fee:</strong> ₦${document.getElementById('xrayFee')?.value || "0"}</p>
      <p><strong>Scans Per Week:</strong> ${document.getElementById('scansPerWeek')?.value || "0"}</p>
      <p><strong>Staff Count:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Major Equipment:</strong> ${Array.from(document.getElementById('majorEquipment')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
    `;
        break;

      case "eye_clinic":
        html += `
      <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Eye Test Fee:</strong> ₦${document.getElementById('eyeTestFee')?.value || "0"}</p>
      <p><strong>Eye Drops Cost:</strong> ₦${document.getElementById('eyeDropsCost')?.value || "0"}</p>
      <p><strong>Optical Unit:</strong> ${document.getElementById('hasOpticalUnit')?.value || "No"}</p>
      <p><strong>Glasses Dispensed Monthly:</strong> ${document.getElementById('glassesDispensedPerMonth')?.value || "0"}</p>
      <p><strong>Contact Lens Services:</strong> ${document.getElementById('contactLensService')?.value || "No"}</p>
    `;
        break;

      case "rehabilitation_centre":
        html += `
      <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('therapyServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Drug Detox Program:</strong> ${document.getElementById('detoxProgram')?.value === "yes" ? "Yes" : "No"}</p>
      <p><strong>Detox Program Cost:</strong> ₦${document.getElementById('detoxCost')?.value || "0"}</p>
      <p><strong>Therapy Rooms:</strong> ${document.getElementById('therapyRooms')?.value || "0"}</p>
      <p><strong>Staff Count:</strong> ${document.getElementById('staffCount')?.value || "0"}</p>
      <p><strong>Physiotherapy Fee:</strong> ₦${document.getElementById('physioFee')?.value || "0"}</p>
    `;
        break;

      case "wellness_centre":
        html += `
      <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Massage Session Fee:</strong> ₦${document.getElementById('massageFee')?.value || "0"}</p>
      <p><strong>Spa Treatment Cost:</strong> ₦${document.getElementById('spaTreatmentCost')?.value || "0"}</p>
      <p><strong>Customers Per Week:</strong> ${document.getElementById('customersPerWeek')?.value || "0"}</p>
      <p><strong>Treatment Rooms:</strong> ${document.getElementById('treatmentRooms')?.value || "0"}</p>
      <p><strong>Fitness Studios:</strong> ${document.getElementById('fitnessStations')?.value || "0"}</p>
    `;
        break;

      case "herbal_medicine_centre":
        html += `
      <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value).join(', ')}</p>
      <p><strong>Consultation Fee:</strong> ₦${document.getElementById('consultationFee')?.value || "0"}</p>
      <p><strong>Dispenses Herbal Remedies:</strong> ${document.getElementById('herbalDispensing')?.value === "yes" ? "Yes" : "No"}</p>
      <p><strong>Herbal Medicine Cost:</strong> ₦${document.getElementById('herbalMedicineCost')?.value || "0"}</p>
      <p><strong>Customers Per Week:</strong> ${document.getElementById('customersPerWeek')?.value || "0"}</p>
      <p><strong>Medicines Dispensed Monthly:</strong> ${document.getElementById('herbalMedicineDispensed')?.value || "0"}</p>
    `;
        break;

      default:
        html += `<p>No specific operations data available for this facility type</p>`;
        break;
    }

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

    html += `
        <div class="tax-liabilities">
            <h5>Applicable Tax Liabilities</h5>
            <ul class="tax-list">
                <li>PAYE</li>
                <li>Development Levy</li>
                <li>Business Premise Levy</li>
                <li>Environmental and Waste Management Fees</li>
                <li>Shop/Trade Permit</li>
                <li>Tenement Rate</li>
                <li>Bill Board Levy</li>
            </ul>
        </div>
`;

    document.getElementById('reviewSummary').innerHTML = html;


  }

  // Prepare payload for API submission
  function preparePayload() {
    const facilityType = document.getElementById('facilityType').value;
    const facilityTypeKey = getFacilityTypeKey(facilityType);

    // Prepare facility type specific data
    const facilityTypeData = prepareFacilityTypeData(facilityTypeKey);

    // Construct the full payload
    const payload = {
      endpoint: "NewcreateFacility",
      data: {
        payer_user: {
          tin: document.getElementById('repTIN').value,
          nin: "", // Will need to add this field to the form
          bvn: "", // Will need to add this field to the form
          category: document.querySelector('.selectedcat')?.getAttribute('data-name') || "corporate",
          first_name: document.getElementById('legalName').value || "",
          surname: "",
          email: document.getElementById('email').value,
          phone: document.getElementById('phoneNumber').value,
          state: document.getElementById('state').value,
          business_type: "Healthcare",
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
          industry: "Health Services",
          annual_income: ""
        },
        facility_hospital: {
          facility_name: document.getElementById('legalName').value,
          facility_type: facilityTypeKey,
          cac_rc_number: document.getElementById('registrationNumber').value,
          ownership_type: document.getElementById('ownershipType').value,
          license_number: document.getElementById('operatingLicenseNumber').value,
          issuing_authority: Array.from(document.getElementById('issuingAuthority').selectedOptions).map(opt => opt.value).join(', '),
          license_expiry: document.getElementById('licenseExpiryDate').value,
          health_facility_code: document.getElementById('healthFacilityCode').value,
          nhis_number: document.getElementById('nhisAccreditationNumber').value || "",
          certificate_of_standards: document.getElementById('certificateOfStandard').value || "",
          date_established: document.getElementById('dateOfEstablishment').value,
          primary_services: "", // Will be filled from facility type data
          major_equipment_type: "", // Will be filled from facility type data
          number_of_employees: document.getElementById('staffCount')?.value || "0",
          number_of_beds: document.getElementById('numberOfBeds')?.value || "0",
          avg_monthly_visits: document.getElementById('avgMonthlyPatientVisits')?.value || "0",
          monthly_surgeries: document.getElementById('numberOfSurgeries')?.value || "0",
          card_fee: "500" // Default value
        },
        facility_type_data: {
          [facilityTypeKey]: facilityTypeData
        },
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
  function getFacilityTypeKey(facilityType) {
    const typeMap = {
      "Primary Healthcare Facility": "primary_healthcare",
      "Secondary Healthcare Facility": "secondary_healthcare",
      "Tertiary Healthcare Facilities": "tertiary_healthcare",
      "Private Hospitals/Clinics": "private_hospital_clinic",
      "Maternity Home / Clinic": "maternity_home_clinic",
      "Dental Clinic / Centre": "dental_clinic",
      "Diagnostic Laboratory": "diagnostic_laboratory",
      "Imaging / Radiology Centre": "imaging_radiology_centre",
      "Eye Clinic": "eye_clinic",
      "Rehabilitation Centre": "rehabilitation_centre",
      "Wellness Centre": "wellness_centre",
      "Herbal Medicine Centre / Traditionalist Health Centre": "herbal_medicine_centre"
    };
    return typeMap[facilityType] || "primary_healthcare";
  }

  // Prepare facility type specific data
  function prepareFacilityTypeData(facilityTypeKey) {
    const data = {};

    switch (facilityTypeKey) {
      case "primary_healthcare":
        data.number_of_departments = document.getElementById('departmentsCount')?.value || "0";
        data.number_of_wards = document.getElementById('wardsCount')?.value || "0";
        data.average_number_of_staff = document.getElementById('staffCount')?.value || "0";
        data.outpatient_services_offered = Array.from(document.getElementById('outpatientServices')?.selectedOptions || []).map(opt => opt.value);
        data.standard_consultation_fee = document.getElementById('consultationFee')?.value || "0";
        data.anc_fee_initial_visit = document.getElementById('ancInitialFee')?.value || "0";
        data.anc_fee_subsequent_visit = document.getElementById('ancSubsequentFee')?.value || "0";
        data.avg_pregnant_women_per_week = document.getElementById('pregnantWomenWeekly')?.value || "0";
        data.avg_deliveries_per_week = document.getElementById('deliveriesWeekly')?.value || "0";
        data.postnatal_care_fee = document.getElementById('postnatalFee')?.value || "0";
        data.is_immunization_free = document.getElementById('immunizationFree')?.value || "No";
        data.family_planning_methods = Array.from(document.getElementById('familyPlanningServices')?.selectedOptions || []).map(opt => opt.value);
        data.avg_cost_injectable_contraceptive = document.getElementById('injectableCost')?.value || "0";
        data.basic_diagnostics = Array.from(document.getElementById('basicTests')?.selectedOptions || []).map(opt => opt.value);
        data.avg_cost_malaria_test = document.getElementById('malariaTestCost')?.value || "0";
        data.has_onsite_pharmacy = document.getElementById('hasPharmacy')?.value || "No";
        break;

      case "secondary_healthcare":
        data.departments_count = document.getElementById('departmentsCount')?.value || "0";
        data.wards_count = document.getElementById('wardsCount')?.value || "0";
        data.total_staff_count = document.getElementById('staffCount')?.value || "0";
        data.eye_services = Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value);
        data.eye_test_fee = document.getElementById('eyeTestFee')?.value || "0";
        data.eye_drops_cost = document.getElementById('eyeDropsCost')?.value || "0";
        data.maternity_services = Array.from(document.getElementById('maternityServices')?.selectedOptions || []).map(opt => opt.value);
        data.normal_delivery_fee = document.getElementById('normalDeliveryFee')?.value || "0";
        data.c_section_fee = document.getElementById('cSectionFee')?.value || "0";
        data.labour_wards_count = document.getElementById('labourWards')?.value || "0";
        data.gyne_consultation_fee = document.getElementById('gyneConsultationFee')?.value || "0";
        data.dental_services = Array.from(document.getElementById('dentalServices')?.selectedOptions || []).map(opt => opt.value);
        data.teeth_whitening_cost = document.getElementById('teethWhiteningCost')?.value || "0";
        data.implant_cost = document.getElementById('implantCost')?.value || "0";
        data.radiology_services = Array.from(document.getElementById('radiologyServices')?.selectedOptions || []).map(opt => opt.value);
        data.mri_fee = document.getElementById('mriFee')?.value || "0";
        data.ct_scan_fee = document.getElementById('ctFee')?.value || "0";
        data.lab_services = Array.from(document.getElementById('labServices')?.selectedOptions || []).map(opt => opt.value);
        data.genotype_test_cost = document.getElementById('genotypeTestCost')?.value || "0";
        break;

      case "tertiary_healthcare":
        data.departments_count = document.getElementById('departmentsCount')?.value || "0";
        data.wards_count = document.getElementById('wardsCount')?.value || "0";
        data.total_staff_count = document.getElementById('staffCount')?.value || "0";
        data.surgical_operating_theatres = document.getElementById('operatingTheatres')?.value || "0";
        data.major_surgery_cost = document.getElementById('majorSurgeryCost')?.value || "0";
        data.minor_surgery_cost = document.getElementById('minorSurgeryCost')?.value || "0";
        data.icu_beds = document.getElementById('icuBeds')?.value || "0";
        data.icu_bed_charge_per_day = document.getElementById('icuDailyCharge')?.value || "0";
        data.eye_services = Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value);
        data.eye_test_fee = document.getElementById('eyeTestFee')?.value || "0";
        data.eye_drops_cost = document.getElementById('eyeDropsCost')?.value || "0";
        data.maternity_services = Array.from(document.getElementById('maternityServices')?.selectedOptions || []).map(opt => opt.value);
        data.normal_delivery_fee = document.getElementById('normalDeliveryFee')?.value || "0";
        data.c_section_fee = document.getElementById('cSectionFee')?.value || "0";
        data.labour_wards_count = document.getElementById('labourWards')?.value || "0";
        data.gyne_consultation_fee = document.getElementById('gyneConsultationFee')?.value || "0";
        data.dental_services = Array.from(document.getElementById('dentalServices')?.selectedOptions || []).map(opt => opt.value);
        data.teeth_whitening_cost = document.getElementById('teethWhiteningCost')?.value || "0";
        data.implant_cost = document.getElementById('implantCost')?.value || "0";
        data.radiology_services = Array.from(document.getElementById('radiologyServices')?.selectedOptions || []).map(opt => opt.value);
        data.mri_fee = document.getElementById('mriFee')?.value || "0";
        data.ct_scan_fee = document.getElementById('ctFee')?.value || "0";
        data.lab_services = Array.from(document.getElementById('labServices')?.selectedOptions || []).map(opt => opt.value);
        data.genotype_test_cost = document.getElementById('genotypeTestCost')?.value || "0";
        break;

      case "private_hospital_clinic":
        data.departments_count = document.getElementById('departmentsCount')?.value || "0";
        data.wards_count = document.getElementById('wardsCount')?.value || "0";
        data.total_staff_count = document.getElementById('staffCount')?.value || "0";
        data.consultation_fee = document.getElementById('consultationFee')?.value || "0";
        data.emergency_services_available = document.getElementById('emergencyServices')?.value || "No";
        data.specialty_services_offered = document.getElementById('specialtyServices')?.value || "";
        data.diagnostic_services = document.getElementById('diagnosticServices')?.value || "";
        data.pharmacy_services = document.getElementById('pharmacyServices')?.value || "No";
        data.average_patient_wait_time_minutes = document.getElementById('waitTime')?.value || "0";
        data.operating_hours = document.getElementById('operatingHours')?.value || "";
        data.ambulance_services_available = document.getElementById('ambulanceServices')?.value || "No";
        break;

      case "maternity_home_clinic":
        data.standard_consultation_fee = document.getElementById('consultationFee')?.value || "0";
        data.number_of_labour_wards = document.getElementById('labourWards')?.value || "0";
        data.fee_ultrasound_scan = document.getElementById('ultrasoundFee')?.value || "0";
        data.fee_antenatal_care = document.getElementById('antenatalFee')?.value || "0";
        data.charge_normal_delivery = document.getElementById('normalDeliveryFee')?.value || "0";
        data.fee_caesarean_section = document.getElementById('cSectionFee')?.value || "0";
        data.fee_epidural_relief = document.getElementById('epiduralFee')?.value || "0";
        data.cost_contraceptive_implant = document.getElementById('implantCost')?.value || "0";
        data.avg_antenatal_postnatal_visits_per_week = document.getElementById('visitsPerWeek')?.value || "0";
        data.avg_births_per_week = document.getElementById('birthsPerWeek')?.value || "0";
        data.avg_cervical_cancer_screening_cost = document.getElementById('cervicalScreeningCost')?.value || "0";
        data.avg_hpv_vaccine_cost = document.getElementById('hpvVaccineCost')?.value || "0";
        data.avg_number_of_employees = document.getElementById('numberOfEmployees')?.value || "0";
        data.assisted_reproductive_services = Array.from(document.getElementById('artServices')?.selectedOptions || []).map(opt => opt.value);
        data.gynaecological_tests = Array.from(document.getElementById('gynTests')?.selectedOptions || []).map(opt => opt.value);
        data.gynaecological_other = document.getElementById('gynOtherSpecify')?.value || "";
        data.cancer_screening_services = Array.from(document.getElementById('cancerScreening')?.selectedOptions || []).map(opt => opt.value);
        data.family_planning_services = Array.from(document.getElementById('familyPlanningServices')?.selectedOptions || []).map(opt => opt.value);
        data.obstetrics_services = Array.from(document.getElementById('obstetricsServices')?.selectedOptions || []).map(opt => opt.value);
        data.pediatric_services = Array.from(document.getElementById('pediatricServices')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "dental_clinic":
        data.avg_cost_teeth_whitening = document.getElementById('teethWhiteningCost')?.value || "0";
        data.avg_cost_dental_implant = document.getElementById('implantCost')?.value || "0";
        data.fee_scaling_polishing = document.getElementById('scalingCost')?.value || "0";
        data.avg_cost_simple_extraction = document.getElementById('extractionCost')?.value || "0";
        data.cost_orthodontic_wiring = document.getElementById('bracesCost')?.value || "0";
        data.avg_patients_per_week = document.getElementById('patientsPerWeek')?.value || "0";
        data.dental_chairs_count = document.getElementById('dentalChairs')?.value || "0";
        data.clinical_staff_count = document.getElementById('clinicalStaff')?.value || "0";
        data.dental_services_offered = Array.from(document.getElementById('dentalServices')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "diagnostic_laboratory":
        data.services_offered = Array.from(document.getElementById('labServices')?.selectedOptions || []).map(opt => opt.value);
        data.avg_cost_genotype_test = document.getElementById('genotypeTestCost')?.value || "0";
        data.paternity_maternity_test_service = document.getElementById('paternityTest')?.value === "yes";
        data.avg_cost_dna_paternity_test = document.getElementById('dnaTestCost')?.value || "0";
        data.avg_cost_hiv_viral_load = document.getElementById('hivViralLoadCost')?.value || "0";
        data.avg_cost_malaria_test = document.getElementById('malariaTestCost')?.value || "0";
        data.avg_fee_routine_mri = document.getElementById('mriScanCost')?.value || "0";
        data.avg_fee_ct_scan = document.getElementById('ctScanCost')?.value || "0";
        data.avg_fee_xray = document.getElementById('xrayScanCost')?.value || "0";
        data.drug_dispensing_unit = document.getElementById('dispensingUnit')?.value === "yes";
        data.avg_diagnostic_tests_per_week = document.getElementById('testsPerWeek')?.value || "0";
        data.total_clinical_support_staff = document.getElementById('staffCount')?.value || "0";
        data.primary_lab_services = Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "imaging_radiology_centre":
        data.services_offered = Array.from(document.getElementById('radiologyServices')?.selectedOptions || []).map(opt => opt.value);
        data.avg_fee_mri_scan = document.getElementById('mriFee')?.value || "0";
        data.avg_fee_ct_scan = document.getElementById('ctFee')?.value || "0";
        data.avg_fee_ultrasound_obstetric = document.getElementById('obstetricUltrasoundFee')?.value || "0";
        data.avg_fee_xray = document.getElementById('xrayFee')?.value || "0";
        data.avg_cost_3d_mammogram = document.getElementById('mammogram3dFee')?.value || "0";
        data.avg_scans_per_week = document.getElementById('scansPerWeek')?.value || "0";
        data.total_radiology_staff = document.getElementById('staffCount')?.value || "0";
        data.major_equipment = Array.from(document.getElementById('majorEquipment')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "eye_clinic":
        data.services_offered = Array.from(document.getElementById('eyeServices')?.selectedOptions || []).map(opt => opt.value);
        data.standard_eye_test_fee = document.getElementById('eyeTestFee')?.value || "0";
        data.sodium_hyaluronate_drops_cost = document.getElementById('eyeDropsCost')?.value || "0";
        data.has_optical_dispensing_unit = document.getElementById('hasOpticalUnit')?.value === "Yes";
        data.price_range_eyeglasses = document.getElementById('eyeglassesPriceRange')?.value || "0";
        data.monthly_eyeglasses_dispensed = document.getElementById('glassesDispensedPerMonth')?.value || "0";
        data.provides_contact_lens_services = document.getElementById('contactLensService')?.value === "Yes";
        data.contact_lens_fitting_cost = document.getElementById('contactLensCost')?.value || "0";
        data.retina_surgery_cost = document.getElementById('retinaSurgeryCost')?.value || "0";
        data.glaucoma_surgery_cost = document.getElementById('glaucomaSurgeryCost')?.value || "0";
        data.average_staff_count = document.getElementById('eyeClinicStaffCount')?.value || "0";
        break;

      case "rehabilitation_centre":
        data.services_offered = Array.from(document.getElementById('therapyServices')?.selectedOptions || []).map(opt => opt.value);
        data.offers_drug_detox = document.getElementById('detoxProgram')?.value === "yes";
        data.cost_complete_drug_detox_program = document.getElementById('detoxCost')?.value || "0";
        data.consultation_fee_psychiatric = document.getElementById('mentalHealthFee')?.value || "0";
        data.trauma_ptsd_session_cost = document.getElementById('traumaSessionFee')?.value || "0";
        data.physiotherapy_session_fee = document.getElementById('physioFee')?.value || "0";
        data.mental_health_therapy_session_cost = document.getElementById('therapySessionFee')?.value || "0";
        data.therapy_rooms_count = document.getElementById('therapyRooms')?.value || "0";
        data.staff_total_count = document.getElementById('staffCount')?.value || "0";
        data.therapy_services_offered = Array.from(document.getElementById('therapyServices')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "wellness_centre":
        data.services_offered = Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value);
        data.avg_fee_massage_session = document.getElementById('massageFee')?.value || "0";
        data.cost_spa_treatment = document.getElementById('spaTreatmentCost')?.value || "0";
        data.fee_personal_training_session = document.getElementById('trainingFee')?.value || "0";
        data.cost_fitness_membership_package = document.getElementById('membershipCost')?.value || "0";
        data.avg_customers_per_week = document.getElementById('customersPerWeek')?.value || "0";
        data.num_treatment_rooms = document.getElementById('treatmentRooms')?.value || "0";
        data.num_fitness_studios = document.getElementById('fitnessStations')?.value || "0";
        data.total_staff = document.getElementById('staffCount')?.value || "0";
        data.primary_services = Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value);
        data.facility_equipment = Array.from(document.getElementById('facilityEquipment')?.selectedOptions || []).map(opt => opt.value);
        break;

      case "herbal_medicine_centre":
        data.services_offered = Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value);
        data.standard_consultation_fee = document.getElementById('consultationFee')?.value || "0";
        data.dispenses_herbal_remedies = document.getElementById('herbalDispensing')?.value === "yes";
        data.avg_cost_herbal_medicine = document.getElementById('herbalMedicineCost')?.value || "0";
        data.standard_fee_bone_setting = document.getElementById('boneSettingFee')?.value || "0";
        data.standard_fee_traditional_massage = document.getElementById('massageFee')?.value || "0";
        data.avg_customers_per_week = document.getElementById('customersPerWeek')?.value || "0";
        data.herbal_medicines_dispensed_per_month = document.getElementById('herbalMedicineDispensed')?.value || "0";
        data.num_employees_traditionalists = document.getElementById('numberOfEmployees')?.value || "0";
        data.primary_services_offered = Array.from(document.getElementById('primaryServices')?.selectedOptions || []).map(opt => opt.value);
        break;

      default:
        console.warn(`Unknown facility type: ${facilityTypeKey}`);
        break;
    }

    return data;
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
          window.location.href = `enumeration-hospital-preview.html?id=${result.id}`;
        }
      }).then(() => {
        window.location.href = `enumeration-hospital-preview.html?id=${result.id}`;
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

})


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