

async function getEtccRequests() {

  const response = await fetch(`${HOST}/?getETCC&type=`)
  const etccReqs = await response.json()

  $("#loader").css("display", "none")

  if (etccReqs.status === 0) {
    $('#dataTable').DataTable();

  } else {
    etccReqs.message.reverse().forEach((etcReq, i) => {

      $("#etccTable").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${etcReq.timeIn}</td>
          <td>${etcReq.refe}</td>
          <td>${etcReq.app_status === "Declined" ? '<span class="badge bg-warning">pending</span>' : '<span class="badge bg-success">Approved</span>'} </td>
          <td>
            <a href="./etcc-details.html?theid=${etcReq.refe}" class="button button-sm">View</a>
          </td>
          <td><a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a></td>
        </tr>
      `)

      $("#etccTable2").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${etcReq.timeIn}</td>
          <td>${etcReq.refe}</td>
          <td>${etcReq.app_status === "Declined" ? '<span class="badge bg-warning">pending</span>' : '<span class="badge bg-success">Approved</span>'} </td>
          <td>
            <a href="./etcc-details.html?theid=${etcReq.refe}" class="button button-sm">View</a>
          </td>
          <td><a href="./etcc-preview.html?theid=${etcReq.refe}" class="textPrimary fontBold">Preview</a></td>
        </tr>
      `)


    });
  }
}

getEtccRequests().then(tt => {
  $('#dataTable').DataTable();
  $('#dataTable2').DataTable();
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
      const response = await fetch(`${HOST}?getETCC&type=ref&id=${therefNumber}`)
      const statusData = await response.json()

      console.log(statusData)
      if (statusData.status === 1) {
        $("#msg_box").html(``)
        $("#checkStatus").removeClass("hidden")
        $("#confirmationModal").modal("show")

        if (statusData.message[0].app_status === "Declined") {
          $("#modalBody").html(`
          <div class="flex justify-center">
            <img src="./assets/img/notpaid.png" alt="">
          </div>
  
          <p class="text-lg fontBold text-center mb-3 mt-5">Your application is under review.</p>
        `)
        } else {
          $("#modalBody").html(`
            <div class="flex justify-center">
              <img src="./assets/img/verified.png" alt="">
            </div>

            <p class="text-lg fontBold text-center mb-3 mt-5">Your application has been approved.</p>
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