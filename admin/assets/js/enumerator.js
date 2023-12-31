function continueReg() {
  let allInputs = document.querySelectorAll(".userInputs")

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

      // nextPrev(1)
    }
  }
}

let password = generateRandomString()

function previewPage() {
  let allInputs = document.querySelectorAll(".userInputs")

  allInputs.forEach((inputt, i) => {

    let theInputt = document.querySelector(`.enumInput2[data-name='${inputt.dataset.name}']`)
    if (theInputt) {
      theInputt.value = inputt.value
    }

    if (i === allInputs.length - 1) {
      $("#password").val(password)
      nextPrev(1)
    }
  });
}

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)

  let EnumData = {
    "endpoint": "createEnumUser",
    "data": {
      // "password": generateRandomString()
    }
  }

  let allInputs = document.querySelectorAll(".userInputs")
  allInputs.forEach((inputt, i) => {
    EnumData.data[inputt.dataset.name] = inputt.value
  })

  console.log(EnumData)

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
        $("#theButton").addClass("hidden")
        // nextPrev(1)
        Swal.fire({
          icon: 'success',
          title: 'Complete',
          text: 'New user account has been created successfully',
          confirmButtonColor: '#CDA545',
          confirmButtonText: 'Close',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = ""
            window.location.reload()
          }
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

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < 8; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}
