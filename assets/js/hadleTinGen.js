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
          <a href="generatetin.html" type="button" class="button  text-sm">Generate TIN</a>
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
          <button type="button" class="button" onclick="retrieveTin()">Retrieve Tin</button>
        </div>

      </div>
    </div>
  </div>
`)