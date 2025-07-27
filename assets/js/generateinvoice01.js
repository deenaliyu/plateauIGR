let theRevs = {}
let theCateg = ["", "Corporate", "Individual", "State Agency", "Federal Agency"]
let AllRevs;
let theMda = {}

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

    });

  }
}

getAllMda()

function updateSelectedOption1(selCateg) {
  // Get the select element
  var select1 = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select1.options[select1.selectedIndex];

  if (selCateg.value === '') {
    $("#otherSec").removeClass("flex")
    $("#otherSec").addClass("hidden")
  } else {
    $("#otherSec").removeClass("hidden")
    $("#otherSec").addClass("flex")
  }
  // document.getElementById("select-search").value = selectedOption.text;
}

function updateSelectedOption() {
  // Get the select element
  var select = document.getElementById("rev_heads");

  // Update the selected option text
  var selectedOption = select.options[select.selectedIndex];
  // document.getElementById("select-search").value = selectedOption.text;
}


async function getAllRevH(theVal) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${theVal}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    AllRevs = revHeads.message
    //  console.log(revHeads.message)
  }
}



// console.log(AllRevs)
function addInput() {

  let theStrng = generateRandomString()

  $("#moreInput").append(`
    <div class="flex items-center gap-3">
      <div class="form-group w-8/12">
        <label for="">What do you want to pay for?*</label>
        <select onchange="updateSelectedOption()" class="${theStrng} h-[40px] inputClass form-select genInv revHeadsss" required id="rev_heads">
        </select>
      </div>

      <div class="form-group w-4/12">
        <label for="">Amount*</label>
        <input type="text" class="form-control genInv thePaymentInput h-[40px] amountTopay" id="amountTopay">
      </div>

      <iconify-icon icon="zondicons:minus-outline" class="cursor-pointer" id="${theStrng}" onclick="removeInpt(this)"></iconify-icon>
    </div>
 
  `)


  const amountInput = document.querySelectorAll('.amountTopay');
  amountInput.forEach(element => {
   element.addEventListener('input', function(e) {
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
      <option value="${dd.id}">${dd.COL_4}</option>
    `)
  })
  $(`.${theStrng}`).select2()

}

function removeInpt(theIpt) {
  document.getElementById(theIpt.id).parentElement.remove()
}

$(".mda").on("change", function () {
  let theVal = $(this).val()
  // console.log(theVal)
  fetchRevHeads(theVal)
  getAllRevH(theVal)

})




async function fetchRevHeads(theVal) {
  const response = await fetch(`${HOST}/?getMDAsRevenueHeads&mdName=${theVal}`)
  const revHeads = await response.json()

  if (revHeads.status === 0) {
  } else {
    theRevs = revHeads.message
    // console.log(theRevs)
    $("#rev_heads").html(`
      <option disabled selected>Select--</option>
    `)
    revHeads.message.forEach((revHd, i) => {
      $("#rev_heads").append(`
        <option value="${revHd["id"]}">${revHd["COL_4"]}</option>
      `)

    });

  }
}

let userInfo = JSON.parse(localStorage.getItem("userDataPrime"));
// console.log(userInfo)
function continuePage() {
  let genInv = document.querySelectorAll(".firstDiv .genInv")

  let theVal = document.querySelector(".selCateg").value
  if (userInfo === null) {
    if (theVal === "2") {
      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">First name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
            placeholder="" value="">
        </div>
  
        <div class="form-group w-full">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="" value="">
        </div>
      `)
    } else if (theVal === "1") {
      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">Company Name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="" value="">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
          placeholder="" value="">
        </div>
      `)
    } else if (theVal === "3" || theVal === "4") {
      $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Name of Agency *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
        placeholder="" value="">
      </div>
  
      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
        placeholder="" value="">
      </div>
    `)
    } else {

    }

    $("#theEmail").html(`
    <div class="form-group w-full">
    <label for="">Email *</label>
    <input type="text" class="form-control payInputs" required data-name="email"
    placeholder="Enter your Email Address" value="">
    </div>
  
  <div class="form-group w-full">
    <label for="">Phone number *</label>
    <input type="number" class="form-control payInputs" id="phonenumber" minlength="11" maxlength="11" required
      data-name="phone" placeholder="Your 11-digits phone number" value="">
  </div>
    `)

    // $("#theTin").html(`
    // <label for="">JTB TIN (Optional)</label>
    // <input type="text" class="form-control payInputs" id="tin" data-name="tin" placeholder="Enter your TIN" value="">
    // `)

    // $("#theLga").html(`
    // <label for="">Address</label>
    // <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
    // placeholder=" Enter your address" value="">
    // `)

    //edited

    $("#theEmail").html(`
      <div class="form-group w-full">
      <label for="">Email *</label>
      <input type="text" class="form-control payInputs" required data-name="email"
      placeholder="Enter your Email Address" value="">
      </div>
          `)

      $("#theEmal").html(`
      <div class="form-group w-full">
        <label for="">Phone number *</label>
        <input type="number" class="form-control payInputs" id="phonenumber" minlength="11" maxlength="11" required
          data-name="phone" placeholder="Your 11-digits phone number" value="">
      </div>

        `)
    
  
  
      // $("#theTin").html(`
      // <label for="">JTB TIN (Optional)</label>
      // <input type="text" class="form-control payInputs" id="tin" data-name="tin" placeholder="Enter your TIN" value="">
      // `)
  
      // $("#theLga").html(`
      // <label for="">Address</label>
      // <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
      // placeholder=" Enter your address" value="">
      // `)

      //eidted

    
        $("#theLga").html(`
        <label for="">Address</label>
        <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
        placeholder=" Enter your address" value="">
        `)
  
  
  } else {
    if (theVal === "2") {

      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">First name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
            placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
        </div>
  
        <div class="form-group w-full">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" required data-name="surname"
          placeholder="${userInfo.surname}" value="${userInfo.surname}">
        </div>
      `)
    } else if (theVal === "1") {
      $("#theName").html(`
        <div class="form-group w-full">
          <label for="">Company Name *</label>
          <input type="text" class="form-control payInputs" required data-name="first_name"
          placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
        </div>
  
        <div class="form-group w-full hidden">
          <label for="">Surname *</label>
          <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
          placeholder="${userInfo.surname}" value="${userInfo.surname}">
        </div>
      `)
    } else if (theVal === "3" || theVal === "4") {
      $("#theName").html(`
      <div class="form-group w-full">
        <label for="">Name of Agency *</label>
        <input type="text" class="form-control payInputs" required data-name="first_name"
        placeholder="${userInfo.first_name}" value="${userInfo.first_name}">
      </div>
  
      <div class="form-group w-full hidden">
        <label for="">Surname *</label>
        <input type="text" class="form-control payInputs" value="&nbsp;" required data-name="surname"
        placeholder="${userInfo.surname}" value="${userInfo.surname}">
      </div>
    `)
    } else {

    }

    $("#theEmail").html(`
    <div class="form-group w-full">
    <label for="">Email *</label>
    <input type="text" class="form-control payInputs" required data-name="email"
    placeholder="Enter your Email Address" value="${userInfo.email}">
  </div>
      `)

    $("#theEmal").html(`    
    <div class="form-group w-full">
      <label for="">Phone number *</label>
      <input type="number" class="form-control payInputs" id="phonenumber" minlength="11" maxlength="11" required
        data-name="phone" placeholder="Your 11-digits phone number" value="${userInfo.phone}">
    </div>

      `)
  

  //     $("#theTin").html(`
  //       `)

  //  $("#theLga").html(`
  //   `)

    


    // $("#theTin").html(`
    // <label for="">JTB TIN (Optional)</label>
    // <input type="text" class="form-control payInputs" id="tin" data-name="tin" placeholder="Enter your TIN" value="${userInfo.tin}">
    // `)

    $("#theLga").html(`
    <label for="">Address</label>
    <input type="text" class="form-control payInputs" minlength="10" required data-name="address"
    placeholder=" Enter your address" value="${userInfo.address}">
    `)


  }


  for (let i = 0; i < genInv.length; i++) {
    const genn = genInv[i];

    // if (genn.value === "") {
    //   alert("Please fill all required field");
    //   break;
    // }

    if (i === genInv.length - 1) {
      nextPrev(1)
    }
  }



}
// theName


let the_id
$(".revHeadsss").on("change", function () {
  let val = $(this).val()
  console.log(val)
  setPrice(val)
})

let aa = [];
function setPrice(val) {
  let theRevenue = theRevs.filter(rr => rr.id === val)
  console.log(val, theRevenue)
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

function goToPreviewPage() {
  let payInputs = document.querySelectorAll(".payInputs")
  let amountto = []

  let thePayInputs = document.querySelectorAll(".thePaymentInput")
  let revHeadsss = document.querySelectorAll(".revHeadsss")
  let mdaSelected = document.querySelector("#mda").value

  thePayInputs.forEach(payIn => {

   let mm =  payIn.value.replace(/,/g, '');
    amountto.push(parseFloat(mm))
  })
  let categOfTax = document.querySelector(".selCateg option:checked").textContent
 
    if(categOfTax === "Corporate") {
        $("#theName2").html(`
            <div class="form-group w-full">
              <label for="">Company Name *</label>
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
  if (revHeadsss.length === 1) {
    theSpace += `
      <div class="flex space-x-3">
        <p>Name of Tax:</p>
        <p>${mdaSelected}</p>
      </div>  
    `
  } else {
    revHeadsss.forEach((revHd, i) => {
      theSpace += `
        <div class="flex space-x-3">
          <p>Item ${i + 1}:</p>
          <p>${revHd.options[revHd.selectedIndex].text}</p>
        </div>  
        <div class="flex space-x-3">
          <p>Amount:</p>
          <p>${formatMoney(parseFloat(thePayInputs[i].value.replace(/,/g, '')))}</p>
        </div>  
      `
    })
  }



  // revHeadInputSel

  theSpace += `
    <div class="flex space-x-3">
      <p>Total Amount to be Paid:</p>
      <p>${formatMoney(sumArray(amountto))}</p>
    </div>
  `
  $("#bill").html(theSpace)
  // console.log(aa)
  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    if (payinput.required && payinput.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === payInputs.length - 1) {
      let allInputs = document.querySelectorAll(".payInputs")
      
      let phonenumber = document.querySelector("#phonenumber")
      
      if(phonenumber.value.length < 11) {
          alert("Phone number should be equal to 11")
      } else {
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

}
async function generateInvoiceNon() {

  let payInputs = document.querySelectorAll(".payInputs")

  for (let i = 0; i < payInputs.length; i++) {
    const payinput = payInputs[i];

    // if (payinput.required && payinput.value === "") {
    //   alert("Please fill all required field");
    //   break;
    // }

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
          "state": "Plateau",
          "category": categ,
          "employment_status": "",
          "business_type": "",
          "numberofstaff": "",
          "id_type": "1",
          "id_number": "",
          "img": "assets/img/userprofile.png",
          "tin": tin,
          "lga": "",
          "address": "",
          "password": "12345",
          "verification_status": "grfdses",
          "business_own": "2",
          "bvn": "",
          "nin": "",
          "annual_revenue": "",
          "value_business": "",
          "rep_firstname": "",
          "rep_surname": "",
          "rep_email": "",
          "rep_phone": "",
          "rep_position": "",
          "rep_state": "",
          "rep_state": "",
          "rep_lga": "",
          "rep_address": "",
        }
      }
      allInputs.forEach(allInput => {
        obj.data[allInput.dataset.name] = allInput.value
      })

      let StringedData = JSON.stringify(obj)
      // console.log(StringedData)

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
  let amountto = []

  let thePayInputs = document.querySelectorAll(".thePaymentInput")
  let description = document.querySelector("#thedescripInput").value

  thePayInputs.forEach(payIn => {
    amountto.push(parseFloat(payIn.value.replace(/,/g, '')))
  })

  $.ajax({
    type: "GET",
    url: `${HOST}?generateSingleInvoices&tax_number=${taxNumber}&revenue_head_id=${the_id}&price=${amountto.join(',')}&description=${description}`,
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 2) {


      } else if (data.status === 1) {
        $("#generating_inv").removeClass("hidden")

        $("#msg_box").html(``)
        Swal.fire({
          title: 'Generated',
          text: "Invoice has been generated successfully, Invoice details will be sent to your email and phone number! check your spam/junk folder if you can't find the mail.",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Open Invoice',
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