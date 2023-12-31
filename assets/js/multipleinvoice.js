function convertNumberToWords(number) {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  if (number === 0) {
    return 'zero';
  }

  if (number < 0) {
    return 'minus ' + convertNumberToWords(Math.abs(number));
  }

  let words = '';

  if (Math.floor(number / 1000000) > 0) {
    words += convertNumberToWords(Math.floor(number / 1000000)) + ' million ';
    number %= 1000000;
  }

  if (Math.floor(number / 1000) > 0) {
    words += convertNumberToWords(Math.floor(number / 1000)) + ' thousand ';
    number %= 1000;
  }

  if (Math.floor(number / 100) > 0) {
    words += convertNumberToWords(Math.floor(number / 100)) + ' hundred ';
    number %= 100;
  }

  if (number > 0) {
    if (words !== '') {
      words += 'and ';
    }

    if (number < 10) {
      words += ones[number];
    } else if (number < 20) {
      words += teens[number - 11];
    } else {
      words += tens[Math.floor(number / 10)];
      if (number % 10 > 0) {
        words += '-' + ones[number % 10];
      }
    }
  }

  return words.trim();

}

function editoo() {
  let theBal = $(".theBal").text();

  $(".showEorAp").html(`
      <button class="textPrimary gap-2 flex items-center" id="applyBtn">
        <i class="fas fa-check"></i>
        <span>Apply</span>
      </button>
    `);

  $("#showBal").html(`
        <input type="number" id="inpBal" class="p-[5px] outline-none w-[100px] rounded-lg border border-gray-500" value="${theBal}" />
      `);

  $("#applyBtn").on("click", function () {
    $(".showEorAp").html(`
          <button class="textPrimary gap-2 flex items-center" id="editBtn">
            <i class="fas fa-pen"></i>
            <span>Edit</span>
          </button>
        `);
    $("#editBtn").on("click", function () {
      editoo();
    });
    let theFBal = $("#inpBal").val();

    $("#showBal").html(`
          <p>&#8358; <span class="theBal"> ${theFBal}</span></p>
        `);
    $("#amword").html(convertNumberToWords(theFBal))
    $("#balancing").html("N" + (theBal - theFBal))
    $("#balancing").removeClass("hidden")
    $("#balancingBB").removeClass("hidden")
  });
}

let invoicenum2 = ""

async function openInvoice(invoicenum) {
  console.log(invoicenum)
  invoicenum2 = invoicenum

  const response = await fetch(
    `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {

    userInvoices.message.forEach((invoice_info, i) => {
      // let address = ""
      // if (user_session) {
      //   address = `${user_session.lga}, ${user_session.state}, Nigeria`
      // } else {
      //   address = "Akwa Ibom, Nigeria"
      // }
      $("#invoiceCard").html(`
            <div class="invoicetop"></div>
  
            <div class="flex px-6 pt-3 justify-between">
              <div>
                <h1 class="fontBold text-2xl">Invoice</h1>
                <img src="./assets/img/logo.png" class="w-[70px]" />
              </div>

              <div class="flex items-center gap-1 -mt-20">
                <img src="./assets/img/vector.png" alt="">
                <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
              </div>
  
            </div>
  
            <div class="flex  justify-between px-6 mt-4">
              <div class="w-full">
                <p class="text-[#555555]">FROM :</p>
                <p class="fontBold">${invoice_info.COL_3}</p>
                <p class="text-[#222234] w-[60%] text-sm">Uyo, Akwa Ibom</p>
              </div>
  
              <div class="">
                <p class="text-[#555555]">TO :</p>
                <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
                <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}, Akwa Ibom</p>
              </div>
  
            </div>
  
            <div class="px-6 mt-4">
              <p class="text-[#555555]">INFO :</p>
  
              <table class="table table-borderless invTa md:w-[70%] w-full">
                <tr>
                  <td>
                    <p class="fontBold">Payer ID: ${invoice_info.tax_number}</p>
                  </td>
                  <td>Due Date: ${invoice_info.due_date}</td>
                </tr>
                <tr>
                  <td>Invoice Date: ${invoice_info.date_created}</td>
                  <td>Expiry Date: ${invoice_info.due_date}</td>
                </tr>
              </table>
            </div>

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
                  <tr>
                    <td class="text-sm">Hiring for other Library Hells</td>
                    <td class="text-sm">01</td>
                    <td class="text-sm">2000</td>
                    <td class="text-sm">2000</td>
                  </tr>
                  <tr>
                    <td class="text-sm">Pools Betting</td>
                    <td class="text-sm">01</td>
                    <td class="text-sm">2100</td>
                    <td class="text-sm">2200</td>
                  </tr>
                  <tr>
                    <td class="text-sm">AKIRS</td>
                    <td class="text-sm">01</td>
                    <td class="text-sm">2300</td>
                    <td class="text-sm">2300</td>
                  </tr>

                  <tr class="border-t border-[#6F6F84]">
                    <td class="text-[#555555] text-sm">Sub Total</td>
                    <td></td>
                    <td></td>
                    <td class="text-[#000] text-sm">${invoice_info.COL_6}</td>
                  </tr>
                  <tr>
                    <td class="text-[#555555] text-sm">Discount</td>
                    <td></td>
                    <td></td>
                    <td class="text-[#000] text-sm">N0.00</td>
                  </tr>

                  <tr>
                    <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (NGN)</span></td>
                    <td class="text-[#000] text-xl fontBold">N${invoice_info.COL_6}</td>
                  </tr>

                  <tr>
                    <td colspan="2" class="text-[#000]">Paying</td>
                    <td class="textPrimary">
                      <div class="showEorAp">
                        <button class="textPrimary gap-1 flex items-center" id="editBtn">
                          <i class="fas fa-pen"></i>
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                    <td class="text-xl textPrimary fontBold">
                      <div id="showBal">
                      &#8358; <span class="theBal"> ${invoice_info.COL_6}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="text-[#000] fontBold">Balance</td>
                    <td class="textPrimary">
                    </td>
                    <td id="balancing" class="hidden text-lg textPrimary fontBold pb-0"></td>

                  </tr>

                  <tr>
                    <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-sm text-gray-500 pt-0 text-capitalize"><span id="amword">${convertNumberToWords(invoice_info.COL_6)}</span> Naira Only</td>
                  </tr>
                </tbody>
              </table>  
            </div>

            <div class="flex justify-end px-6 mb-4">
              <div class="w-6/12">
                <hr />
                <p>The Executive Chairman of the Board,
                Akwa Ibom State Internal Revenue Service
                (AKIRS)</p>
              </div>
            </div>
  
            <div class="md:px-10 px-2 pb-6">
              <div class="flex items-center justify-around">
                <img src="./assets/img/akwaimage.png" alt="">
                <div>
                  <p class="text-center text-gray-400">Akwa Ibom State Internal Revenue Service</p>
                  <div class="flex items-center gap-x-3 flex-wrap">
                    <p class="text-sm text-[#6F6F84]">www.akwaibompay.ng</p>
                    <p class="text-sm text-[#6F6F84]">Info@akwaibompay.com</p>
                    <p class="text-sm text-[#6F6F84]">07056990777, 08031230301</p>
                  </div>
                </div>
                <div>
                  <img src="./assets/img/logo1.png" class="h-[30px] w-[70px]" alt="">
                </div>
              </div>
  
            </div>
        `)

    })

    $("#editBtn").on("click", function () {
      editoo();
    });
  } else {
    $("#invoiceCard").html(`Invalid Invoice, or expired invoice`)
  }
}

{/* <table class="table table-borderless bg-[#FFF3E9]">
                  <tr>
                    <td colspan="3" class="text-[#6F6F84] pb-0">Payment Details</td>
                    <td class="text-right text-uppercase text-[#6F6F84] text-sm pb-0">Online payment </td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td class="text-right pt-0">Paystack </td>
                  </tr>
                </table> */}


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