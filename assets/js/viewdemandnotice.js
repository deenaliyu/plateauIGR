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
                <span class="fontBold text-sm">TO:</span>
                <p>${demandInvoiceInfo[0].first_name} ${demandInvoiceInfo[0].surname}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold text-sm">ADDRESS:</span>
                <p>${demandInvoiceInfo[0].address}</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex gap-2">
                <span class="fontBold text-sm">Notice number:</span>
                <p>${demandInvoiceInfo[0].invoice_number}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold text-sm">DATE:</span>
                <p>${the_date}</p>
              </div>
              <div class="flex gap-2">
                <span class="fontBold text-sm">TYPE OF BUSINESS/SOURCE OF INCOME:</span>
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
          <img src="./assets/img/sign.png" alt="" class="pb-2">
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
        <p class="fontBold text-center">DEMAND NOTICE FOR THE PAYMENT OF THE SUM OF ${formatMoney(sumArray(theauditTotal))}</p>
        <p class="fontBold text-center">TAX AUDIT FOR THE PERIOD ${demandInvoiceInfo[0].date_created.split(" ")[0]} to ${add30Days(demandInvoiceInfo[0].date_created)}</p>
      </div>

      <div class="space-y-6 text-justify mb-8">
        <p>
          The Service in accordance with the provisions of the Personal Income Tax (Amended) Act 2011, reviewed your
          organization's payrolls, documents and established the sum of ${formatMoney(sumArray(theauditTotal))} (amount in words) only as unremitted
          Taxes. You are by this demand notice required to pay the above sum to Plateau State Government through the  following ways:
          
          <ul>
            <li class="mb-2 fontBold">1. Web Payment</li>
            <li><span class="fontBold">Step 1</span> Visit www.plateauigr.com</li>
            <li><span class="fontBold">Step 2</span> Click on Pay Now</li>
            <li><span class="fontBold">Step 3</span> Use the Notice Number ${demandInvoiceInfo[0].invoice_number} as Invoice Number to proceed with payment.</li>
            <li><span class="fontBold">Step 4</span> Select preferred payment gateway (Paystack, Credo, or Interswitch).</li>

            <li class="my-2 fontBold">2. Bank Branch</li>
            <li><span class="fontBold">Step 1</span> Visit any Bank Branch.</li>
            <li><span class="fontBold">Step 2</span> Use the Notice Number ${demandInvoiceInfo[0].invoice_number} as your Invoice Number.</li>
            <li><span class="fontBold">Step 3</span> Request to make payments via quickteller or e-transact.</li>
            <li><span class="fontBold">Step 4</span> Retain receipt as proof of payment.</li>
          </ul>
          
        </p>

        <p>Kindly note that, the Service while carrying out the audit adhered strictly to the provisions of the Personal Income Tax Act. 
        In the event that your organisation disagrees with the attached audit report, you are allowed by Law to make an objection within 
        30days on receipt of this demand notice. Where no objection is made within the stipulated period, the above assessment will be deemed
         as final and conclusive.</p>

        <p class="mt-3">Please accept the assurance of my highest regards.</p>
      </div>

      <div class="text-center mt-16 space-y-1">
        <div class="flex justify-center">
          <img src="./assets/img/sign.png" alt="" class="pb-2">
        </div>
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

    let demandInvoiceInfo = userInvoices.message

    let normalDate = demandInvoiceInfo[0].date_created.split(" ")[0]

    $("#invoiceCard").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED DEMAND NOTICE", normalDate, textDemand))
    $("#assessmentDemandNotice").html(displayDemandNotice(demandInvoiceInfo, "CONSOLIDATED NOTICE OF ASSESSMENT", add30Days(normalDate), textAssessment))
    $("#auditLetter").html(displayAuditLetter(demandInvoiceInfo))


  } else {

    $("#invoiceCard").html(`
      <div class="flex justify-center my-5">
        <p class="text-xl text-danger">Not Found !</p>
      </div>
    `)


  }


}



let urlParams = new URLSearchParams(window.location.search);
const load = urlParams.get('load')
const invoicenumber = urlParams.get('invnumber')

if (load) {
  openInvoice(invoicenumber)
}