$("#checkStatus").on("click", function () {

    $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
    $("#checkStatus").addClass("hidden")
  
    let therefNumber = document.querySelector("#refNumber").value
  
    if (therefNumber === "") {
      alert("Field can't be empty.")
      $("#msg_box").html(``)
      $("#checkStatus").removeClass("hidden")
      return
    }
  
    async function getStatus() {
      try {
        const response = await fetch(`${HOST}?getETCC&type=cert_no&id=${therefNumber}`)
        const statusData = await response.json()
  
        console.log(statusData)
        if (statusData.status === 1) {
          $("#msg_box").html(``)
          $("#checkStatus").removeClass("hidden")
          $("#confirmationModal").modal("show")
  
          if (statusData.message[0].app_status !== "Accepted") {
            $("#modalBody").html(`
            <div class="flex justify-center">
              <img src="./assets/img/review.png" alt="">
            </div>
    
            <p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is under review.</p>
          `)
          } else {
            $("#modalBody").html(`
              <div class="flex justify-center">
                <img src="./assets/img/verified.png" alt="">
              </div>
  
              <p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application has been approved.</p>
  
              <div class="flex justify-center">
                <a class="button" href="./dashboard/etcc-preview.html?theid=${therefNumber}">View Certificate</a>
              </div>
            `)
  
          }
  
  
        } else {
          alert('Invalid Ref Number')
          $("#msg_box").html(``)
          $("#checkStatus").removeClass("hidden")
        }
      } catch (error) {
        alert('something went wrong')
        $("#msg_box").html(``)
        $("#checkStatus").removeClass("hidden")
      }
  
  
      // const response = await fetch(`${HOST}?getETCC&type=ref&id=${therefNumber}`)
      // const statusData = await response.json()
  
      // console.log(statusData)
      // if (statusData.status === 0) {
      //   $("#msg_box").html(``)
      //   $("#checkStatus").removeClass("hidden")
      //   $("#confirmationModal").modal("show")
  
      //   $("#modalBody").html(`
      //     <div class="flex justify-center">
      //       <img src="./assets/img/notpaid.png" alt="">
      //     </div>
  
      //     <p class="text-lg fontBold text-center mb-3 mt-5">${statusData.message}</p>
      //   `)
  
      // } else if (statusData.status === 1 && statusData.request_status === "pending") {
      //   $("#msg_box").html(``)
      //   $("#checkStatus").removeClass("hidden")
      //   $("#confirmationModal").modal("show")
  
      //   $("#modalBody").html(`
      //   <div class="flex justify-center">
      //     <img src="./assets/img/notpaid.png" alt="">
      //   </div>
  
      //   <p class="text-lg fontBold text-center mb-3 mt-5">Your application has not been approved.</p>
      //   <p class="text-center mb-5">Please check back later</p>
        
      // `)
  
      // } else if (statusData.status === 1 && statusData.request_status === "approved") {
      //   $("#msg_box").html(``)
      //   $("#checkStatus").removeClass("hidden")
      //   $("#confirmationModal").modal("show")
      //   theObj = statusData.data
      //   let modalBB = ""
  
      //   let obj = {
      //     "TaxFilling": "Tax Filling",
      //     "TinRequest": "TIN Request",
      //     "TaxClearance": "Tax Clearance Certificate"
      //   }
  
      //   let obj2 = {
      //     "TaxFilling": "Please proceed to generate invoice and pay your tax",
      //     "TinRequest": "Your TIN has been successfully generated and sent to the email you provided",
      //     "TaxClearance": "Please proceed to download your certificate"
      //   }
  
      //   let obj3 = {
      //     "TaxFilling": `<button onclick="generateInvoice()" data-thedata="" id="generating_inv" class='button'>Generate Invoice</button>`,
      //     "TinRequest": "<p></p>",
      //     "TaxClearance": `<a href='taxcertificate.html?reference=${therefNumber}' class='button'>Download</a>`
      //   }
  
      //   modalBB += `
      //     <div class="flex justify-center">
      //       <img src="./assets/img/verify.png" alt="">
      //     </div>
  
      //     <p class="text-lg fontBold text-center mb-3 mt-5">Your ${obj[statusData.service_type]} application has been approved </p>
      //     <p class="text-center mb-2">${obj2[statusData.service_type]}</p>
  
      //     <div class="flex justify-center mb-4 mt-3">
      //       ${obj3[statusData.service_type]}
      //     </div>
      //   `
      //   $("#modalBody").html(modalBB)
  
      // }
    }
  
    getStatus()
  
  })