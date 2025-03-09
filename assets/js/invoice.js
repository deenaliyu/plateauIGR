function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}
// console.log(formatMoney(10000))

function sumArray(numbers) {
  // console.log(numbers)
  return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
// function editoo() {
//   let theBal = $(".theBal").text();
//   let actualPrice = $("#actualPrice").text()

//   $(".showEorAp").html(`
//     <button class="textPrimary gap-2 flex items-center" id="applyBtn">
//       <i class="fas fa-check"></i>
//       <span>Apply</span>
//     </button>
//   `);

//   $("#showBal").html(`
//       <input type="number" id="inpBal" class="p-[5px] outline-none w-[100px] rounded-lg border border-gray-500" value="${theBal}" />
//     `);

//   $("#applyBtn").on("click", function () {
//     $(".showEorAp").html(`
//         <button class="textPrimary gap-2 flex items-center" id="editBtn">
//           <i class="fas fa-pen"></i>
//           <span>Edit</span>
//         </button>
//       `);
//     $("#editBtn").on("click", function () {
//       editoo();
//     });
//     let theFBal = $("#inpBal").val();

//     $("#showBal").html(`
//         <p>&#8358; <span class="theBal"> ${theFBal}</span></p>
//       `);
//     $("#amword").html(convertNumberToWords(theFBal))
//     // console.log(actualPrice)
//     $("#balancing").html("N" + (parseFloat(actualPrice) + parseFloat(theFBal)))
//     $("#balancing").removeClass("hidden")
//     $("#balancingBB").removeClass("hidden")
//   });
// }

let invoicenum2 = ""



async function openInvoice(invoicenum, price) {
  // console.log(price)
  invoicenum2 = invoicenum

  const response = await fetch(
    `${HOST}?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {
    let invoice_info = userInvoices.message[0]

    // TOTAL INVOICE BEGIN

    let TotalInvoice = ""

    TotalInvoice += `
      <div class="invoicetop"></div>

      <div class="flex px-6 pt-3 items-center justify-between">

        <h1 class="fontBold text-2xl">Invoice</h1>

        <div class="flex items-center gap-1">
          <img src="./assets/img/vector.png" alt="">
          <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
        </div>

      </div>

      <div class="mt-2 px-4 gap-3">
        <img src="./assets/img/akwaimage.png" alt="" class="w-[80px]">
      </div>
      `

    if (userInvoices.message.length > 1) {
      TotalInvoice += `
      <div class="flex  justify-between px-6 mt-4">
        <div class="w-full">
          <p class="text-[#555555]">FROM :</p>
          <p class="fontBold">${invoice_info.COL_3}</p>
        </div>

        <div class="w-full md:mr-[-10%]">
          <p class="text-[#555555]">TO :</p>
          <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
          <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address ? invoice_info.address : ''}</p>
        </div>

      </div>
`
    } else {
      TotalInvoice += `
      <div class="flex  justify-between px-6 mt-4">
        <div class="w-full">
          <p class="text-[#555555]">FROM :</p>
          <p class="fontBold">${invoice_info.COL_3}</p>
          <p class="text-[#222234] w-[60%] text-sm">Plateau</p>
        </div>

        <div class="w-full md:mr-[-10%]">
          <p class="text-[#555555]">TO :</p>
          <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
          <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address ? invoice_info.address : ''}</p>
        </div>

      </div>
    `
    }
    TotalInvoice += `
      <div class="px-6 mt-4">
        <p class="text-[#555555]">INFO :</p>

        <table class="table table-borderless invTa md:w-[70%] w-full">
          <tr>
            <td>
              <p class="fontBold">Payer ID: ${invoice_info.tax_number ? invoice_info.tax_number : invoice_info.payer_id}</p>
            </td>
            <td>Due Date: ${invoice_info.due_date}</td>
          </tr>
          <tr>
            <td>Invoice Date: ${invoice_info.date_created.split(" ")[0]}</td>
            <td>Expiry Date: ${invoice_info.due_date}</td>
          </tr>
          <tr>
            <td><span class="fontBold">Description:</span> ${invoice_info.description ? invoice_info.description : '-'}</td>
          </tr>
        </table>
      </div>
    `

    let theTotal = []
    let theOutstandingTotal = []
    let subTotal = []

    TotalInvoice += `
        <div class="px-6">
          <table class="table table-borderless table-sm">
            <thead>
              <tr class="bg-[#CDA545]">
                <td class="text-[#fff] text-sm">ITEM DESCRIPTION</td>
                <td class="text-[#fff] text-sm">QTY</td>
                <td class="text-[#fff] text-sm">RATE</td>
                <td class="text-[#fff] text-sm">AMOUNT</td>
              </tr>
            </thead>
            <tbody>
          `

    userInvoices.message.forEach(element => {
      TotalInvoice += `
        <tr>
          <td class="text-sm">${element.COL_4}</td>
          <td class="text-sm">01</td>
          <td class="text-sm">${parseFloat(element.amount_paid).toLocaleString()}</td>
          <td class="text-sm">${parseFloat(element.amount_paid).toLocaleString()}</td>
        </tr>
      `
      theTotal.push(parseFloat(element.amount_paid))
      subTotal.push(parseFloat(element.amount_paid))
      if (element.invoice_type === "demand notice" && element.previous_year_value && element.previous_year_value > 0) {
        theTotal.push(parseFloat(element.previous_year_value))
      }
      theOutstandingTotal.push(parseFloat(element.previous_year_value))
    });

    TotalInvoice += `
          <tr class="border-t border-[#6F6F84]">
            <td class="text-[#555555] text-sm">Sub Total</td>
            <td></td>
            <td></td>
            <td class="text-[#000] text-sm">NGN ${formatMoney(sumArray(subTotal))}</td>
          </tr>
          ${invoice_info.invoice_type === "demand notice" ? `
            <tr>
                <td class="text-[#555555] text-sm">Outstanding</td>
                <td></td>
                <td></td>
                <td class="text-[#000] text-sm">${formatMoney(sumArray(theOutstandingTotal))}</td>
            </tr>
        ` : ''}
          <tr>
            <td class="text-[#555555] text-sm">Discount</td>
            <td></td>
            <td></td>
            <td class="text-[#000] text-sm">NGN0.00</td>
          </tr>
           <tr>
              <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
              <td class="text-[#000] text-xl fontBold">${formatMoney(sumArray(theTotal))}</td>
              <span class="d-none" id="theBal" data-money="${parseFloat(sumArray(theTotal))}">${formatMoney(sumArray(theTotal))}</span>
          </tr>
        

          <tr>
            <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
          </tr>
          <tr>
            <td colspan="4" class="text-sm text-gray-500 pt-0 text-capitalize"><span id="amword">${convertNumberToWords(sumArray(theTotal))}</span> Only</td>
          </tr>
        </tbody>
      </table>  
    </div>
    `

    TotalInvoice += `
      <hr class="my-4 md:mx-10 mx-4">

      <div class="md:px-10 px-2 pb-6">
        <div class="flex items-center justify-center gap-2">
          <img src="./assets/img/akwaimage.png" alt="">
          <div>
            <p class="text-xl fontBold pb-0">Plateau State Internal Revenue Service</p>
            <div class="flex items-center gap-x-3 flex-wrap">
              <p class="text-sm text-[#6F6F84]">www.plateauigr.com</p>
              <p class="text-sm text-[#6F6F84]">info@psirs.gov.ng</p>
              <p class="text-sm text-[#6F6F84]">07056990777, 08031230301</p>
              <img src="./assets/img/logo1.png" class="h-[30px] w-[70px]" alt="">
            </div>
          </div>
        </div>

      </div>
    `

    // TOTAL INVOICE END

    if (invoice_info.invoice_type === "demand notice") {


      let demandInvoiceInfo = userInvoices.message

      let normalDate = demandInvoiceInfo[0].date_created.split(" ")[0]



      $("#invoiceCard").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED DEMAND NOTICE", normalDate, textDemand))
      $("#assessmentDemandNotice").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED NOTICE OF ASSESSMENT", add30Days(normalDate), textAssessment))
      $("#auditLetter").html(displayAuditLetter(demandInvoiceInfo))
      $("#invoiceCardSecond").html(TotalInvoice)

    } else {
      $("#invoiceCard").html(TotalInvoice)
      $("#invoiceCardSecond").html(TotalInvoice)

      // const qrCodeContainer = document.getElementById("qrContainer")

      // const qrCode = new QRCode(qrCodeContainer, {
      //   text: `https://plateauigr.com/viewinvoice.html?invnumber=${invoicenum}&load=true`,
      //   colorDark: '#000000',
      //   colorLight: '#ffffff',
      //   version: 10,
      // });

    }


  }


}



let urlParams = new URLSearchParams(window.location.search);
const load = urlParams.get('load')
const invoicenumber = urlParams.get('invnumber')

if (load) {
  openInvoice(invoicenumber)
}
function goToPayment() {
  sessionStorage.setItem("invoice_number", invoicenumber)
  nextPrev(1)
}

function goToPayment2() {
  sessionStorage.setItem("invoice_number", invoicenum2)
  nextPrev(1)
}

const paying = urlParams.get('paying')
if (paying) {
  $("#thePay").html(`
    <a href="index.html" class="flex items-center gap-2 w-fit">
      <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
      <span>Go Home</span>
    </a>
  `)
} else {
  $("#thePay").html(`
    <a href="./dashboard/taxes.html" class="flex items-center gap-2 w-fit">
      <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
      <span>Go back</span>
    </a>
  `)
}