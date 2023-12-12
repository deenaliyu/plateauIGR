

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