const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('type');

function continueReg() {
  let allInputs = document.querySelectorAll(".enumInput")
  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      nextPrev(1)
    }

  }

}

function continueReg2() {
  let allInputs = document.querySelectorAll(".enumInputB")

  // check for empty fileds

  for (let i = 0; i < allInputs.length; i++) {
    const inpt = allInputs[i];

    if (inpt.required && inpt.value === "") {
      alert("Please fill all required fields")
      inpt.scrollIntoView()
      break;
    }

    if (i === allInputs.length - 1) {
      previewPage()
    }
  }
}

function previewPage() {
  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")

  allInputs.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  allInputsB.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }
  });

  nextPrev(1)
}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let EnumData = {
    "endpoint": "createSpecialUser",
    "data": {
      "category": category === "private" ? 1 : 2
    }
  }

  let allInputs = document.querySelectorAll(".enumInput")
  let allInputsB = document.querySelectorAll(".enumInputB")

  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  allInputsB.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })


  console.log(EnumData)
  // console.log(JSON.stringify(EnumData))

  async function sendToDB() {
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      if (data.status === 1) {

        Swal.fire({
          title: 'Success',
          text: "Registered successfully!",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#CDA545',
          // cancelButtonColor: '#3085d6',
          confirmButtonText: 'Go to PAYE manager'

        }).then((result) => {
          window.location.href = `./paye-management.html?type=${category}`
        })

      } else {
        $("#theButton").removeClass("hidden")
        $("#msg_box").html(`
          <p class="text-warning text-center text-lg">${data.message}</p>
        `)
      }


    } catch (error) {
      console.log(error)
      $("#theButton").removeClass("hidden")
      $("#msg_box").html(`
        <p class="text-danger text-center text-lg">Something went wrong ! try again.</p>
      `)
    }
  }

  sendToDB()

}