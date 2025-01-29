let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
let currentPageURL = window.location.href;
// userInfo
async function getEtccRequests() {

  const response = await fetch(`${HOST}/?${currentPageURL.includes('admin/etcc-management') ? 'getETCC&type=' : `getETCC&type=payer_user&id=${userInfo?.tax_number}`}`)
  const etccReqs = await response.json()
  $("#loader").css("display", "none")

  //   Accepted: 1
  // Declined: 2
  // First Review: 3
  // Second Review: 4
  // Third Review: 5

  if (etccReqs.status === 0) {
    $('#dataTable').DataTable();

  } else {
    etccReqs.message.reverse().forEach((etcReq, i) => {
      let etccStatus = ""

      if (etcReq.app_status === "Declined") {
        etccStatus = `<span class="badge bg-danger">Declined</span>`
        $("#etccTable5").append(`
          <tr>
            <td>${etcReq.timeIn}</td>
            <td>${etcReq.refe}</td>
            <td>${etccStatus}</td>
            <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
            <td>
              <a href="./etcc-details.html?theid=${etcReq.refe}&level=3&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
            </td>
          </tr>
        `)
      } else if (etcReq.app_status === "Accepted") {
        etccStatus = `<span class="badge bg-success">Approved</span>`
        $("#etccTable4").append(`
          <tr>
            <td>${etcReq.timeIn}</td>
            <td>${etcReq.refe}</td>
            <td>${etccStatus}</td>
            <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
            <td>
              <a href="./etcc-details.html?theid=${etcReq.refe}&level=3&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
            </td>
            <td>${etcReq.app_status === "Accepted" ? `<a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a>` : '-'}</td>
          </tr>
        `)
      } else if (etcReq.app_status === "First Review") {
        etccStatus = `<span class="badge bg-warning">First Review</span>`
        $("#etccTable").append(`
          <tr>
            <td>${etcReq.timeIn}</td>
            <td>${etcReq.refe}</td>
            <td>${etccStatus}</td>
            <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
            <td>
              <a href="./etcc-details.html?theid=${etcReq.refe}&level=3&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
            </td>
          </tr>
        `)
      } else if (etcReq.app_status === "Second Review") {
        etccStatus = `<span class="badge bg-warning">Second Review</span>`
        $("#etccTable2").append(`
          <tr>
            <td>${etcReq.timeIn}</td>
            <td>${etcReq.refe}</td>
            <td>${etccStatus}</td>
            <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
            <td>
              <a href="./etcc-details.html?theid=${etcReq.refe}&level=4&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
            </td>
          </tr>
        `)
      } else if (etcReq.app_status === "Third Review") {
        etccStatus = `<span class="badge bg-warning">Third Review</span>`
        $("#etccTable3").append(`
          <tr>
            <td>${etcReq.timeIn}</td>
            <td>${etcReq.refe}</td>
            <td>${etccStatus}</td>
            <td>${etcReq.date_approved === "" ? '-' : etcReq.date_approved}</td>
            <td>
              <a href="./etcc-details.html?theid=${etcReq.refe}&level=5&payer_id=${etcReq.payer_id}" class="button button-sm">View</a>
            </td>
          </tr>
        `)
      } else {
        etccStatus = `<span class="badge bg-warning">Pending</span>`
      }


    });
  }
}

getEtccRequests().then(tt => {
  $('#dataTable').DataTable();
  $('#dataTable2').DataTable();
  $('#dataTable3').DataTable();
  $('#dataTable4').DataTable();
  $('#dataTable5').DataTable();
})


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
      const response = await fetch(`${HOST}?getETCC&type=ref&id=${therefNumber}`);
      const statusData = await response.json();
  
      console.log(statusData);
  
      if (statusData.status === 1) {
        $("#msg_box").html(``);
        $("#checkStatus").removeClass("hidden");
        $("#confirmationModal").modal("show");
  
        const appStatus = statusData.message[0].app_status;
  
        let modalContent = "";
        let imgSrc = "";
  
        switch (appStatus) {
          case "Declined":
            imgSrc = "./assets/img/declined.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application has been declined.</p>`;
            break;
  
          case "Accepted":
            imgSrc = "./assets/img/accepted.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application has been accepted.</p>`;
            break;
  
          case "First Review":
            imgSrc = "./assets/img/review.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is under the first review.</p>`;
            break;
  
          case "Second Review":
            imgSrc = "./assets/img/review.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is under the second review.</p>`;
            break;
  
          case "Third Review":
            imgSrc = "./assets/img/review.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is under the third review.</p>`;
            break;
  
          case "Pending":
            imgSrc = "./assets/img/pending.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application is pending.</p>`;
            break;
  
          default:
            imgSrc = "./assets/img/default.png";
            modalContent = `<p class="text-xl fontBold text-black text-center mb-3 mt-3">Your application status is unknown.</p>`;
            break;
        }
  
        $("#modalBody").html(`
          <div class="flex justify-center">
            <img src="${imgSrc}" alt="${appStatus}">
          </div>
          ${modalContent}
        `);
  
      } else {
        alert("Invalid Ref Number");
        $("#msg_box").html(``);
        $("#checkStatus").removeClass("hidden");
      }
    } catch (error) {
      alert("Something went wrong");
      $("#msg_box").html(``);
      $("#checkStatus").removeClass("hidden");
    }
  }
  

  getStatus()

})


async function getSpecialUsersDash1() {

  const response = await fetch(`${HOST}/?getETCCdash`)
  const getDashData = await response.json()


  if (getDashData.status === 0) {
    // $('#dataTable').DataTable();

  } else {
    let dashData = getDashData.message[0]

    $("#sub_num").html(dashData.total_count)
    $("#pending_num").html(dashData.declined_count)
    $("#appr_num").html(dashData.approved_count)
  }

}

getSpecialUsersDash1()