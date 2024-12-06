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
const urlParams = new URLSearchParams(window.location.search);
let myParam = urlParams.get('category');

let regType = urlParams.get('user');
let callbackParam = urlParams.get('callback')

if (regType) {
  $("#theHeader").remove()
  document.querySelector('#tinDisplayForm').style = 'margin-top: 10% !important'

  $("#goHomeBtn").attr('href', `./admin/tinmanagement.html`)
}

function employmentStatus(e) {
  let theval = e.value

  if (theval === "Unemployed") {
    $('#employmentTerms').addClass('hidden')

  } else {
    $('#employmentTerms').removeClass('hidden')
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

async function getIndustriesSectors() {
  try {
    const response = await fetch(`${HOST}?getIndustriesSectors`);
    const resdata = await response.json();

    if (resdata.status === 1) {
      const data = resdata.message;

      const sectors = [...new Set(data.map(item => item.SectorName))];

      const sectorSelect = document.getElementById('sectorSelect');
      sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector;
        option.textContent = sector;
        sectorSelect.appendChild(option);
      });

      sectorSelect.addEventListener('change', () => {
        const selectedSector = sectorSelect.value;

        const filteredIndustries = data.filter(
          item => item.SectorName === selectedSector
        );

        const industrySelect = document.getElementById('industrySelect');
        industrySelect.innerHTML = '<option value="">Select</option>';

        filteredIndustries.forEach(industry => {
          const option = document.createElement('option');
          option.value = industry.IndustryName;
          option.textContent = industry.IndustryName;
          industrySelect.appendChild(option);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getIndustriesSectors();


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
      type: accountType,
      created_by: regType ? regType : null
    }

    allInputs.forEach(allInput => {
      dataToSend[allInput.dataset.name] = allInput.value
    })

    // dataToSend.lga = plateauLGAs[lgaInput.value] ? plateauLGAs[lgaInput.value] : "18"

    // console.log(dataToSend)
    const response = await fetch('https://plateauigr.com/php/tinGeneration/index.php', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    const resdata = await response.json()

    // console.log(resdata)
    if (resdata.success) {
      $("#msg_box").html(`<p class="text-success text-center mt-4 text-lg">TIN Generated successfully.</p>`)
      $("#generateTinBtn").removeClass("hidden")

      $("#tinNumber").html(resdata.tin)

      if (callbackParam) {
        $("#goHomeBtnCont").html(`
          <a href="${callbackParam}" class="button" id="goHomeBtn">Continue</a> 
        `)
      }

      nextPrev(1)
    } else {
      $("#msg_box").html(`<p class="text-warning text-center mt-4 text-lg">${resdata.error}.</p>`)
      $("#generateTinBtn").removeClass("hidden")
    }


  } catch (error) {
    console.log(error.error)
    $("#msg_box").html(`<p class="text-danger text-center mt-4 text-lg">${error.error ? error.error : 'something went wrong, Try Again.'}.</p>`)
    $("#generateTinBtn").removeClass("hidden")
  }
}