const urlParams = new URLSearchParams(window.location.search);
const theid = urlParams.get('theid');

let userInfo = JSON.parse(window.localStorage.getItem("userDataPrime"));
// userInfo.tax_number
const currentPageURL = window.location.href;

function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function getEtccDetails() {
  const response = await fetch(`${HOST}/?getETCC&type=ref&id=${theid}`)
  const etccDetail = await response.json()

  $("#loader").css("display", "none")

  console.log(etccDetail)
  if (etccDetail.status === 0) {

  } else {

    let theEtcDetail = etccDetail.message[0]

    let allInputs = document.querySelectorAll(".enumInput")

    allInputs.forEach((inpt, i) => {
      inpt.value = theEtcDetail[inpt.dataset.name]
    })

    if (theEtcDetail.app_status === "Declined") {
      console.log("hi")
      $("#decider").html(`
        
        <button class="button" id="theApprBtn" type="button" onclick="aprovethis()">Approve Request</button>
      `)
    } else {
      $("#decider").html(`
      <button class="button" id="theApprBtn" type="button" onclick="unapprove()">Un-pprove Request</button>
    `)

    }


  }
}


getEtccDetails()


$("#viewThis").on('click', function () {
  let thecall = document.querySelector('#thidCard').value
  window.open(thecall, '_blank')
})

async function fetchPayment() {

  const response = await fetch(
    `${HOST}/php/index.php?fetchPayment&user_id=${userInfo.tax_number}`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {

    userInvoices.message.reverse().forEach((userInvoice, i) => {
      $("#showPayment").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${userInvoice.user_id}</td>
          <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice["COL_4"]}</td>
          <td>${formatMoney(userInvoice.amount_paid)}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>${userInvoice.timeIn}</td>
          <td><span class="badge bg-success">paid</span></td>
          <td>
          <a href="../viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank"><iconify-icon class="text-xl" icon="material-symbols:download"></iconify-icon></a>
          </td>
        </tr>
      `);
    });

  }
}

fetchPayment().then(rr => {
  $("#dataTable").DataTable();
})

async function aprovethis() {
  $("#theApprBtn").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  try {
    const response = await fetch(`${HOST}/?updateETCC&id=${theid}&set=2`)
    const etccDetail = await response.json()

    if (etccDetail.status === 1) {
      alert("Approved successfully")
      window.location.reload()

    }
  } catch (error) {
    console.log(error)
  }

}

async function unapprove() {
  $("#theApprBtn").addClass("hidden")
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  try {
    const response = await fetch(`${HOST}/?updateETCC&id=${theid}&set=1`)
    const etccDetail = await response.json()

    if (etccDetail.status === 1) {
      alert("success")
      window.location.reload()

    }
  } catch (error) {
    console.log(error)
  }

}