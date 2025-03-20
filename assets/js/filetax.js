var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("formTabs");
  x[n].style.display = "block";

  // fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("formTabs");
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;


  showTab(currentTab);
}

$("#selectAccType").on("change", function () {
  let val = $(this).val()
  if (val === "2") {
    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Tax Filling And Returns Template upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" required type="file"  />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment"  required type="file" />
        </div>
      </div>
    `)

  } else {

    $("#indivCorporate").html(`
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12  w-full">
          <label class="">Tax Filling And Returns Template upload *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_assessment_upload" required type="file" />
        </div>
        <div class="form-group md:w-6/12 w-full">
          <label class="">Income tax form *</label>
          <input class="form-control mt-1 taxFInput2" data-name="tax_income_upload" required type="file" />
        </div>
      </div>
      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Evidence of tax payment *</label>
          <input class="form-control mt-1 taxFInput2" data-name="evidence_of_tax_payment" required type="file" />
        </div>
      </div>

      <div class="md:flex gap-3 mt-3">
        <div class="form-group md:w-6/12 w-full">
          <label class="">Form H1 *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_4" type="file" />
        </div>

        <div class="form-group md:w-6/12 w-full">
          <label class="">Schedule of Tax deductions *</label>
          <input class="form-control mt-1 taxFInput2" data-name="form_upload_5" type="file" />
        </div>
      </div>
  `)

  }
})

$("#generateReferenceNum").on("click", async function () {
  let allInputs = document.querySelectorAll(".taxFInput");
  let fileInputs = document.querySelectorAll('.taxFInput2[type="file"]');

  const publitio = new PublitioAPI(publitioKey1, publitioKey2);
  let user_id = "";
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"));

  if (userDATA) {
    user_id = userDATA.id;
  }

  let obj = {
    endpoint: "insertTaxFiling",
    data: {
      user_id: user_id,
      form_upload_5: "",
      form_upload_4: "",
      amount: "0"
    }
  };

  // Validate that all required files are selected
  for (let fileInput of fileInputs) {
    if (!fileInput.files.length) {
      alert("Upload all required files");
      return;
    }
  }

  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);
  $("#generateReferenceNum").addClass("hidden");
  $("#msg_box2").html(`<p class="text-warning text-center mt-4 text-lg">Uploading Files...</p>`);

  try {
    // Upload all files concurrently
    let uploadPromises = Array.from(fileInputs).map(fileInput => {
      let file = fileInput.files[0];
      return publitio.uploadFile(file, 'file', {
        title: `${file.name} - ${fileInput.dataset.name}`,
        public_id: `${file.name} - ${fileInput.dataset.name}`,
      }).then(data => {
        obj.data[fileInput.dataset.name] = data.url_preview;
      });
    });

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);

    $("#msg_box2").html(`<p class="text-success text-center mt-4 text-lg">Files Uploaded, Generating RRR...</p>`);

    // Collect all other form inputs
    allInputs.forEach(input => {
      obj.data[input.dataset.name] = input.value;
    });

    console.log("Final requestData:", obj);

    $.ajax({
      type: "POST",
      url: HOST,
      dataType: "json",
      data: JSON.stringify(obj),
      success: function (response) {
        $("#msg_box").html("");
        $("#generateReferenceNum").removeClass("hidden");
        $("#msg_box2").html(`<p class="text-success text-center mt-4 text-lg">Generated: ${response[1].tax_filling_refrence}</p>`);
        $("#referenceNum").html(response[1].tax_filling_refrence);
        $("#refNumberModal").modal("show");
    
        // Close modal and redirect after 100 seconds
        // setTimeout(function () {
        //     $("#refNumberModal").modal("hide");
        //     window.location.href = "/";
        // }, 1000); // 100 seconds
    },
      error: function () {
        $("#msg_box").html(`<p class="text-danger text-center mt-4 text-lg">Something went wrong!</p>`);
        $("#generateReferenceNum").removeClass("hidden");
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    $("#msg_box2").html(`<p class="text-danger text-center mt-4 text-lg">Error Uploading files, try again</p>`);
    $("#generateReferenceNum").removeClass("hidden");
  }
});
