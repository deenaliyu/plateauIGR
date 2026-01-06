var currentTab = 0;
showTab(currentTab);

// Initialize dynamic year headers
initializeYearHeaders();

// Counter for other sources
let otherSourceCount = 0;

// Cloudinary Configuration (FREE TIER)
const CLOUDINARY_CLOUD_NAME = "djm3osy5z";
const CLOUDINARY_UPLOAD_PRESET = "primeguage_ibs";

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  x[n].style.display = "block";
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  showTab(currentTab);
}

// Initialize year headers based on current year
function initializeYearHeaders() {
  const currentYear = new Date().getFullYear();
  const year1 = currentYear - 1;
  const year2 = currentYear - 2;
  const year3 = currentYear - 3;

  document.getElementById("year1Header").textContent = `${year1} (₦)`;
  document.getElementById("year2Header").textContent = `${year2} (₦)`;
  document.getElementById("year3Header").textContent = `${year3} (₦)`;

  // Store year values for use in form submission
  window.incomeYears = { year1, year2, year3 };
}

// ==================== VALIDATION FUNCTIONS ====================

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Nigerian phone number validation
function isValidNigerianPhone(phone) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const patterns = [
    /^0[789][01]\d{8}$/,
    /^[789][01]\d{8}$/,
    /^\+234[789][01]\d{8}$/,
    /^234[789][01]\d{8}$/
  ];
  return patterns.some(pattern => pattern.test(cleanPhone));
}

// TIN validation (basic - at least 8 characters, alphanumeric)
function isValidTIN(tin) {
  const cleanTIN = tin.replace(/[\s\-]/g, '');
  return cleanTIN.length >= 8 && /^[A-Za-z0-9]+$/.test(cleanTIN);
}

// Validate email field
function validateEmail() {
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const email = emailInput.value.trim();

  if (!email) {
    emailInput.classList.add('is-invalid');
    emailError.textContent = 'Email is required';
    return false;
  }

  if (!isValidEmail(email)) {
    emailInput.classList.add('is-invalid');
    emailError.textContent = 'Please enter a valid email address';
    return false;
  }

  emailInput.classList.remove('is-invalid');
  return true;
}

// Validate phone field
function validatePhone() {
  const phoneInput = document.getElementById('phoneInput');
  const phoneError = document.getElementById('phoneError');
  const phone = phoneInput.value.trim();

  if (!phone) {
    phoneInput.classList.add('is-invalid');
    phoneError.textContent = 'Phone number is required';
    return false;
  }

  if (!isValidNigerianPhone(phone)) {
    phoneInput.classList.add('is-invalid');
    phoneError.textContent = 'Please enter a valid Nigerian phone number (e.g., 08012345678)';
    return false;
  }

  phoneInput.classList.remove('is-invalid');
  return true;
}

// Validate TIN field
function validateTIN() {
  const tinInput = document.getElementById('tinInput');
  const tinError = document.getElementById('tinError');
  const tin = tinInput.value.trim();

  if (!tin) {
    tinInput.classList.add('is-invalid');
    tinError.textContent = 'TIN is required';
    return false;
  }

  if (!isValidTIN(tin)) {
    tinInput.classList.add('is-invalid');
    tinError.textContent = 'Please enter a valid TIN (at least 8 alphanumeric characters)';
    return false;
  }

  tinInput.classList.remove('is-invalid');
  return true;
}

// Real-time validation on blur
$(document).ready(function () {
  $('#emailInput').on('blur', function () {
    if (this.value.trim()) {
      validateEmail();
    }
  });

  $('#phoneInput').on('blur', function () {
    if (this.value.trim()) {
      validatePhone();
    }
  });

  $('#tinInput').on('blur', function () {
    if (this.value.trim()) {
      validateTIN();
    }
  });

  // Clear error on input
  $('#emailInput').on('input', function () {
    if (this.classList.contains('is-invalid') && isValidEmail(this.value.trim())) {
      this.classList.remove('is-invalid');
    }
  });

  $('#phoneInput').on('input', function () {
    if (this.classList.contains('is-invalid') && isValidNigerianPhone(this.value.trim())) {
      this.classList.remove('is-invalid');
    }
  });

  $('#tinInput').on('input', function () {
    if (this.classList.contains('is-invalid') && isValidTIN(this.value.trim())) {
      this.classList.remove('is-invalid');
    }
  });
});

async function fetchBusiness() {
  try {
    const response = await fetch(`${HOST}?getPresumptiveTax`)
    const data = await response.json()

    // console.log(data)

    if (data.status === 1) {

      data.message.forEach(busness => {
        $("#busiType").append(`
          <option value="${busness.business_type}">${busness.business_type}</option>
        `)
      })
    }

  } catch (error) {
    console.log(error)
  }
}

fetchBusiness()

// ==================== END VALIDATION FUNCTIONS ====================

// Handle category change - switch between Individual and Organization name fields
$("#selectAccType").on("change", function () {
  let val = $(this).val();

  if (val === "Individual") {
    $("#nameFieldsContainer").html(`
      <div class="flex flex-col md:flex-row items-start gap-3 mb-4 form-row" id="individualNameFields">
        <div class="form-group w-full md:w-6/12">
          <label for="">First name*</label>
          <input type="text" class="form-control taxFInput" data-name="first_name" required
            placeholder="Enter your first name">
        </div>
        <div class="form-group w-full md:w-6/12">
          <label for="">Surname*</label>
          <input type="text" class="form-control taxFInput" data-name="surname" required
            placeholder="Enter your last name">
        </div>
      </div>
    `);
  } else {
    $("#nameFieldsContainer").html(`
      <div class="mb-4" id="organizationNameField">
        <div class="form-group w-full">
          <label for="">Name of Organization*</label>
          <input type="text" class="form-control taxFInput" data-name="first_name" required
            placeholder="Enter organization name">
        </div>
      </div>
    `);
  }
});

// Add Other Source functionality
$("#addOtherSource").on("click", function () {
  otherSourceCount++;

  const newRow = `
    <tr class="other-source-row" id="otherSource_${otherSourceCount}">
      <td class="other-source-name-cell">
        <div class="flex items-center gap-2">
          <input type="text" class="form-control otherSourceName" data-id="${otherSourceCount}" 
            placeholder="Enter source name" style="flex: 1;">
          <button type="button" class="btn-remove-source" onclick="removeOtherSource(${otherSourceCount})">
            <iconify-icon icon="material-symbols:delete"></iconify-icon>
          </button>
        </div>
      </td>
      <td><input type="number" class="form-control otherSourceYear1" data-id="${otherSourceCount}" placeholder="0.00" min="0" step="0.01"></td>
      <td><input type="number" class="form-control otherSourceYear2" data-id="${otherSourceCount}" placeholder="0.00" min="0" step="0.01"></td>
      <td><input type="number" class="form-control otherSourceYear3" data-id="${otherSourceCount}" placeholder="0.00" min="0" step="0.01"></td>
    </tr>
  `;

  $("#otherSourcesContainer").append(newRow);
});

// Remove Other Source functionality
function removeOtherSource(id) {
  $(`#otherSource_${id}`).remove();
}

// Build Income JSON structure
function buildIncomeJSON() {
  const currentYear = new Date().getFullYear();
  const year1 = currentYear - 1;
  const year2 = currentYear - 2;
  const year3 = currentYear - 3;

  let incomeData = {
    years: [year1, year2, year3],
    sources: []
  };

  // Fixed sources
  const fixedSources = [
    { name: "Trustees/Properties", key: "trustees" },
    { name: "Trade/Profession/Business", key: "trade" },
    { name: "Dividend/Interest", key: "dividend" }
  ];

  // Collect fixed sources
  fixedSources.forEach(source => {
    const year1Val = $(`input[data-name="${source.key}_year1"]`).val() || "0";
    const year2Val = $(`input[data-name="${source.key}_year2"]`).val() || "0";
    const year3Val = $(`input[data-name="${source.key}_year3"]`).val() || "0";

    incomeData.sources.push({
      name: source.name,
      type: "fixed",
      amounts: {
        [year1]: year1Val,
        [year2]: year2Val,
        [year3]: year3Val
      }
    });
  });

  // Collect other/dynamic sources
  document.querySelectorAll('.other-source-row').forEach((row) => {
    const nameInput = row.querySelector('.otherSourceName');
    const year1Input = row.querySelector('.otherSourceYear1');
    const year2Input = row.querySelector('.otherSourceYear2');
    const year3Input = row.querySelector('.otherSourceYear3');

    if (nameInput && nameInput.value.trim()) {
      incomeData.sources.push({
        name: nameInput.value.trim(),
        type: "other",
        amounts: {
          [year1]: year1Input ? year1Input.value || "0" : "0",
          [year2]: year2Input ? year2Input.value || "0" : "0",
          [year3]: year3Input ? year3Input.value || "0" : "0"
        }
      });
    }
  });

  return incomeData;
}

// Upload file to Cloudinary (FREE)
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (data.secure_url) {
    return data.secure_url;
  } else {
    console.error("Cloudinary upload failed:", data);
    throw new Error(data.error?.message || "Upload failed");
  }
}

// Generate Reference Number
$("#generateReferenceNum").on("click", async function () {
  let allInputs = document.querySelectorAll(".taxFInput");
  let fileInputs = document.querySelectorAll('.taxFInput2[type="file"]');

  // Validate email, phone, and TIN first
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isTINValid = validateTIN();

  if (!isEmailValid || !isPhoneValid || !isTINValid) {
    alert("Please correct the errors in the form");
    return;
  }

  let user_id = "";
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"));

  if (userDATA) {
    user_id = userDATA.id;
  }

  // Build the income JSON
  const incomeJSON = buildIncomeJSON();

  let obj = {
    endpoint: "insertTaxFiling",
    data: {
      user_id: user_id,
      evidence_of_tax_payment: "",
      amount: "0",
      income: JSON.stringify(incomeJSON)
    }
  };

  // Only validate required file (Tax Filing and Returns Template)
  const requiredFileInput = document.querySelector('.taxFInput2[data-name="form_assessment_upload"]');
  if (!requiredFileInput || !requiredFileInput.files.length) {
    alert("Please upload the Tax Filing and Returns Template");
    return;
  }

  // Validate required text inputs (exclude income source inputs which are optional)
  let hasEmptyRequired = false;
  let firstInvalidField = null;

  allInputs.forEach(input => {
    const dataName = input.getAttribute('data-name') || '';
    const isIncomeInput = dataName.includes('_year1') || dataName.includes('_year2') || dataName.includes('_year3');

    if (input.hasAttribute('required') && !isIncomeInput && !input.value.trim()) {
      hasEmptyRequired = true;
      input.classList.add('is-invalid');
      if (!firstInvalidField) {
        firstInvalidField = input;
      }
    } else if (!isIncomeInput) {
      input.classList.remove('is-invalid');
    }
  });

  if (hasEmptyRequired) {
    alert("Please fill in all required fields");
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidField.focus();
    }
    return;
  }

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);
  $("#generateReferenceNum").addClass("hidden");
  $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files...</p>`);

  try {
    // Upload files using Cloudinary
    for (const fileInput of fileInputs) {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileUrl = await uploadToCloudinary(file);
        obj.data[fileInput.dataset.name] = fileUrl;
      }
    }

    $("#msg_box2").html(`<p class="text-success text-center mt-4 text-lg">Files Uploaded, Generating RRR...</p>`);

    // Collect all other form inputs (excluding income source inputs)
    allInputs.forEach(input => {
      const dataName = input.getAttribute('data-name') || '';
      const isIncomeInput = dataName.includes('_year1') || dataName.includes('_year2') || dataName.includes('_year3');

      if (!isIncomeInput && dataName) {
        obj.data[dataName] = input.value;
      }
    });

    console.log("Final requestData:", obj);

    $.ajax({
      type: "POST",
      url: HOST,
      dataType: "json",
      data: JSON.stringify(obj),
      success: function (response) {
        $("#msg_box").html("");
        $("#generateReferenceNum").removeClass("hidden");
        $("#msg_box2").html(`<p class="text-success text-center mt-4 text-lg">Generated: ${response[1].tax_filling_refrence}</p>`);
        $("#referenceNum").html(response[1].tax_filling_refrence);
        $("#refNumberModal").modal("show");
      },
      error: function () {
        $("#msg_box").html(`<p class="text-danger text-center mt-4 text-lg">Something went wrong!</p>`);
        $("#generateReferenceNum").removeClass("hidden");
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    $("#msg_box2").html(`<p class="text-danger text-center mt-4 text-lg">Error Uploading files, try again</p>`);
    $("#generateReferenceNum").removeClass("hidden");
  }
});