
const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

const enumerated = urlParams.get('enumerated')
let userrrData = {}
let userDATA = {}

async function getTaxPayer() {
  try {
    const response = await fetch(`${HOST}/?userProfile&id=${userIdo}`);
    const data = await response.json();
    userDATA = data.user;

    let taxPayerData = data.user;
    let theimg = taxPayerData.img;
    if (theimg === "") {
      theimg = "./assets/img/avatars/1.png";
    }
    $("#emailPassReset").val(taxPayerData.email)
    $("#tax-numberReset").val(taxPayerData.tax_number)
    // Update user info
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
        <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tin || '-'}</p>
        <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type || '-'}</p>
        <p><span class="font-bold">Employment Status:</span> ${taxPayerData.employment_status || '-'}</p>
        <p><span class="font-bold">Number of Staff:</span> ${taxPayerData.number_of_staff || '-'}</p>
      </div>
    `);

    // Profile section
    let profilo = "";
    if (taxPayerData.category === "Individual") {
      profilo += `
        <div class="flex justify-between">
          <label class="w-4/12">First Name</label>
          <div class="form-group w-8/12">
            <input class="form-control mt-1 updtProf" name="first_name"x type="text" data-name="first_name" value="${taxPayerData.first_name}" />
          </div>
        </div>
         <div class="flex justify-between">
          <label class="w-4/12">Surname</label>
          <div class="form-group w-8/12">
            <input class="form-control mt-1 updtProf" name="surname" data-name="surname" type="text" value="${taxPayerData.surname}" />
          </div>
        </div>
      `;
    } else {
      profilo += `
      <div class="flex justify-between">
        <label class="w-4/12">First Name</label>
        <div class="form-group w-8/12">
          <input class="form-control mt-1 updtProf" name="first_name" data-name="first_name" type="text" value="${taxPayerData.first_name}" />
        </div>
      </div>
    `;
    }

    profilo += `
     <div class="flex justify-between mt-2">
          <label class="w-4/12">Tax Identification Number</label>
          <div class="form-group w-8/12">
            <input class="form-control mt-1 updtProf" type="text" name="tin" data-name="tin" value="${taxPayerData.tin}" maxlength="15" readonly />
          </div>
        </div>
      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">Employment status</label>
        <select class="form-select mt-1 w-8/12 updtProf" data-name="employment_status" required>
          <option value="" ${!taxPayerData.employment_status ? "selected" : ""}>-Select--</option>
          <option value="Selfemployed" ${taxPayerData.employment_status === "Selfemployed" ? "selected" : ""}>Self-employed</option>
          <option value="Employee" ${taxPayerData.employment_status === "Employee" ? "selected" : ""}>Employee</option>
          <option value="Worker" ${taxPayerData.employment_status === "Worker" ? "selected" : ""}>Worker</option>
          <option value="Unemployed" ${taxPayerData.employment_status === "Unemployed" ? "selected" : ""}>Unemployed</option>
        </select>
      </div>

     <div class="flex gap-x-20 mt-3">
        <label class="w-4/12">Are you a business owner?</label>
        <div class='flex gap-x-2 w-8/12'>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="yes" name="businessOwner" data-name="business_own" id="businessOwnerYes" ${taxPayerData.business_own === 'Yes' ? 'checked' : ''}>
            <label class="form-check-label" for="businessOwnerYes">Yes</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="no" name="businessOwner" data-name="business_own" id="businessOwnerNo" ${taxPayerData.business_own === 'No' ? 'checked' : ''}>
            <label class="form-check-label" for="businessOwnerNo">No</label>
          </div>
        </div>
      </div>
      <div class="flex justify-between mt-2 items-center" id="businessTypeContainer" style="display: none;">
        <label class="w-4/12">Type of business</label>
        <select class="form-select mt-1 w-8/12 updtProf" data-name="business_type">
          <option value="" ${!taxPayerData.business_type ? "selected" : ""}>-Select--</option>
          <option value="Commercial" ${taxPayerData.business_type === "Commercial" ? "selected" : ""}>Commercial</option>
          <option value="Pool/betting" ${taxPayerData.business_type === "Pool/betting" ? "selected" : ""}>Pool/betting</option>
          <option value="Education" ${taxPayerData.business_type === "Education" ? "selected" : ""}>Education</option>
          <option value="Hospitality" ${taxPayerData.business_type === "Hospitality" ? "selected" : ""}>Hospitality</option>
          <option value="Manufacturing" ${taxPayerData.business_type === "Manufacturing" ? "selected" : ""}>Manufacturing</option>
          <option value="Retail" ${taxPayerData.business_type === "Retail" ? "selected" : ""}>Retail</option>
          <option value="Mining" ${taxPayerData.business_type === "Mining" ? "selected" : ""}>Mining</option>
          <option value="Services" ${taxPayerData.business_type === "Services" ? "selected" : ""}>Services</option>
          <option value="Agriculture" ${taxPayerData.business_type === "Agriculture" ? "selected" : ""}>Agriculture</option>
          <option value="Housing/real estate/lands" ${taxPayerData.business_type === "Housing/real estate/lands" ? "selected" : ""}>Housing/real estate/lands</option>
          <option value="Transporting" ${taxPayerData.business_type === "Transporting" ? "selected" : ""}>Transporting</option>
          <option value="Legal" ${taxPayerData.business_type === "Legal" ? "selected" : ""}>Legal</option>
          <option value="General" ${taxPayerData.business_type === "General" ? "selected" : ""}>General</option>
        </select>
      </div>

      <div class="flex justify-between mt-2">
        <label class="w-4/12">Email</label>
        <div class="form-group w-8/12">
          <input class="form-control mt-1 updtProf" data-name="email" type="text" value="${taxPayerData.email}" readonly />
        </div>
      </div>

      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">Phone number</label>
        <div class="form-group w-8/12">
          <input class="form-control mt-1 updtProf" data-name="phone" type="text" value="${taxPayerData.phone}" maxlength="15" />
        </div>
      </div>

      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">Annual Income</label>
        <div class="form-group w-8/12">
          <input class="form-control mt-1 updtProf" data-name="annual_income" type="text" value="${taxPayerData.annual_income}" maxlength="15" />
        </div>
      </div>

      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">State</label>
        <select class="form-select mt-1 w-8/12 updtProf" id="selectState" data-name="state" required>
          <option value="${taxPayerData.state}">${taxPayerData.state}</option>
        </select>
      </div>

      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">Local Government Area</label>
        <select class="form-select mt-1 w-8/12 updtProf" id="selectLGA" data-name="lga" required>
        </select>
      </div>

      <div class="flex justify-between mt-2 items-center">
        <label class="w-4/12">Address</label>
        <div class="form-group w-8/12">
          <input class="form-control mt-1 updtProf" data-name="address" type="text" value="${taxPayerData.address}" />
        </div>
      </div>
    `;



    $("#updtProfile").html(profilo);

    function toggleBusinessType() {
      const businessOwnerYes = document.getElementById("businessOwnerYes");
      const businessOwnerNo = document.getElementById("businessOwnerNo");
      const businessTypeContainer = document.getElementById("businessTypeContainer");

      if (businessOwnerYes.checked) {
        businessTypeContainer.style.display = "flex";
      } else {
        businessTypeContainer.style.display = "none";
      }
    }

    // Event listener for radio buttons to toggle business type field
    document.querySelectorAll('input[name="businessOwner"]').forEach((radio) => {
      radio.addEventListener('change', toggleBusinessType);
    });

    toggleBusinessType();
    let lgaSelect = document.querySelector('#selectLGA');

    lgaList["Plateau"].forEach(lga => {
      lgaSelect.innerHTML += `
        <option value="${lga}">${lga}</option>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

getTaxPayer()

async function getTaxPayer2() {
  try {
    const response = await fetch(`${HOST}/?getEnumerationTaxPayer`)
    const data = await response.json()
    let taxPayerData = data.message.find(dd => dd.tax_number === userIdo)
    userrrData = taxPayerData

    if (taxPayerData.img === "") {
      theimg = "./assets/img/avatars/1.png"
    }
    $("#emailPassReset").val(taxPayerData.email)
    $("#userInfo").html(`
        <div class="flex gap-x-2">
        <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
        <div class="mt-2">
        <h6 class="font-bold text-[20px]">${taxPayerData.first_name} ${taxPayerData.surname}</h6>
        <p><span class="font-bold">TIN:</span> ${taxPayerData.tax_number}</p>
        </div>
        </div>
           
            <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
              <p><span class="font-bold">Category:</span> ${taxPayerData.category}</p>
              <p><span class="font-bold">State:</span> ${taxPayerData.state}</p>
              <p><span class="font-bold">LGA:</span> ${taxPayerData.lga}</p>
              <p><span class="font-bold">Address:</span> ${taxPayerData.address}</p>
              <p><span class="font-bold">Email address:</span> ${taxPayerData.email}</p>
              <p><span class="font-bold">Contact:</span> ${taxPayerData.phone}</p>
              <p><span class="font-bold">Tax Number:</span> ${taxPayerData.tax_number}</p>
              <p><span class="font-bold">Business Type:</span> ${taxPayerData.business_type}</p>
            </div>
        `)

  } catch (error) {
    console.log(error)
  }

}
// getTaxPayer2()


$("#updateProfile").on("click", function (e) {
  e.preventDefault()

  let allInputs = document.querySelectorAll(".updtProf")
  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#updateProfile").addClass("hidden")

  let obj = {
    ...userDATA
  }
  delete obj.verification_code;
  delete obj.verification_status
  delete obj.timeIn
  delete obj.industry
  delete obj.img
  delete obj.password

  allInputs.forEach(allInput => {
    if (allInput.value === "") {

    } else {
      obj[allInput.dataset.name] = allInput.value
      // finalObj[allInput.dataset.name] = allInput.value
    }

  })

  // Remove any keys that are empty, null, or undefined
  Object.keys(obj).forEach(key => {
    if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

  console.log(obj)
  let queryString = new URLSearchParams(obj).toString();
  console.log(queryString)

  $.ajax({
    type: "GET",
    url: `${HOST}?updateTaxPayer&${queryString}`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#updateProfile").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)


        setTimeout(() => {
          window.location.reload()
        }, 1000);

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#updateProfile").removeClass("hidden")
    }
  });

})

let userDetails
async function fetchUserDetails() {
  const response = await fetch(`${HOST}?userProfile&id=${userDATA.tax_number}`)
  const userPrf = await response.json()

  userDetails = userPrf.user
}

fetchUserDetails()

$("#openUpload").on("click", function (e) {
  document.querySelector("#profile_picIn").click()
})

let input = document.querySelector("#profile_picIn")
let preview = document.querySelector("#preview")
let thePicUrl = ""

function profileChanged() {

  $("#proffer").removeClass("hidden")

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      preview.src = reader.result;
      thePicUrl = reader.result
    };
  }
}

function sendResetEmail() {
  const email = document.getElementById('emailPassReset').value.trim();
  const messageElement = document.getElementById('email-message');

  // Validate email
  if (!email) {
    showMessage(messageElement, 'Please enter your email address', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(messageElement, 'Please enter a valid email address', 'error');
    return;
  }

  const endpoint = `${HOST}?resetPassword&email=${email}&type=email`;

  async function callApi(endpoint) {
    setButtonLoading('sendResetBtn', true, 'Sending...');
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json()

      console.log(data)
      if (data.status === 1) {
        showMessage(messageElement, "Password reset link sent Successfully!", 'success')
      } else {
        throw new Error(data.message);
      }

    } catch (error) {
      console.error('Error calling API:', error);
      showMessage(messageElement, error || "An Error occured while updating password", 'error')
    } finally {
      setButtonLoading('sendResetBtn', false);
    }
  }
  callApi(endpoint)
}

function adminResetPassword() {
  const taxNumber = document.getElementById('tax-numberReset').value.trim();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const messageElement = document.getElementById('admin-message');

  // Validate inputs
  if (!taxNumber) {
    showMessage(messageElement, 'Please enter the tax number/ID', 'error');
    return;
  }

  if (!newPassword) {
    showMessage(messageElement, 'Please enter a new password', 'error');
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage(messageElement, 'Passwords do not match', 'error');
    return;
  }

  if (newPassword.length < 8) {
    showMessage(messageElement, 'Password must be at least 8 characters long', 'error');
    return;
  }

  const endpoint = `${HOST}?userPassword&id=${taxNumber}&password=${encodeURIComponent(newPassword)}&set_by=${userInfo2?.id}`;

  async function callApi(endpoint) {
    setButtonLoading('restPassBtn', true, 'Resetting...');
    try {
      const response = await fetch(endpoint, {
        method: 'GET', // or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json',
          // Add any other required headers (e.g., authorization)
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json()

      if (data.status === 1) {
        showMessage(messageElement, "Password Updated Successfully", 'success')
      } else {
        throw new Error('An Error occured while updating password');
      }
    } catch (error) {
      console.error('Error calling API:', error);
      showMessage(messageElement, "An Error occured while updating password", 'error')
    } finally {
      setButtonLoading('restPassBtn', false);
    }
  }
  callApi(endpoint)
}

// Helper to toggle loading state on a button
function setButtonLoading(buttonId, isLoading, loadingText) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isLoading) {
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.innerHTML;
    }
    btn.disabled = true;
    btn.innerHTML = `${loadingText || 'Processing...'} <span class="spinner-border spinner-border-sm align-middle ms-2" role="status" aria-hidden="true"></span>`;
  } else {
    btn.disabled = false;
    if (btn.dataset.originalText) {
      btn.innerHTML = btn.dataset.originalText;
      delete btn.dataset.originalText;
    }
  }
}

// Helper function to show messages
function showMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;

  // Reset classes then add proper Bootstrap alert classes
  element.classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');
  element.classList.add('alert');
  element.classList.add(type === 'success' ? 'alert-success' : 'alert-danger');
  element.style.display = 'block';

  // Hide message after 5 seconds
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

// Helper function to validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}