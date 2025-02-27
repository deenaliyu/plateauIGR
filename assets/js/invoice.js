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

function add30Days(date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 30);

  // Formatting to YYYY-MM-DD
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

let textAssessment = "If you object to any charges on the consolidated notice of assessment, you have 30 days to submit a written objection. For personal income tax objections, refer to section 54(1) of PITA 2004 as amended. Other objections should be directed to the ZIRS and will be reviewed according to the relevant legislation. Please pay any undisputed charges promptly to avoid accruing interest and penalties"
let textDemand = "You are required to present this Notice at any IGR collecting bank for payment or pay online via the plateauigr portal. "

function displayDemandNotice(demandInvoiceInfo, heading, the_date, the2item) {
  let demandInvoice = ""

  demandInvoice += `
      <div class="demanInvoiceBody w-fit bg-white">
          <!--header-->

          <div>
            <img src="./assets/img/psirs.png" class='w-[80px] object-cover' alt="" />
          </div>
          
          <h1 class="text-2xl fontBold text-center">Plateau State Internal Revenue Service</h1>
          <p class="text-sm text-center">No. 6 Bank Road, P.M.B. 2061, JOS, PLATEAU STATE, NIGERIA Tel: 08031230301; 07056990777; 08089728808; 07055458779</p>
          <p class="text-sm text-center">Website: www.psirs.gov.ng; E-mail: psirsjos@gmail.com</p>

          <hr class="my-2"/>

          <h1 class="fontBold text-lg mb-4">${demandInvoiceInfo[0].sector}</h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="space-y-2">
              <div class="flex gap-2">
                <span class="fontBold">TO:</span>
                <p>${demandInvoiceInfo[0].first_name} ${demandInvoiceInfo[0].surname}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold">ADDRESS:</span>
                <p>${demandInvoiceInfo[0].address}</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex gap-2">
                <span class="fontBold">Notice number:</span>
                <p>${demandInvoiceInfo[0].invoice_number}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold">DATE:</span>
                <p>${the_date}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold">TYPE OF BUSINESS/SOURCE OF INCOME:</span>
                <p>${demandInvoiceInfo[0].business_type ? demandInvoiceInfo[0].business_type : '-'}</p>
              </div>
            </div>
          </div>

          <h1 class="text-2xl fontBold text-center mb-4 underline">${heading}</h1>

          <p class="mb-6 text-sm text-center">
            In line with Plateau State (Consolidation) Revenue Law, 2020, the Service hereby notifies you of the following
            tax obligations due to the State MDAs, LGAs and administered by PSIRS.
          </p>

          <table class="table table-bordered invTable">
            <thead>
              <tr>
                <th>S/N</th>
                <th>REVENUE ITEM</th>
                <th>AMOUNT PAYABLE (N)</th>
                <th>STATE MDA/LGA</th>
                <th colspan="3" class="text-center">
                  YEAR OF ASSESSMENT
                </th>
              </tr>
              <tr>
                <th colspan="4"></th>
                <th>${demandInvoiceInfo[0].previous_year ? demandInvoiceInfo[0].previous_year : '-'}</th>
                <th>${demandInvoiceInfo[0].previous_year_2 ? demandInvoiceInfo[0].previous_year_2 : '-'}</th>
                <th>${demandInvoiceInfo[0].date_created.split('-')[0]}</th>
              </tr>
            </thead>
            <tbody>
      `
  TheDemandTotal = []
  demandInvoiceInfo.forEach((demandnot, i) => {
    let amountPayable = parseFloat(demandnot.amount_paid) + (demandnot.previous_year_value ? parseFloat(demandnot.previous_year_value) : 0) + (demandnot.previous_year_value_2 ? parseFloat(demandnot.previous_year_value_2) : 0)
    demandInvoice += `
          <tr>
            <td class='text-xs'>${i + 1}</td>
            <td class='text-xs'>${demandnot.COL_4}</td>
            <td class='text-xs'>${formatMoney(amountPayable)}</td>
            <td class='text-xs'>${demandnot.COL_3}</td>
            <td class='text-xs'>${demandnot.previous_year_value ? parseFloat(demandnot.previous_year_value).toFixed(2) : 'Nil'}</td>
            <td class='text-xs'>${demandnot.previous_year_value_2 ? parseFloat(demandnot.previous_year_value_2).toFixed(2) : 'Nil'}</td>
            <td class='text-xs'>${demandnot.amount_paid}</td>
          </tr>
        `

    TheDemandTotal.push(parseFloat(demandnot.amount_paid))
    if (demandnot.previous_year_value && demandnot.previous_year_value > 0) {
      TheDemandTotal.push(parseFloat(demandnot.previous_year_value))
    }
    if (demandnot.previous_year_value_2 && demandnot.previous_year_value_2 > 0) {
      TheDemandTotal.push(parseFloat(demandnot.previous_year_value_2))
    }
  })
  demandInvoice += `
              <tr>
                <td class="border border-gray-800 p-2 text-sm fontBold" colspan="2">
                  TOTAL
                </td>
                <td>${formatMoney(sumArray(TheDemandTotal))}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="space-y-4 mb-8 text-sm">
            <p>
              By this notice, the Service is making a demand on you for the payment of
              ${formatMoney(sumArray(TheDemandTotal))} for the years stated above within 30 days from
              today. Failure to comply will attract the necessary legal action to recover all tax liabilities against you.
            </p>
            <p>Thank you for your cooperation.</p>
            <p>Yours faithfully,</p>
          </div>

          <div class="mt-16">
            <div class="border-t border-black w-48"></div>
            <p class="font-bold mt-1">Executive Chairman</p>
          </div>

          <div class="border-t border-black w-full mt-5"></div>
          <p class="text-sm text-center">KEY: MOC & I = Ministry of Commerce & Industry, TCOR = Tourism Corporation, MOL & S = Ministry of Lands, Survey & Town Planning, PSIRS = Plateau State Internal Revenue Service, MOENV = Ministry of Environment, LGOVT = Local Government</p>

      `


  return demandInvoice
}

function displayAuditLetter(demandInvoiceInfo) {
  let auditletter = ""

  let theauditTotal = []
  demandInvoiceInfo.forEach((demandnot, i) => {

    theauditTotal.push(parseFloat(demandnot.amount_paid))
    if (demandnot.previous_year_value && demandnot.previous_year_value > 0) {
      theauditTotal.push(parseFloat(demandnot.previous_year_value))
    }
    if (demandnot.previous_year_value2 && demandnot.previous_year_value2 > 0) {
      theauditTotal.push(parseFloat(demandnot.previous_year_value2))
    }
  })
  auditletter += `
      <div class="mb-8">
        <div class="font-medium">PSIRS/SCG/TAD/24/VOL2</div>
        <div class="flex gap-2">
          <span class="font-medium">Date:</span>
          <div>${demandInvoiceInfo[0].date_created.split(" ")[0]}</div>
        </div>
      </div>

      <div class="mb-8 space-y-1">
        <span class="font-medium">The Managing Director,</span>
        <p>${demandInvoiceInfo[0].first_name}  ${demandInvoiceInfo[0].surname}</p>
         <p class="font-medium">Sir,</p>
      </div>

      <div class="mb-6 font-bold space-y-1">
        <p class="fontBold">DEMAND NOTICE FOR THE PAYMENT OF THE SUM OF ${formatMoney(sumArray(theauditTotal))}</p>
        <p class="fontBold">TAX AUDIT FOR THE PERIOD ${demandInvoiceInfo[0].date_created.split(" ")[0]} - ${add30Days(demandInvoiceInfo[0].date_created)}</p>
      </div>

      <div class="space-y-6 text-justify mb-8">
        <p>
          The Service in accordance with the provisions of the Personal Income Tax (Amended) Act 2011, reviewed your
          organization's payrolls, documents and established the sum of ${formatMoney(sumArray(theauditTotal))} (amount in words) only as unremitted
          Taxes. You are by this demand notice required to pay the above sum to Plateau State Government through the  following ways:
          
          <ul>
            <li class="mb-2">1. Visit the <strong>Plateau State Intelligent billing System Platform (Plateauigr.com)</strong>, click on pay now, select any of the payment gateways, use your <strong>Notice Number</strong> as invoice number to proceed with payments.</li>
            <li class="mb-2">2. Visit any <strong>Bank Branch</strong>, using demand notice number <strong>${demandInvoiceInfo[0].invoice_number}</strong> as your invoice number to make payments via quickteller, e-transact and paystack. And Request to make payments via paydirect.</li>
          </ul>
          
        </p>

        <p>Kindly note that, the Service while carrying out the audit adhered strictly to the provisions of the Personal Income Tax Act. In the event that your organisation disagrees with the attached audit report, you are allowed by Law to make an objection within 30days on receipt of this demand notice. Where no objection is made within the stipulated period, the above assessment will be deemed as final and conclusive.</p>

        <p class="mt-3">Please accept the assurance of my highest regards.</p>
      </div>

      <div class="text-center mt-16 space-y-1">
        <p class="font-bold">Jim Pam Wayas PhD.</p>
        <p class="font-bold">Executive Chairman</p>
      </div>
  `
  return auditletter
}

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