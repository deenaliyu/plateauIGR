var currentTab = 0;
showTab(currentTab);

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

let plateauLGAs = {
  "Barkin Ladi": '01',
  "Bassa": "02",
  "Bokkos": "03",
  "Jos East": "04",
  "Jos North": "05",
  "Jos South": "06",
  "Kanam": "07",
  "Kanke": "08",
  "Langtang North": "09",
  "Langtang South": "10",
  "Mangu": "11",
  "Mikang": "12",
  "Pankshin": "13",
  "Qua an Pan": "14",
  "Riyom": "15",
  "Shendam": "16",
  "Wase": "17"
}
function employmentStatus(e) {
  let theval = e.value

  if (theval === "Unemployed") {
    $('#employmentTerms').html('')

  } else {
    $('#employmentTerms').html(`
      <p>Employment Information</p>
      <hr />
      <div class="form-group w-full mb-4 mt-2">
        <label for="">Name of Organization/Business*</label>
        <input type="text" class="form-control payInputs" data-name="organization_name">
      </div>

      <div class="flex items-center mb-4 gap-2">
        <div class="form-group w-full">
          <label for="">Industry*</label>
          <select name="" class="form-select payInputs" data-name="industry">
            <option value="">Select</option>
            <option value="Mining">Mining</option>
            <option value="Commerce">Commerce</option>
            <option value="Banking">Banking</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Engineering">Engineering</option>
            <option value="Construction">Construction</option>
            <option value="Government Institution">Government Institution</option>
            <option value="NGO">NGO</option>
            <option value="Religious Institutions">Religious Institutions</option>
            <option value="General Merchandise">General Merchandise</option>
            <option value="General Contractor">General Contractor</option>
            <option value="Private Schools"> Private Schools</option>
            <option value="Public Schools">Public Schools</option>
            <option value="Hospitals">Hospitals</option>
          </select>
        </div>

        <div class="form-group w-full">
          <label for="">Sector*</label>
          <input type="text" class="form-control payInputs" data-name="sector">
        </div>

      </div>  
    `)
  }
}

function previewPage() {
  let payInputs = document.querySelectorAll(".payInputs")

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


async function generateTin(accountType) {
  try {
    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#generateTinBtn").addClass("hidden")
    let allInputs = document.querySelectorAll(".payInputs")
    let lgaInput = document.querySelector("#selectLGA")

    let dataToSend = {
      type: accountType
    }

    allInputs.forEach(allInput => {
      dataToSend[allInput.dataset.name] = allInput.value
    })

    dataToSend.lga = plateauLGAs[lgaInput.value] ? plateauLGAs[lgaInput.value] : "18"

    console.log(dataToSend)
    const response = await fetch('https://plateauigr.com/php/tinGeneration/index.php', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    const resdata = await response.json()

    console.log(resdata)
    if (resdata.success) {
      $("#msg_box").html(`<p class="text-success text-center mt-4 text-lg">TIN Generated successfully.</p>`)
      $("#generateTinBtn").removeClass("hidden")

      $("#tinNumber").html(resdata.tin)
      nextPrev(1)
    } else {
      $("#msg_box").html(`<p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again.</p>`)
      $("#generateTinBtn").removeClass("hidden")
    }


  } catch (error) {
    console.log(error)
    $("#msg_box").html(`<p class="text-danger text-center mt-4 text-lg">${error.error ? error.error : 'something went wrong, Try Again.'}.</p>`)
    $("#generateTinBtn").removeClass("hidden")
  }
}