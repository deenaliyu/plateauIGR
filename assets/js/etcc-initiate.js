let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))
let currentPageURL = window.location.href;

let theFetchedDetails = null

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
        theFetchedDetails = data.user
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
          // if (data.user.state === null) {
          //   selectOptionByText('selectState', "Plateau");
          // }

        } else if (data.user.old_user && data.user.category === "Corporate") {
          document.querySelector(".payInputs[data-name='first_name']").value = data.user.company_name
          document.querySelector(".payInputs[data-name='email']").value = data.user.office_email
          document.querySelector(".payInputs[data-name='phone']").value = data.user.office_number

          // if (data.user.state === null) {
          //   selectOptionByText('selectState', "Plateau");
          // }
        }
        nextPrev(1)

      } else {
        theFetchedDetails = null
        $("#theFetchBtns").removeClass("hidden");
        $("#msg_box001").html(``);
        Swal.fire({
          title: 'Not Found',
          text: "User detail not found in the database! please Register before proceeding!",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Reister',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "../regcategory.html"
          }
        });
      }
    },
    error: function (request, error) {
      theFetchedDetails = null
      $("#msg_box001").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try Again or Fill Details Manually.</p>
        `);
      $("#theFetchBtns").removeClass("hidden");
      console.log(error);
    }
  });
}

function continuePage() {
  let genInv = document.querySelectorAll(".payInputs")

  let tin = document.querySelector("#tin")

  if (tin.value === "") {
    $("#popUpModal").modal("show")
    return;
  }


  for (let i = 0; i < genInv.length; i++) {
    const genn = genInv[i];

    if (genn.required && genn.value === "") {
      alert("Please fill all required field");
      break;
    }

    if (i === genInv.length - 1) {
      nextPrev(1)
    }
  }
}

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
      registerUser()
    }

  }
}

// function continueReg3() {
//   let allInputs = document.querySelectorAll(".enumInputC")
//   // check for empty fileds

//   for (let i = 0; i < allInputs.length; i++) {
//     const inpt = allInputs[i];

//     if (inpt.required && inpt.value === "") {
//       alert("Please fill all required fields")
//       inpt.scrollIntoView()
//       break;
//     }

//     if (i === allInputs.length - 1) {
//       registerUser()
//     }

//   }
// }

function registerUser() {
  $("#theButton").addClass("hidden")
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)

  let fname = theFetchedDetails.first_name
  let sname = theFetchedDetails.surname

  let thefullname = `${fname} ${sname}`

  let EnumData = {
    "endpoint": "createETCC",
    "data": {
      "payer_id": theFetchedDetails.tax_number,
      "declaration": "I declare...",
      "applicant_tin": $("#tin").val(),
      "org_tin": $("#tin").val(),
      "fullname": thefullname,
      "organisation": thefullname,
      "recommendation": "recommendation",
      "address": theFetchedDetails.address,
      "app_status": "3"
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



  async function doUpload() {
    let uploadInputs = document.querySelectorAll(".uploadInputs")

    const publitio = new PublitioAPI(publitioKey1, publitioKey2)

    for (let ii = 0; ii < uploadInputs.length; ii++) {
      const upInput = uploadInputs[ii];
      // console.log(upInput)
      if (upInput.value === "") {
        EnumData.data[upInput.dataset.name] = ""

        if (upInput.required) {
          alert('Please Upload the required files')
          $("#msg_box").html(``)
          $("#theButton").removeClass("hidden")
          return
        }

      } else {

        $("#msg_box").html(`
          <div class="flex justify-center items-center mb-4 gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p>Uploading files....</p>
          </div>
        `)

        let fileUrl = upInput.files[0]

        const reader = new FileReader()
        reader.readAsBinaryString(fileUrl);

        publitio.uploadFile(fileUrl, 'file', {
          title: `${fileUrl.name} - ${upInput.dataset.name}`,
          public_id: `${fileUrl.name} - ${upInput.dataset.name}`,

        }).then((data) => {
          EnumData.data[upInput.dataset.name] = data.url_preview

        }).catch((error) => {
          console.log(error)
          $("#msg_box").html(`<p class="text-center text-danger">Error uploading your files...please try again !</p>`)
          $("#theButton").removeClass("hidden")
        })

      }

      // console.log(ii, uploadInputs.length - 1)

    }
  }


  doUpload().then(e => {
    setTimeout(() => {
      sendToDB()
      // console.log(EnumData)
    }, 3000);

  })


  // console.log(JSON.stringify(EnumData))

  async function sendToDB() {
    $("#msg_box").html(`
      <div class="flex justify-center items-center mb-4 gap-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
  ` )
    // console.log(JSON.stringify(EnumData))
    // console.log(EnumData)
    try {
      const response = await fetch(HOST, {
        method: "POST",
        body: JSON.stringify(EnumData),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()

      let theRefNumber = data.ref
      $("#refNumber").html(data.ref)

      if (data.status === 1) {

        $("#msg_box").html(`
          <div class="flex justify-center items-center mb-4 gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p>Generating Invoice....</p>
          </div>

         
        `)

        try {
          const response = await fetch(
            `${HOST}?generateSingleInvoices&tax_number=${theFetchedDetails.tax_number}&revenue_head_id=1357,1358&price=1000,500`
          );

          const theddata = await response.json()

          $("#theButton").removeClass("hidden")

          if (theddata.status === 1) {
            $("#msg_box").html(``)
            Swal.fire({
              title: 'Success!',
              html: `
                  <br/>
                  <p>Your invoice has been generated successfully.</p>
                  <br/>
                  <p><strong>ETCC Reference Number:</strong> ${theRefNumber}</p>
                  <p><strong>Invoice Number:</strong> ${theddata.invoice_number}</p>
              `,
              icon: 'success',
              confirmButtonText: 'Open Invoice',
              confirmButtonColor: "#CDA545",
              showCancelButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              focusConfirm: true
            }).then((result) => {
              if (result.isConfirmed) {
                nextPrev(1)
                openInvoice(theddata.invoice_number)
                sessionStorage.setItem("invoice_number", theddata.invoice_number)
              }
            });

          } else {
            $("#msg_box").html(`
             <p class="text-danger text-center">something went wrong while generating invoice.</p>
            `)
            $("#theButton").removeClass("hidden")
          }

        } catch (error) {
          $("#msg_box").html(`
             <p class="text-danger text-center">something went wrong while generating invoice.</p>             
            `)
          $("#theButton").removeClass("hidden")
        }

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

}
