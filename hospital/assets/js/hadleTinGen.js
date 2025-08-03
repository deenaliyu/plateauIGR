
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
    $("#msg_box2").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

    $("#generateTinBtn").addClass("hidden")
    let allInputs = document.querySelectorAll(".payInputs")
    let lgaInput = document.querySelector("#selectLGA")

    let dataToSend = {
      type: accountType,
      created_by: 'enumerator',
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
      $("#msg_box2").html(`<p class="text-success text-center mt-4 text-lg">TIN Generated successfully.</p>`)
      $("#generateTinBtn").removeClass("hidden")

      $("#tinNumber").html(resdata.tin)
      $("#goHomeBtnCont").html(`
        <button class="button" type="button" onclick="proceedToEnum()">Proceed</button> 
      `)

      document.getElementById('legalName').value = document.querySelector('.payInputs[data-name="organization_name"]')?.value;
      document.getElementById('legalName').readOnly = true;
      document.getElementById('taxIdentificationNumber').value = resdata.tin;
      document.getElementById('taxIdentificationNumber').readOnly = true;
      document.getElementById('address').value = document.querySelector('.payInputs[data-name="address"]')?.value;
      document.getElementById('address').readOnly = true;
      document.getElementById('city').value = document.querySelector('.payInputs[data-name="lga"]')?.value; // Assuming city is same as LGA
      document.getElementById('city').readOnly = true;
      document.getElementById('lga').value = document.querySelector('.payInputs[data-name="lga"]')?.value;
      document.getElementById('lga').readOnly = true;
      document.getElementById('state').value = document.querySelector('.payInputs[data-name="state"]')?.value;
      document.getElementById('state').readOnly = true;
      document.getElementById('phoneNumber').value = document.querySelector('.payInputs[data-name="phone_number"]')?.value;
      document.getElementById('phoneNumber').readOnly = true;
      document.getElementById('email').value = document.querySelector('.payInputs[data-name="email"]')?.value;
      document.getElementById('email').readOnly = true;

      // Select the appropriate category card
      const categoryCards = document.querySelectorAll(".cardi");
      const userCategory = 'corporate'; // Convert to lowercase to match data-name

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

      nextPrev(1)
    } else {
      $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">${resdata.error}.</p>`)
      $("#generateTinBtn").removeClass("hidden")
    }


  } catch (error) {
    console.log(error)
    $("#msg_box2").html(`<p class="text-danger text-center mt-4 text-lg">${error.error ? error.error : 'something went wrong, Try Again.'}.</p>`)
    $("#generateTinBtn").removeClass("hidden")
  }
}

function proceedToEnum() {
  $("#tingenerateModal").modal('hide')
  currentSection = 2
  showSection(currentSection)
}