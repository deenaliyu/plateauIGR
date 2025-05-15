const pathtin = window.location.pathname;
const fileNametin = pathtin.substring(pathtin.lastIndexOf('/') + 1);

$('#ModalsContainer').html(`
  <div class="modal fade" id="popUpModal" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header ">
          <h5 class="modal-title text-center text-lg font-bold" id="exampleModalLabel3">⚠️ TIN Required to Continue</h5>
          <button type="button" class="btn-close flex justify-content-center" data-bs-dismiss="modal"
            aria-label="Close"><iconify-icon icon="ph:x-thin"></iconify-icon></button>
        </div>

        <div class="modal-body">
          <p>To Generate an Invoice, please provide your Tax Identification Number (TIN) or choose one of the options
            below.</p>

          <div class="tin-input my-5">
            <label for="theTinEntered">Enter Your TIN</label>
            <input type="text" class="form-control" id="theTinEntered" placeholder="Enter your TIN" />

            <button type="button" class="button mt-3 text-sm" onclick="submitTin()">Submit TIN</button>
          </div>

        </div>

        <div class="modal-footer">
          
          <button type="button" data-bs-toggle="modal" data-bs-target="#forgotTinModal" data-bs-dismiss="modal" class="outline-btn text-sm">Forgot
            TIN?</button>
          <a href="generatetin.html?callback=${fileNametin}" type="button" class="button  text-sm">Generate TIN</a>
        </div>

      </div>
    </div>
  </div>

  <div class="modal fade" id="forgotTinModal" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header ">
          <h5 class="modal-title text-center text-lg font-bold" id="exampleModalLabel3">Forgot/Retrieve TIN</h5>
          <button type="button" class="btn-close flex justify-content-center" data-bs-dismiss="modal"
            aria-label="Close"><iconify-icon icon="ph:x-thin"></iconify-icon></button>
        </div>

        <div class="modal-body">
          <p>Enter your email below to retrieve your Tax Identification Number (TIN).</p>

          <div class="tin-input my-5">
            <label for="theTinEntered">Enter Your Email</label>
            <input type="text" class="form-control" id="theEmailEntered" placeholder="Enter your Email" />
          </div>

        </div>

        <div class="modal-footer">
          <button type="button" class="button" id="retrieveTinBtn" onclick="retrieveTin()">Retrieve Tin</button>
          
        </div>
        <div id="msg_boxerstin" class='mb-2'></div>

      </div>
    </div>
  </div>
`)

function submitTin() {
  let theTinEntered = document.querySelector('#theTinEntered').value.trim()

  if (theTinEntered === "") {
    alert('Please Enter your TIN')
  } else {
    $("#tin").val(theTinEntered)

    $('#popUpModal').modal('hide')

  }
}

async function retrieveTin() {
  try {
    let theEmailEntered = document.querySelector("#theEmailEntered").value.trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(theEmailEntered)) {
      $("#msg_boxerstin").html(`
        <p class="text-warning text-center text-lg">Please enter a valid email address.</p>
      `);
      return;
    }

    $("#msg_boxerstin").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $("#retrieveTinBtn").addClass("hidden")

    const response = await fetch(`https://plateauigr.com/php/tinGeneration/customerValidation.php?email_or_phone=${theEmailEntered}`)
    const resdata = await response.json()

    // console.log(resdata)
    $("#retrieveTinBtn").removeClass("hidden")

    if (resdata.success) {
      $("#msg_boxerstin").html(`
        <p class="text-success text-center text-lg">TIN Retrived successfully.</p>  
        <p class="text-[#CDA545] text-center text-xl">${resdata.tin}</p>  
      `)

    } else {
      $("#msg_boxerstin").html(`
        <p class="text-warning text-center text-lg">${resdata.message}.</p>

        <div class='flex justify-center mt-2'>
          <a href="generatetin.html?callback=${fileNametin}" type="button" class="button text-sm">Generate TIN</a>
        </div>

      `)
    }


  } catch (error) {
    console.log(error)
    $("#msg_boxerstin").html(`<p class="text-danger text-center mt-4 text-lg">${error.error ? error.error : 'something went wrong, Try Again.'}.</p>`)
    $("#retrieveTinBtn").removeClass("hidden")
  }
}