let isLoading = false;

document.addEventListener('DOMContentLoaded', function () {

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
  const progressBar = document.querySelector('.progress-bar');
  let currentSection = 0;

  // Show first section by default
  showSection(currentSection);

  // Next button click handler
  document.querySelectorAll('.next-section').forEach(button => {
    button.addEventListener('click', function () {
      if (validateSection(currentSection)) {
        currentSection++;
        showSection(currentSection);
        updateProgressBar();
        generateSummary()
      }
    });
  });

  // Previous button click handler
  document.querySelectorAll('.prev-section').forEach(button => {
    button.addEventListener('click', function () {
      currentSection--;
      showSection(currentSection);
      updateProgressBar();
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

  // Update progress bar
  function updateProgressBar() {
    const progress = ((currentSection + 1) / sections.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
  }

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
                            <label class="form-label">Branch Name</label>
                            <input type="text" class="form-control branch-name" required>
                            <div class="invalid-feedback">Please provide the branch name.</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Branch Address</label>
                            <input type="text" class="form-control branch-address" required>
                            <div class="invalid-feedback">Please provide the branch address.</div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-4">
                            <label class="form-label">Branch City/Town</label>
                            <input type="text" class="form-control branch-city" required>
                            <div class="invalid-feedback">Please provide the branch city.</div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Branch LGA</label>
                            <select class="form-select branch-lga" required>
                                <option value="">Select LGA</option>
                                <option value="Barkin Ladi">Barkin Ladi</option>
                                <option value="Bassa">Bassa</option>
                                <option value="Bokkos">Bokkos</option>
                                <option value="Jos East">Jos East</option>
                                <option value="Jos North">Jos North</option>
                                <option value="Jos South">Jos South</option>
                                <option value="Kanam">Kanam</option>
                                <option value="Kanke">Kanke</option>
                                <option value="Langtang North">Langtang North</option>
                                <option value="Langtang South">Langtang South</option>
                                <option value="Mangu">Mangu</option>
                                <option value="Mikang">Mikang</option>
                                <option value="Pankshin">Pankshin</option>
                                <option value="Qua'an Pan">Qua'an Pan</option>
                                <option value="Riyom">Riyom</option>
                                <option value="Shendam">Shendam</option>
                                <option value="Wase">Wase</option>
                            </select>
                            <div class="invalid-feedback">Please select the branch LGA.</div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Branch State</label>
                            <input type="text" class="form-control branch-state" value="Plateau" readonly>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-6">
                            <label class="form-label">Branch Latitude</label>
                            <input type="number" step="any" class="form-control branch-latitude" required>
                            <div class="invalid-feedback">Please provide the branch latitude.</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Branch Longitude</label>
                            <input type="number" step="any" class="form-control branch-longitude" required>
                            <div class="invalid-feedback">Please provide the branch longitude.</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm remove-branch">Remove Branch</button>
                `;

    branchEntries.appendChild(branchEntry);

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

    if (facilityType.includes('Primary Healthcare Facility') ||
      facilityType.includes('Secondary Healthcare Facility') ||
      facilityType.includes('Tertiary Healthcare Facilities') ||
      facilityType.includes('Private Hospitals/Clinics')) {

      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Services Offered</label>
                                <select class="multiple-select" id="primaryServices" multiple required>
                                    <option value="General Consultation">General Consultation</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Dialysis">Dialysis</option>
                                    <option value="Dental Service">Dental Service</option>
                                    <option value="Intensive Care">Intensive Care</option>
                                    <option value="Inpatient Admission">Inpatient Admission</option>
                                    <option value="Physiotherapy">Physiotherapy</option>
                                    <option value="Mental Health Service">Mental Health Service</option>
                                    <option value="Pharmacy Services">Pharmacy Services</option>
                                    <option value="Emergency Services">Emergency Services</option>
                                    <option value="Antenatal/Postnatal Care">Antenatal/Postnatal Care</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one primary service.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type of Major Equipment in Facility</label>
                                <select class="multiple-select" id="majorEquipment" multiple>
                                    <option value="MRI Scanner">MRI Scanner</option>
                                    <option value="CT Scanner">CT Scanner</option>
                                    <option value="X-ray machine">X-ray machine</option>
                                    <option value="Ultrasound">Ultrasound</option>
                                    <option value="Dialysis Machines">Dialysis Machines</option>
                                    <option value="Anesthesia Machines">Anesthesia Machines</option>
                                    <option value="Ventilators">Ventilators</option>
                                    <option value="Mammography Machine">Mammography Machine</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Number of Beds</label>
                                <input type="number" class="form-control" id="numberOfBeds" required>
                                <div class="invalid-feedback">Please provide the number of beds.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Average Monthly Patient Visits</label>
                                <input type="number" class="form-control" id="avgMonthlyPatientVisits" required>
                                <div class="invalid-feedback">Please provide the average monthly patient visits.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Number of Surgeries/Procedures per Month</label>
                                <input type="number" class="form-control" id="numberOfSurgeries" required>
                                <div class="invalid-feedback">Please provide the number of surgeries/procedures.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Cost of Hospital Card/Registration Fee (₦)</label>
                                <input type="number" class="form-control" id="registrationFee" required>
                                <div class="invalid-feedback">Please provide the registration fee.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Maternity Home')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Average Number of Births per Month</label>
                                <input type="number" class="form-control" id="avgBirthsPerMonth" required>
                                <div class="invalid-feedback">Please provide the average number of births.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Number of Caesarean Section (CS) Births per Month</label>
                                <input type="number" class="form-control" id="csBirthsPerMonth" required>
                                <div class="invalid-feedback">Please provide the number of CS births.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Number of patients for Ante-Natal per Month</label>
                                <input type="number" class="form-control" id="anteNatalPatients" required>
                                <div class="invalid-feedback">Please provide the number of ante-natal patients.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Number of patients for Post-Natal per Month</label>
                                <input type="number" class="form-control" id="postNatalPatients" required>
                                <div class="invalid-feedback">Please provide the number of post-natal patients.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Dental Clinic')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of Dental Chairs/Units</label>
                                <input type="number" class="form-control" id="dentalChairs" required>
                                <div class="invalid-feedback">Please provide the number of dental chairs.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Average Number of Procedures per Month</label>
                                <input type="number" class="form-control" id="avgProcedures" required>
                                <div class="invalid-feedback">Please provide the average number of procedures.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Pharmacy / Chemist')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Average Number of Prescriptions Dispensed per Month</label>
                                <input type="number" class="form-control" id="prescriptionsPerMonth" required>
                                <div class="invalid-feedback">Please provide the number of prescriptions.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Imaging / Radiology Centre')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Type of Major Equipment</label>
                                <select class="multiple-select" id="majorEquipment" multiple required>
                                    <option value="MRI Scanner">MRI Scanner</option>
                                    <option value="CT Scanner">CT Scanner</option>
                                    <option value="X-ray machine">X-ray machine</option>
                                    <option value="Ultrasound">Ultrasound</option>
                                    <option value="Mammography Machine">Mammography Machine</option>
                                    <option value="Fluoroscopy">Fluoroscopy</option>
                                    <option value="Angiography">Angiography</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one equipment type.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Number of Scans/Imaging Procedures per Month</label>
                                <input type="number" class="form-control" id="scansPerMonth" required>
                                <div class="invalid-feedback">Please provide the number of scans.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Eye Clinic')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of Eye Surgeries/Procedures per Month</label>
                                <input type="number" class="form-control" id="eyeProcedures" required>
                                <div class="invalid-feedback">Please provide the number of eye procedures.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Do you have an optical dispensing unit?</label>
                                <select class="form-select" id="hasOpticalUnit" required>
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <div class="invalid-feedback">Please select an option.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Average number of glasses dispensed per month</label>
                                <input type="number" class="form-control" id="glassesDispensed" required>
                                <div class="invalid-feedback">Please provide the number of glasses dispensed.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Rehabilitation Centre')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Services Offered</label>
                                <select class="multiple-select" id="primaryServices" multiple required>
                                    <option value="Physiotherapy">Physiotherapy</option>
                                    <option value="Occupational Therapy">Occupational Therapy</option>
                                    <option value="Speech Therapy">Speech Therapy</option>
                                    <option value="Prosthetics/Orthotics">Prosthetics/Orthotics</option>
                                    <option value="Chronic Pain Management">Chronic Pain Management</option>
                                    <option value="Neurological Rehabilitation">Neurological Rehabilitation</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one primary service.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Average Number of Therapy Sessions per Month</label>
                                <input type="number" class="form-control" id="therapySessions" required>
                                <div class="invalid-feedback">Please provide the number of therapy sessions.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Diagnostic Laboratory')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Services Offered</label>
                                <select class="multiple-select" id="primaryServices" multiple required>
                                    <option value="Pathology">Pathology</option>
                                    <option value="Hematology">Hematology</option>
                                    <option value="Parasitology">Parasitology</option>
                                    <option value="Immunology and Serology">Immunology and Serology</option>
                                    <option value="Neurological Rehabilitation">Neurological Rehabilitation</option>
                                    <option value="Urinalysis">Urinalysis</option>
                                    <option value="Blood Transfusion">Blood Transfusion</option>
                                    <option value="Histopathology and Cytology">Histopathology and Cytology</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one primary service.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Average Number of Patients (Lab tests) per Month</label>
                                <input type="number" class="form-control" id="labTestsPerMonth" required>
                                <div class="invalid-feedback">Please provide the number of lab tests.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Wellness Centre')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Services Offered</label>
                                <select class="multiple-select" id="primaryServices" multiple required>
                                    <option value="spa services">Spa services</option>
                                    <option value="massage therapy">Massage therapy</option>
                                    <option value="Yoga">Yoga</option>
                                    <option value="Meditation">Meditation</option>
                                    <option value="nutritional counselling">Nutritional counselling</option>
                                    <option value="fitness programs">Fitness programs</option>
                                    <option value="Acupuncture">Acupuncture</option>
                                    <option value="hydrotherapy">Hydrotherapy</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one primary service.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Type of Major Equipment in Facility</label>
                                <select class="multiple-select" id="majorEquipment" multiple>
                                    <option value="specialized massage chairs">Specialized massage chairs</option>
                                    <option value="Sauna">Sauna</option>
                                    <option value="steam room">Steam room</option>
                                    <option value="hydrotherapy tubs">Hydrotherapy tubs</option>
                                    <option value="fitness machines">Fitness machines</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Average Monthly Client Visits</label>
                                <input type="number" class="form-control" id="avgClientVisits" required>
                                <div class="invalid-feedback">Please provide the average client visits.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Membership/Package fee (if applicable)</label>
                                <select class="form-select" id="membershipFee">
                                    <option value="">Select fee range</option>
                                    <option value="0 to 25,000">₦0 to ₦25,000</option>
                                    <option value="25,000 to 50,000">₦25,000 to ₦50,000</option>
                                    <option value="50,000 to 100,000">₦50,000 to ₦100,000</option>
                                </select>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Patent Medicine Store')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Products Sold</label>
                                <select class="multiple-select" id="primaryProducts" multiple required>
                                    <option value="over-the-counter medications">Over-the-counter medications</option>
                                    <option value="basic first aid">Basic first aid</option>
                                    <option value="Toiletries">Toiletries</option>
                                    <option value="nutritional supplements">Nutritional supplements</option>
                                    <option value="common household remedies">Common household remedies</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one product.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Average Number of Sales Transactions per Month</label>
                                <input type="number" class="form-control" id="salesTransactions" required>
                                <div class="invalid-feedback">Please provide the number of transactions.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                        </div>
                    `;

    } else if (facilityType.includes('Herbal Medicine Centre')) {
      html = `
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Primary Services Offered</label>
                                <select class="multiple-select" id="primaryServices" multiple required>
                                    <option value="herbal remedies">Herbal remedies</option>
                                    <option value="traditional bone setting">Traditional bone setting</option>
                                    <option value="traditional birth attendance">Traditional birth attendance</option>
                                    <option value="traditional massage">Traditional massage</option>
                                </select>
                                <div class="invalid-feedback">Please select at least one primary service.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Cost of Initial Consultation/Treatment Fee (₦)</label>
                                <input type="number" class="form-control" id="consultationFee" required>
                                <div class="invalid-feedback">Please provide the consultation fee.</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label class="form-label">Number of herbal medicine dispensed per month</label>
                                <input type="number" class="form-control" id="herbalMedicineDispensed" required>
                                <div class="invalid-feedback">Please provide the number of herbal medicines dispensed.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Number of Employees</label>
                                <input type="number" class="form-control" id="numberOfEmployees" required>
                                <div class="invalid-feedback">Please provide the number of employees.</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Average Monthly Client Visits</label>
                                <input type="number" class="form-control" id="avgClientVisits" required>
                                <div class="invalid-feedback">Please provide the average client visits.</div>
                            </div>
                        </div>
                    `;
    }

    operationsContent.innerHTML = html;
    initializeSelectize();
  });


  // Form submission
  document.getElementById('facilityForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateSection(currentSection)) {
      registerUser();
    }
  });

  // Generate review summary
  function generateSummary() {
    const summary = document.getElementById('reviewSummary');
    let html = `
      <h6>Identification & Registration</h6>
      <p><strong>Legal Name:</strong> ${document.getElementById('legalName').value}</p>
      <p><strong>Facility Type:</strong> ${document.getElementById('facilityType').value}</p>
      <p><strong>Registration Number:</strong> ${document.getElementById('registrationNumber').value}</p>
      <p><strong>Ownership Type:</strong> ${document.getElementById('ownershipType').value}</p>
      <p><strong>Operating License Number:</strong> ${document.getElementById('operatingLicenseNumber').value}</p>
      <p><strong>Health Facility Code:</strong> ${document.getElementById('healthFacilityCode').value}</p>
      <p><strong>License Expiry Date:</strong> ${document.getElementById('licenseExpiryDate').value}</p>
      <p><strong>Issuing Authority:</strong> ${Array.from(document.getElementById('issuingAuthority').selectedOptions).map(opt => opt.value).join(', ')}</p>
      <p><strong>TIN:</strong> ${document.getElementById('taxIdentificationNumber').value}</p>
      <p><strong>Date of Establishment:</strong> ${document.getElementById('dateOfEstablishment').value}</p>
      
      <h6 class="mt-4">Location & Contact</h6>
      <p><strong>Address:</strong> ${document.getElementById('address').value}</p>
      <p><strong>City/Town:</strong> ${document.getElementById('city').value}</p>
      <p><strong>LGA:</strong> ${document.getElementById('lga').value}</p>
      <p><strong>State:</strong> ${document.getElementById('state').value}</p>
      <p><strong>Phone:</strong> ${document.getElementById('phoneNumber').value}</p>
      <p><strong>Email:</strong> ${document.getElementById('email').value || 'Not provided'}</p>
      <p><strong>Website:</strong> ${document.getElementById('website').value || 'Not provided'}</p>
      <p><strong>Geo-coordinates:</strong> ${document.getElementById('latitude').value}, ${document.getElementById('longitude').value}</p>
  `;

    // Add branches if any
    if (document.getElementById('hasBranches').checked) {
      const branches = document.querySelectorAll('.branch-entry');
      if (branches.length > 0) {
        html += `<h6 class="mt-4">Branches</h6>`;
        branches.forEach((branch, index) => {
          html += `
              <p><strong>Branch ${index + 1}:</strong> ${branch.querySelector('.branch-name').value}</p>
              <p><strong>Address:</strong> ${branch.querySelector('.branch-address').value}</p>
              <p><strong>City:</strong> ${branch.querySelector('.branch-city').value}</p>
              <p><strong>LGA:</strong> ${branch.querySelector('.branch-lga').value}</p>
              <p><strong>Geo-coordinates:</strong> ${branch.querySelector('.branch-latitude').value}, ${branch.querySelector('.branch-longitude').value}</p>
          `;
        });
      }
    }

    // Add operations based on facility type
    const facilityType = document.getElementById('facilityType').value;
    html += `<h6 class="mt-4">Operations</h6>`;

    if (facilityType.includes('Primary Healthcare Facility') ||
      facilityType.includes('Secondary Healthcare Facility') ||
      facilityType.includes('Tertiary Healthcare Facilities') ||
      facilityType.includes('Private Hospitals/Clinics')) {

      html += `
        <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value).join(', ')}</p>
        <p><strong>Major Equipment:</strong> ${Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value).join(', ') || 'None listed'}</p>
        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
        <p><strong>Number of Beds:</strong> ${document.getElementById('numberOfBeds').value}</p>
        <p><strong>Avg Monthly Patient Visits:</strong> ${document.getElementById('avgMonthlyPatientVisits').value}</p>
        <p><strong>Number of Surgeries/Procedures:</strong> ${document.getElementById('numberOfSurgeries').value}</p>
        <p><strong>Registration Fee (₦):</strong> ${document.getElementById('registrationFee').value}</p>
    `;

    } else if (facilityType.includes('Maternity Home')) {
      html += `
          <p><strong>Avg Births per Month:</strong> ${document.getElementById('avgBirthsPerMonth').value}</p>
          <p><strong>CS Births per Month:</strong> ${document.getElementById('csBirthsPerMonth').value}</p>
          <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
          <p><strong>Ante-Natal Patients:</strong> ${document.getElementById('anteNatalPatients').value}</p>
          <p><strong>Post-Natal Patients:</strong> ${document.getElementById('postNatalPatients').value}</p>
      `;

    } else if (facilityType.includes('Dental Clinic')) {
      html += `
          <p><strong>Dental Chairs/Units:</strong> ${document.getElementById('dentalChairs').value}</p>
          <p><strong>Avg Procedures per Month:</strong> ${document.getElementById('avgProcedures').value}</p>
          <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
      `;

    } else if (facilityType.includes('Pharmacy / Chemist')) {
      html += `
          <p><strong>Prescriptions Dispensed per Month:</strong> ${document.getElementById('prescriptionsPerMonth').value}</p>
          <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
      `;

    } else if (facilityType.includes('Imaging / Radiology Centre')) {
      html += `
          <p><strong>Major Equipment:</strong> ${Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value).join(', ')}</p>
          <p><strong>Scans/Imaging per Month:</strong> ${document.getElementById('scansPerMonth').value}</p>
          <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
      `;

    } else if (facilityType.includes('Eye Clinic')) {
      html += `
                        <p><strong>Eye Procedures per Month:</strong> ${document.getElementById('eyeProcedures').value}</p>
                        <p><strong>Optical Dispensing Unit:</strong> ${document.getElementById('hasOpticalUnit').value}</p>
                        <p><strong>Glasses Dispensed per Month:</strong> ${document.getElementById('glassesDispensed').value}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                    `;

    } else if (facilityType.includes('Rehabilitation Centre')) {
      html += `
                        <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value).join(', ')}</p>
                        <p><strong>Therapy Sessions per Month:</strong> ${document.getElementById('therapySessions').value}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                    `;

    } else if (facilityType.includes('Diagnostic Laboratory')) {
      html += `
                        <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value).join(', ')}</p>
                        <p><strong>Lab Tests per Month:</strong> ${document.getElementById('labTestsPerMonth').value}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                    `;

    } else if (facilityType.includes('Wellness Centre')) {
      html += `
                        <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value).join(', ')}</p>
                        <p><strong>Major Equipment:</strong> ${Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value).join(', ') || 'None listed'}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                        <p><strong>Avg Client Visits:</strong> ${document.getElementById('avgClientVisits').value}</p>
                        <p><strong>Membership Fee:</strong> ${document.getElementById('membershipFee').value || 'Not specified'}</p>
                    `;

    } else if (facilityType.includes('Patent Medicine Store')) {
      html += `
                        <p><strong>Products Sold:</strong> ${Array.from(document.getElementById('primaryProducts').selectedOptions).map(opt => opt.value).join(', ')}</p>
                        <p><strong>Sales Transactions per Month:</strong> ${document.getElementById('salesTransactions').value}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                    `;

    } else if (facilityType.includes('Herbal Medicine Centre')) {
      html += `
                        <p><strong>Services Offered:</strong> ${Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value).join(', ')}</p>
                        <p><strong>Consultation Fee (₦):</strong> ${document.getElementById('consultationFee').value}</p>
                        <p><strong>Herbal Medicine Dispensed per Month:</strong> ${document.getElementById('herbalMedicineDispensed').value}</p>
                        <p><strong>Number of Employees:</strong> ${document.getElementById('numberOfEmployees').value}</p>
                        <p><strong>Avg Client Visits:</strong> ${document.getElementById('avgClientVisits').value}</p>
                    `;
    }

    summary.innerHTML = html;
  }

  // Prepare payload for API submission
  function preparePayload() {
    const facilityType = document.getElementById('facilityType').value;
    let operations = {};

    // Prepare operations based on facility type
    if (facilityType.includes('Primary Healthcare Facility') ||
      facilityType.includes('Secondary Healthcare Facility') ||
      facilityType.includes('Tertiary Healthcare Facilities') ||
      facilityType.includes('Private Hospitals/Clinics')) {

      operations = {
        services_offered: Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value),
        major_equipment: Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value),
        number_of_employees: document.getElementById('numberOfEmployees').value,
        number_of_beds: document.getElementById('numberOfBeds').value,
        avg_monthly_patient_visits: document.getElementById('avgMonthlyPatientVisits').value,
        number_of_surgeries_per_month: document.getElementById('numberOfSurgeries').value,
        registration_fee: document.getElementById('registrationFee').value
      };

    } else if (facilityType.includes('Maternity Home')) {
      operations = {
        avg_births_per_month: document.getElementById('avgBirthsPerMonth').value,
        cs_births_per_month: document.getElementById('csBirthsPerMonth').value,
        number_of_employees: document.getElementById('numberOfEmployees').value,
        ante_natal_patients: document.getElementById('anteNatalPatients').value,
        post_natal_patients: document.getElementById('postNatalPatients').value
      };

    } else if (facilityType.includes('Dental Clinic')) {
      operations = {
        dental_chairs: document.getElementById('dentalChairs').value,
        avg_procedures_per_month: document.getElementById('avgProcedures').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Pharmacy / Chemist')) {
      operations = {
        prescriptions_per_month: document.getElementById('prescriptionsPerMonth').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Imaging / Radiology Centre')) {
      operations = {
        major_equipment: Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value),
        scans_per_month: document.getElementById('scansPerMonth').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Eye Clinic')) {
      operations = {
        eye_procedures_per_month: document.getElementById('eyeProcedures').value,
        has_optical_unit: document.getElementById('hasOpticalUnit').value,
        glasses_dispensed_per_month: document.getElementById('glassesDispensed').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Rehabilitation Centre')) {
      operations = {
        services_offered: Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value),
        therapy_sessions_per_month: document.getElementById('therapySessions').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Diagnostic Laboratory')) {
      operations = {
        services_offered: Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value),
        lab_tests_per_month: document.getElementById('labTestsPerMonth').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Wellness Centre')) {
      operations = {
        services_offered: Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value),
        major_equipment: Array.from(document.getElementById('majorEquipment').selectedOptions).map(opt => opt.value),
        number_of_employees: document.getElementById('numberOfEmployees').value,
        avg_client_visits: document.getElementById('avgClientVisits').value,
        membership_fee: document.getElementById('membershipFee').value
      };

    } else if (facilityType.includes('Patent Medicine Store')) {
      operations = {
        products_sold: Array.from(document.getElementById('primaryProducts').selectedOptions).map(opt => opt.value),
        sales_transactions_per_month: document.getElementById('salesTransactions').value,
        number_of_employees: document.getElementById('numberOfEmployees').value
      };

    } else if (facilityType.includes('Herbal Medicine Centre')) {
      operations = {
        services_offered: Array.from(document.getElementById('primaryServices').selectedOptions).map(opt => opt.value),
        consultation_fee: document.getElementById('consultationFee').value,
        herbal_medicine_dispensed_per_month: document.getElementById('herbalMedicineDispensed').value,
        number_of_employees: document.getElementById('numberOfEmployees').value,
        avg_client_visits: document.getElementById('avgClientVisits').value
      };
    }

    // Prepare branches if any
    let branches = [];
    if (document.getElementById('hasBranches').checked) {
      const branchEntries = document.querySelectorAll('.branch-entry');
      branchEntries.forEach(branch => {
        branches.push({
          branch_name: branch.querySelector('.branch-name').value,
          address: branch.querySelector('.branch-address').value,
          city: branch.querySelector('.branch-city').value,
          lga: branch.querySelector('.branch-lga').value,
          latitude: branch.querySelector('.branch-latitude').value,
          longitude: branch.querySelector('.branch-longitude').value
        });
      });
    }

    // Construct the full payload
    const payload = {
      endpoint: "createFacility",
      data: {
        legal_name: document.getElementById('legalName').value,
        facility_type: document.getElementById('facilityType').value,
        registration_number: document.getElementById('registrationNumber').value,
        ownership_type: document.getElementById('ownershipType').value,
        operating_license_number: document.getElementById('operatingLicenseNumber').value,
        health_facility_code: document.getElementById('healthFacilityCode').value,
        license_expiry_date: document.getElementById('licenseExpiryDate').value,
        issuing_authority: Array.from(document.getElementById('issuingAuthority').selectedOptions).map(opt => opt.value),
        certificate_of_standard: document.getElementById('certificateOfStandard').value || undefined,
        nhis_accreditation_number: document.getElementById('nhisAccreditationNumber').value || undefined,
        tax_identification_number: document.getElementById('taxIdentificationNumber').value,
        date_of_establishment: document.getElementById('dateOfEstablishment').value,
        location: {
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          lga: document.getElementById('lga').value,
          phone_number: document.getElementById('phoneNumber').value,
          email: document.getElementById('email').value || undefined,
          website: document.getElementById('website').value || undefined,
          has_branches: document.getElementById('hasBranches').checked,
          latitude: document.getElementById('latitude').value,
          longitude: document.getElementById('longitude').value
        },
        operations: operations,
        branches: branches.length > 0 ? branches : undefined
      }
    };

    return payload;
  }


  async function registerUser() {
    if (isLoading) return;

    try {
      // Show loader
      isLoading = true;
      $("#SubmitButton").addClass("hidden");
      $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `);

      // First register the user
      const userData = {
        "endpoint": "createPayerAccount",
        "data": {
          "img": "assets/img/userprofile.png",
          "firstname": $("#legalName").val(),
          "surname": "",
          "email": $("#email").val(),
          "phone": $("#phoneNumber").val(),
          "tin": $("#taxIdentificationNumber").val(),
          "address": $("#address").val(),
          "state": "Plateau",
          "lga": $("#lga").val(),
          "business_type": "",
          "annual_revenue": "",
          "value_business": "",
          "numberofstaff": "",
          "password": "",
          "rep_firstname": "",
          "rep_surname": "",
          "rep_email": "",
          "rep_phone": "",
          "rep_position": "",
          "rep_state": "",
          "rep_lga": "",
          "rep_address": "",
          "enumlatitude": $("#latitude").val(),
          "enumlongitude": $("#longitude").val(),
          "category": "Hospital",
          "industry": "Hospitals",
          "business_own": "1",
          "created_by": "enumerator",
          "by_account": userInfo2?.id
        }
      };

      const userResponse = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'User registration failed');
      }

      const userResult = await userResponse.json();

      // If user registration is successful, submit the facility form with additional data from response
      const facilityPayload = preparePayload();

      // Add data from first API response to facility payload if needed
      facilityPayload.data.tax_number = userResult.data.tax_number; // Example: add user ID from first response

      const facilityResponse = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(facilityPayload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!facilityResponse.ok) {
        const errorData = await facilityResponse.json();
        throw new Error(errorData.message || 'Facility registration failed');
      }

      const facilityResult = await facilityResponse.json();

      // Success - show SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: 'Registration completed successfully',
        icon: 'success',
        confirmButtonText: 'Proceed',
        allowOutsideClick: false,
      });

      // Reload page after confirmation
      window.location.reload();

    } catch (error) {
      console.error('Registration error:', error);
      $("#msg_box").html(`
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong>Error!</strong> ${error.message}
      </div>
    `);
    } finally {
      // Hide loader
      isLoading = false;
      $("#SubmitButton").removeClass("hidden");
      $("#msg_box").html('');
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

function getLocationFromIP() {
  // Using ip-api.com's free service (no API key needed)
  fetch('http://ip-api.com/json/?fields=lat,lon')
    .then(response => response.json())
    .then(data => {
      if (data.lat && data.lon) {
        submitLocation(data.lat, data.lon, 'ip');
      } else {
        console.error("Could not get location from IP");
        submitLocation(null, null, 'failed');
      }
    })
    .catch(error => {
      console.error("IP location error:", error);
      submitLocation(null, null, 'failed');
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
