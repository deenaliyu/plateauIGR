let urlGot = new URL(window.location.href);
let tinGot = urlGot.searchParams.get('tin');

async function fetchTinData() {
  try {


    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php?tin=${tinGot}`,)
    const data = await response.json()

    if (data.success) {
      theuser = data.data[0]
      $('#invoiceCard').html(`
        <h1 class="text-center text-2xl mb-4">TIN Slip</h1>
        <div class="flex justify-center items-center mb-3">
          <div>
            <img src="./assets/img/logo.png" alt="">
          </div>
          <div>
            <img src="./assets/img/psirs.png" width="80" alt="">
          </div>
        </div>
        <table class="table">
          <tr>
            <th>TIN</th>
            <td>${theuser.tin}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>${theuser.type === 'corporate' ? '-' : `${theuser.first_name} ${theuser.last_name}`}</td>
          </tr>
          <tr>
            <th>Name of business</th>
            <td>${theuser.organization_name}</td>
          </tr>
          <tr>
            <th>Category</th>
            <td>${theuser.type}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${theuser.email}</td>
          </tr>
          
          <tr>
            <th>Phone</th>
            <td>${theuser.phone_number}</td>
          </tr>
          <tr>
            <th>Sector</th>
            <td>${theuser.sector ? theuser.sector : '-'}</td>
          </tr>
          <tr>
            <th>Industry</th>
            <td>${theuser.industry ? theuser.industry : '-'}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>${theuser.state}</td>
          </tr>
          <tr>
            <th>LGA</th>
            <td>${theuser.lga}</td>
          </tr>
          
          <tr>
            <th>Created by</th>
            <td>${theuser.payer_id === null ? 'Self' : 'Admin'}</td>
          </tr>
          <tr>
            <th>Date Created</th>
            <td>${new Date(theuser.created_at).toDateString()}</td>
          </tr>
        </table>
      `)

    } else {
      $("#invoiceCard").html(`
        <tr>
          <td colspan="2" class="text-center">No TIN Found</td>
        </tr>
      `)
    }


  } catch (error) {
    $("#invoiceCard").html(`
      <tr>
        <td colspan="2" class="text-center">No TIN Found</td>
      </tr>
    `)
    console.log(error)
  }
}

fetchTinData()

function printSlip(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

function downloadSlip(thecard) {
  const element = document.getElementById(thecard);

  var HTML_Width = $("#" + thecard).width();
  var HTML_Height = $("#" + thecard).height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + (top_left_margin * 2);
  var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($("#" + thecard)[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    }
    pdf.save('Tin Slip' + ".pdf");
  });

}