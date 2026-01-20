const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('categ_id');

// Tax law selection function
function selectTaxLaw(type) {
  const oldCard = document.getElementById('oldTaxCard');
  const newCard = document.getElementById('newTaxCard');
  const selectedInput = document.getElementById('selectedTaxLaw');
  const submitBtn = document.getElementById('theButton');
  const btnText = document.getElementById('btnText');

  // Remove selected class from both cards
  oldCard.classList.remove('selected');
  newCard.classList.remove('selected');

  // Add selected class to the chosen card
  if (type === 'old') {
    oldCard.classList.add('selected');
    selectedInput.value = 'old';
    btnText.textContent = 'Register Employee (Old Tax Law)';
  } else {
    newCard.classList.add('selected');
    selectedInput.value = 'new';
    btnText.textContent = 'Register Employee (New Tax Law)';
  }

  // Enable the submit button
  submitBtn.disabled = false;
}

function continueReg() {
  const selectedTaxLaw = document.getElementById('selectedTaxLaw').value;
  
  // Check if tax law is selected
  if (!selectedTaxLaw) {
    Swal.fire({
      title: 'Selection Required',
      text: 'Please select a tax law calculation method before continuing.',
      icon: 'warning',
      confirmButtonColor: '#CDA545'
    });
    return;
  }

  let allInputs = document.querySelectorAll(".enumInput");
  
  // Check for empty required fields
  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill all required fields',
        icon: 'warning',
        confirmButtonColor: '#CDA545'
      });
      inpt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inpt.focus();
      return;
    }
  }

  // All validations passed, proceed with registration
  registerUser(selectedTaxLaw);
}

function nhisSelect(e) {
  if (e.checked) {
    $("#employeeNhis").html(`
      <input type="number" class="form-control enumInput" data-name="nhis" placeholder="NHIS amount" />
    `);
  } else {
    $("#employeeNhis").html("");
  }
}

function registerUser(taxLawType) {
  const submitBtn = document.getElementById('theButton');
  const btnText = document.getElementById('btnText');
  
  // Disable button and show loading state
  submitBtn.disabled = true;
  btnText.innerHTML = `
    <span class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </span>
  `;

  // Determine endpoint based on tax law type
  const endpoint = taxLawType === 'new' ? 'newPayee' : 'createSpecialUserEmployee';

  let EnumData = {
    "endpoint": endpoint,
    "data": {
      "category_id": category,
      "new_gross": '',
      "tax_law_type": taxLawType // Include tax law type in payload
    }
  };

  let allInputs = document.querySelectorAll(".enumInput");
  let allFormInputs = document.querySelectorAll(".form-check-input");

  allInputs.forEach((inputt) => {
    EnumData.data[inputt.dataset.name] = inputt.value;
  });

  allFormInputs.forEach(inpt => {
    EnumData.data[inpt.value] = inpt.checked ? 'yes' : 'no';
  });

  console.log('Submitting with endpoint:', endpoint);
  console.log('Payload:', EnumData);

  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();

      if (data.status === 1) {
        Swal.fire({
          title: 'Success!',
          text: `Employee registered successfully using the ${taxLawType === 'new' ? 'New' : 'Old'} Tax Law calculation.`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#CDA545',
          confirmButtonText: 'Go to PAYE Manager'
        }).then((result) => {
          window.location.href = `./payedetails.html?payerID=${category}`;
        });
      } else {
        // Re-enable button with original text
        submitBtn.disabled = false;
        btnText.textContent = `Register Employee (${taxLawType === 'new' ? 'New' : 'Old'} Tax Law)`;
        
        $("#msg_box").html(`
          <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
            <p class="font-medium">${data.message}</p>
          </div>
        `);
        
        // Auto-clear message after 5 seconds
        setTimeout(() => {
          $("#msg_box").html('');
        }, 5000);
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      // Re-enable button with original text
      submitBtn.disabled = false;
      btnText.textContent = `Register Employee (${taxLawType === 'new' ? 'New' : 'Old'} Tax Law)`;
      
      $("#msg_box").html(`
        <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center">
          <p class="font-medium">Something went wrong! Please try again.</p>
        </div>
      `);
      
      // Auto-clear message after 5 seconds
      setTimeout(() => {
        $("#msg_box").html('');
      }, 5000);
    }
  }

  sendToDB();
}