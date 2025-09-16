let theRevs = {}
let theCateg = ["", "Corporate", "Individual", "State Agency", "Federal Agency"]
let AllRevs;

const the_sectors = [
  "Construction Sector",
  "Education Sector",
  "Agricultural Sector",
  "Financial Institutions",
  "Health Sector",
  "Hospitality Sector",
  "ICT Sector",
  "Oil and Gas Sector",
]

the_sectors.forEach((sect) => {
  $('#sectorSelect').append(`
    <option value='${sect}'>${sect}</option>  
  `)
})

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}

function generateRandomString() {
  var result = '';
  var characters = 'qwertyuiopasdfghjklzxcvbnm';
  var charactersLength = characters.length;

  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

async function getAllMda() {
  const response = await fetch(`${HOST}/?getMDAs`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theMda = revHeads.message

    // console.log(theMda)
    $("#mda").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      $("#mda").append(`
        <option value="${revHd["fullname"]}">${revHd["fullname"]}</option>
      `)

    }); f

  }
}

getAllMda()

function updateSelectedOption() {
  // Get the select element
  var select = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select.options[select.selectedIndex];
  // document.getElementById("select-search").value = selectedOption.text;
}

function addInput() {

  let theStrng = generateRandomString()
  let dateCurrent = new Date();
  let yearCurrent = dateCurrent.getFullYear();

  $("#moreInput").append(`
        <div class="flex items-center gap-3 mb-4">
          <div class="form-group w-8/12">
            <label for="">Assessment Informations*</label>
            <select onchange="updateSelectedOption()" class="${theStrng} h-[40px] inputClass form-select genInv revHeadsss revenueHeader" required id="rev_heads">
            </select>
          </div>
    
          <div class="form-group w-4/12">
            <label for="">Amount*</label>
            <input type="text" class="form-control genInv thePaymentInput h-[40px] amountTopay" id="amountTopay">
          </div>
    
          
        </div>
        
        <div class="flex items-center gap-2 mb-4">
          <div class="form-group w-full">
              <label for="">Previous Year *</label>
              <input type="text" class="form-control genInv prevYears" id="previous_year" value="${yearCurrent - 1}" readonly required>

              <input type="text" class="form-control genInv prevYears2" id="previous_year2" value="${yearCurrent - 2}" readonly required>
          </div>
            
          <div class="form-group w-full">
            <label for="">Previous Year Amount *</label>
            <input type="text" class="form-control genInv prevAmounts" id="previous_year_value" placeholder="${yearCurrent - 1} Amount" required>

            <input type="text" class="form-control genInv prevAmounts2" id="previous_year_value2" placeholder="${yearCurrent - 2} Amount" required>
          </div>
            
          <iconify-icon icon="zondicons:minus-outline" class="cursor-pointer" id="${theStrng}" onclick="removeInpt(this)"></iconify-icon>
        </div>
    `)

  const amountInput = document.querySelectorAll('.amountTopay');
  amountInput.forEach(element => {
    element.addEventListener('input', function (e) {
      let inputVal = e.target.value;

      // Immediately return if the first character is a dot to allow ".xx" inputs
      if (inputVal === '.') {
        return;
      }

      // Normalize the input by removing commas and any non-numeric characters except for the decimal point
      let normalizedInput = inputVal.replace(/,/g, '').replace(/[^0-9.]/g, '');

      // Split the input into whole and decimal parts
      let [whole, decimal] = normalizedInput.split('.');

      // Ensure the whole part is only numeric
      whole = whole.replace(/\D/g, '');

      // If there's a decimal part, limit it to two digits
      if (decimal) {
        decimal = decimal.substring(0, 2); // Limit decimal part to two digits
      }

      // Format the whole part with commas
      let formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Reconstruct the formatted value
      e.target.value = decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
    })
  });

  AllRevs.forEach(dd => {
    $(`.${theStrng}`).append(`
          <option value="${dd.id}">${dd.COL_4} (${dd.COL_3})</option>
        `)
  })
  $(`.${theStrng}`).select2()

}

function removeInpt(theIpt) {
  document.getElementById(theIpt.id).parentElement.remove()
}

$(".selCateg").on("change", function () {
  let theVal = $(this).val()

  fetchRevHeads(theCateg[theVal])

  $('#showcaseCateg').val(theCateg[theVal])

})


let allZonalOffice = null;

async function fetchZonalOffice(categ) {
  const response = await fetch(`${HOST}?tax_offices`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    allZonalOffice = revHeads.message

  }
}

// fetchZonalOffice()

$("#sectorSelect").on("change", function () {
  let theVal = $(this).val()

  fetchRevHeads(theVal)
})

async function fetchRevHeads(sector) {
  $("#revenueHeadItems").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  const response = await fetch(`${HOST}/?getAllRevenueHeads&demand_notice=yes&sector=${sector}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
    $("#revenueHeadItems").html("<p class='text-center'>No Items found for this Secotr</p>")
  } else {

    theRevs = revHeads.message
    // console.log(theRevs)
    $("#revenueHeadItems").html("")
    let revenueArr = []
    let theItemNo = 0

    let lgaInputValue = document.querySelector(".payInputs[data-name='lga']").value.toLowerCase();
    if (lgaInputValue === 'qua an pan') {
      lgaInputValue = 'qua?an'
    }
    console.log(lgaInputValue)

    const sectorFiltered = theRevs.filter(dd => dd.sector === sector && !dd.COL_3.toLowerCase().includes("local government"));
    const sectorAndCol3Filtered = theRevs.filter(dd => dd.sector === sector && dd.COL_3.toLowerCase().includes(lgaInputValue));


    console.log(sectorAndCol3Filtered, sectorFiltered)
    // Merge both filtered results
    const filteredItems = [...new Set([...sectorFiltered, ...sectorAndCol3Filtered])];

    let dateCurrent = new Date();
    let yearCurrent = dateCurrent.getFullYear();

    filteredItems.forEach((dd, i) => {
      revenueArr.push(dd);
      theItemNo++;

      $("#revenueHeadItems").append(`
        <div class="mb-2 bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Item - ${theItemNo}</h3>
          <div class="flex items-center gap-2 mb-2">
            <div class="form-group w-8/12">
              <label for="">Assessment Informations*</label>
              <select class="form-select genInv revHeadsss revenueHeader" required>
                <option value="${dd.id}" selected>${dd.COL_4} - (${dd.COL_5})</option>
              </select>
            </div>
            <div class="form-group w-4/12">
              <label for="">Amount*</label>
              <input type="text" class="form-control genInv h-[40px] thePaymentInput amountTopay amountTopa" id="amountTopay">
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="form-group w-full">
                <label for="">Previous Year *</label>
                <input type="text" class="form-control genInv prevYears" id="previous_year" value="${yearCurrent - 1}" readonly required>

                <input type="text" class="form-control genInv prevYears2 mt-2" id="previous_year2" value="${yearCurrent - 2}" readonly required>
            </div>
            
            <div class="form-group w-full">
              <label for="">Previous Year Amount *</label>
              <input type="text" class="form-control genInv prevAmounts" id="previous_year_value" placeholder="${yearCurrent - 1} Amount" required>

              <input type="text" class="form-control genInv prevAmounts2 mt-2" id="previous_year_value2" placeholder="${yearCurrent - 2} Amount" required>
            </div>
          </div>
        </div>
      `);
    });

    AllRevs = revenueArr

  }
}

let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));

async function fetchUserDetails() {
  let tinOrEmail = document.querySelector("#tinOrEmail").value;

  // Check if tinOrEmail is empty
  if (!tinOrEmail) {
    return;
  }

  $("#msg_box001").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#theFetchBtns").addClass("hidden")

  $.ajax({
    type: "GET",
    url: `${HOST}?checkUsers&data=${tinOrEmail}`,
    dataType: 'json',
    success: function (data) {

      // console.log(data);
      if (data.user) {
        // if User details exists
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);

        let allInputs = document.querySelectorAll(".payInputs")

        function selectOptionByText(selectId, matchText) {
          const selectElement = document.getElementById(selectId);

          for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].text === matchText) {
              selectElement.selectedIndex = i;
              break;
            }
          }
        }
        selectOptionByText('category', data.user.category);

        if (data.user.category === "Individual") {

        } else {
          $(`#theName`).html(`
            <div class="form-group w-full">
              <label for="">Organization Name *</label>
              <input type="text" class="form-control payInputs" data-name="first_name"
              placeholder="" value="">
            </div>
      
            <div class="form-group w-full hidden">
              <label for="">Surname *</label>
              <input type="text" class="form-control payInputs" value="&nbsp;" readonly data-name="surname"
              placeholder="" value="">
            </div>
          `)
        }

        allInputs.forEach((inputt, i) => {
          let theValuee = data.user[inputt.dataset.name]
          let theInputt = document.querySelector(`.payInputs[data-name='${inputt.dataset.name}']`)
          if (theInputt) {
            theInputt.value = theValuee
          }
        });

        if (data.user.old_user && data.user.category === "Individual") {
          if (data.user.state === null) {
            selectOptionByText('selectState', "Plateau");
          }

        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".payInputs[data-name='first_name']").value = data.user.company_name
          document.querySelector(".payInputs[data-name='email']").value = data.user.office_email
          document.querySelector(".payInputs[data-name='phone']").value = data.user.office_number

          if (data.user.state === null) {
            selectOptionByText('selectState', "Plateau");
          }
        }
        nextPrev(1)




      } else {
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);
        Swal.fire({
          title: 'Not Found',
          text: "User detail not found in the database! please go back and fill your details manually",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Fill In Manually',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            nextPrev(1);
          }
        });
      }
    },
    error: function (request, error) {
      $("#msg_box001").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try Again or Fill Details Manually.</p>
        `);
      $("#theFetchBtns").removeClass("hidden");
      console.log(error);
    }
  });
}

function fillManually() {
  const inputs = document.querySelectorAll('.payInputs');

  inputs.forEach(input => {
    input.value = '';
  });

  const selects = document.querySelectorAll('select.payInputs');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });

  nextPrev(1)
}


// console.log(userInfo)
function continuePage() {
  let genInv = document.querySelectorAll(".payInputs")

  let phonenumber = document.querySelector("#phonenumber")

  if (phonenumber.value.length !== 11) {
    alert("Phone number should be equal to 11")
    return;
  }

  for (let i = 0; i < genInv.length; i++) {
    const genn = genInv[i];

    if (genn.required && genn.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === genInv.length - 1) {
      let theCategValue = document.getElementById("category").value
      // console.log(theCateg[theCategValue])
      // fetchRevHeads(theCateg[theCategValue])
      $('#showcaseCateg').val(theCateg[theCategValue])
      nextPrev(1)
    }
  }

}
// theName


let the_id
$("#rev_heads").on("change", function () {
  let val = $(this).val()
  setPrice(val)
})

let aa = [];
function setPrice(val) {
  let theRevenue = theRevs.filter(rr => rr.id === val)
  //   console.log(val, theRevenue)
  $("#amountTopay").val()
  the_id = theRevenue[0].id
  aa["message"] = theRevenue;
}

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function sumArray(numbers) {
  // console.log(numbers)
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

document.getElementById("category").addEventListener("change", function () {
  const selectedValue = this.value;

  if (selectedValue === "") {
    console.log("No category selected");
  } else if (selectedValue === "2") {
    // INDIVIDUAL
    $("#theName").html(`
      <div class="form-group w-full">
        <label for="">First name *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="Enter your first name">
      </div>

      <div class="form-group w-full">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="Enter your surname">
      </div>
  `)
  } else {
    $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Organization Name *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name" placeholder="" value="">
      </div>

      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" data-name="surname"
        placeholder="" value="">
      </div>
  `)
  }

});

let amountto = []
let prevYears = []
let prevYearsAmount = []

let prevYears2 = []
let prevYearsAmount2 = []

let revenueHeader = []

function goToPreviewPage() {
  amountto = []
  prevYears = []
  prevYearsAmount = []
  prevYears2 = []
  prevYearsAmount2 = []
  revenueHeader = []

  let payInputs = document.querySelectorAll(".payInputs")
  let genInv2Inputs = document.querySelectorAll(".genInv2")

  let thePayInputs = document.querySelectorAll(".thePaymentInput")
  let prevYearsAll = document.querySelectorAll(".prevYears")
  let prevYearsAllAmount = document.querySelectorAll(".prevAmounts")
  let prevYearsAll2 = document.querySelectorAll(".prevYears2")
  let prevYearsAllAmount2 = document.querySelectorAll(".prevAmounts2")
  let allTheRevenues = document.querySelectorAll(".revenueHeader")
  let revHeadsss = document.querySelectorAll(".revHeadsss")

  let previewAmount = 0
  let validItems = [] // Array to track valid (non-zero) items

  // Filter out items where all amounts are zero
  thePayInputs.forEach((payIn, i) => {
    let currentAmount = parseFloat(payIn.value.replace(/,/g, '')) || 0;
    let prevYear1Amount = parseFloat(prevYearsAllAmount[i].value.replace(/,/g, '')) || 0;
    let prevYear2Amount = parseFloat(prevYearsAllAmount2[i].value.replace(/,/g, '')) || 0;

    // Check if all amounts are zero
    if (currentAmount === 0 && prevYear1Amount === 0 && prevYear2Amount === 0) {
      return; // Skip this item
    }

    // Add to valid items arrays
    validItems.push(i);
    amountto.push(currentAmount);
    prevYears.push(prevYearsAll[i].value);
    prevYearsAmount.push(prevYear1Amount);
    prevYears2.push(prevYearsAll2[i].value);
    prevYearsAmount2.push(prevYear2Amount);
    revenueHeader.push(allTheRevenues[i].value);

    previewAmount += currentAmount + prevYear1Amount + prevYear2Amount;
  });

  // Check if there are any valid items
  if (validItems.length === 0) {
    alert("Please add at least one assessment item with a non-zero amount");
    return;
  }

  // Rest of your function remains the same but only for valid items
  let categOfTax = document.querySelector(".selCateg option:checked").textContent

  if (categOfTax === "Corporate" || categOfTax === "State Agency" || categOfTax === "Federal Agency") {
    $("#theName2").html(`
        <div class="form-group w-full">
          <label for="">Organization Name *</label>
          <input type="text" class="form-control payInputs2" readonly data-name="first_name"
          placeholder="" value="">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" readonly data-name="surname"
          placeholder="" value="">
        </div>
    `)
  }

  let theSpace = `
    <div class="flex space-x-4">
      <p>Category of Tax:</p>
      <p>${categOfTax}</p>
    </div>
  `

  // Only show valid items in preview
  validItems.forEach((itemIndex, displayIndex) => {
    theSpace += `
        <div class="flex space-x-3">
          <p>Item ${displayIndex + 1}:</p>
          <p>${revHeadsss[itemIndex].options[revHeadsss[itemIndex].selectedIndex].text}</p>
        </div>  
        <div class="flex space-x-3">
          <p>Amount:</p>
          <p>${formatMoney(parseFloat(thePayInputs[itemIndex].value.replace(/,/g, '')))}</p>
        </div>  
        <div class="flex space-x-3">
          <p>Outstanding Amount:</p>
          <p>${prevYearsAllAmount[itemIndex].value === "" ? formatMoney(0) : formatMoney(parseFloat(prevYearsAllAmount[itemIndex].value.replace(/,/g, '')))}</p>
        </div>  
      `
  })

  theSpace += `
    <div class="flex space-x-3">
      <p>Total Amount to be Paid:</p>
      <p>${formatMoney(previewAmount)}</p>
    </div>
  `
  $("#bill").html(theSpace)
  // console.log(aa)

  genInv2Inputs.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.payInputs2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    if (payinput.required && payinput.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === payInputs.length - 1) {
      let allInputs = document.querySelectorAll(".payInputs")

      allInputs.forEach((inputt, i) => {
        let theInputt = document.querySelector(`.payInputs2[data-name='${inputt.dataset.name}']`)
        if (theInputt) {
          theInputt.value = inputt.value
        }
      });
      nextPrev(1)

    }
  }

}

async function generateInvoiceNon() {

  let payInputs = document.querySelectorAll(".payInputs")

  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    if (payinput.required && payinput.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === payInputs.length - 1) {
      let inputClass = document.querySelector(".inputClass")

      if (inputClass) {
        let revHeadsss = document.querySelectorAll(".revHeadsss")
        let theArrr = []
        revHeadsss.forEach(reaa => {
          theArrr.push(reaa.value)
        })
        the_id = theArrr.join(",")
        // window.location.href = "./multipleinvoice.html?invnumber=7426359108&load=true"
      }

      let allInputs = document.querySelectorAll(".payInputs")
      let categ = document.querySelector("#category").value
      let tin = document.querySelector("#tin").value

      $("#msg_box").html(`
          <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        `)

      $("#generating_inv").addClass("hidden")



      let obj = {
        "endpoint": "createPayerAccount",
        "data": {
          "state": "Zamfara",
          "category": categ,
          "employment_status": "",
          "business_type": "",
          "numberofstaff": "",
          "img": "",
          "tin": tin,
          "lga": "",
          "address": "",
          "password": "12345",
          "verification_status": "grfdses"
        }
      }
      allInputs.forEach(allInput => {
        obj.data[allInput.dataset.name] = allInput.value
      })

      let StringedData = JSON.stringify(obj)
      //   console.log(StringedData)

      $.ajax({
        type: "POST",
        url: HOST,
        dataType: 'json',
        data: StringedData,
        success: function (data) {
          // console.log(data)
          if (data.status === 2) {

            let taxNumber = data.data.tax_number
            // console.log(taxNumber)
            generateInvoiceNum(taxNumber)

          } else {

            let taxNumber = data.data.tax_number
            // console.log(data)
            generateInvoiceNum(taxNumber)

          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
            `)
          $("#generating_inv").removeClass("hidden")
        }
      });
    }
  }


}

async function generateInvoiceNum(taxNumber) {
  let description = document.querySelector("#thedescripInput").value
  let business_own = document.querySelector("#business_own").value
  let the_sector = $("#sectorSelect").val()

  // Filter out zero-amount items before creating the payload
  let validRevenueHeaders = [];
  let validAmounts = [];
  let validPrevYears = [];
  let validPrevYearsAmount = [];
  let validPrevYears2 = [];
  let validPrevYearsAmount2 = [];

  for (let i = 0; i < amountto.length; i++) {
    if (amountto[i] !== 0 || prevYearsAmount[i] !== 0 || prevYearsAmount2[i] !== 0) {
      validRevenueHeaders.push(revenueHeader[i]);
      validAmounts.push(amountto[i]);
      validPrevYears.push(prevYears[i]);
      validPrevYearsAmount.push(prevYearsAmount[i]);
      validPrevYears2.push(prevYears2[i]);
      validPrevYearsAmount2.push(prevYearsAmount2[i]);
    }
  }

  const the_payload = {
    generateSingleInvoices: true,
    tax_number: taxNumber,
    revenue_head_id: validRevenueHeaders.join(','),
    price: validAmounts.join(','),
    description: description,
    lga: null,
    zonalOffice: null,
    business_type: business_own,
    previous_year: validPrevYears.join(','),
    previous_year_value: validPrevYearsAmount.join(','),
    previous_year2: validPrevYears2.join(','),
    previous_year_value2: validPrevYearsAmount2.join(','),
    sector: the_sector,
    file_no: "0001",
    invoice_type: "demand notice",
    created_by: "admin",
    by_account: userInfo2?.id
  };

  $.ajax({
    type: "GET",
    url: HOST,
    data: the_payload,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden")

        $("#msg_box").html(``)
        Swal.fire({
          title: 'Generated',
          text: "Demand notice has been generated successfully, Demand Notice details will be sent to your email and phone number! check your spam/junk folder if you can't mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Demand Notice',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            nextPrev(1)
            openInvoice(data.invoice_number, data.price)
            // window.location.href = `invoice.html?invnum=${data.invoice_number}`
          }
        })


      }
    },
    error: function (request, error) {
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>
      `)
      $("#generating_inv").removeClass("hidden")
      console.log(error);
    }
  });
}