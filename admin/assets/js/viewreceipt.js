function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function printInvoiceHard(thecard) {
  var originalContent = document.body.innerHTML;

  document.querySelector("#receiptHardCopy").classList.remove('hidden')

  var printContent = document.getElementById(thecard).innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}

async function openHardReceipt(invoicenum) {
//   console.log(invoicenum)

  const response = await fetch(
    `${HOST}/php/index.php?getSinglePayment&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {

    let invoice_info = userInvoices.message[0]

    let hardCopyReceipt = ""

    let theItems = []
    let theAmount = 0
    userInvoices.message.forEach(userInfo => {
      theItems.push(userInfo.COL_4)
      theAmount += parseFloat(userInfo.amount_paid)
    })
    
    function formatDateRange(originalDate) {
          // Convert string to date object
          let dateObj = new Date(originalDate);
        
          // Get the year, month, and day
          let year = dateObj.getFullYear();
          let month = dateObj.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
          let day = dateObj.getDate();
        
          // Create a new date object for the next year
          let nextYear = new Date(year + 1, month - 1, day); // Month is 0-indexed in Date constructor
        
          // Format the output
          let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} - ${nextYear.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          return formattedDate;
        }
        
        function formatDate(inputDate) {
          // Parse the input date string
          const parsedDate = new Date(inputDate.replace(/-/g, '/'));
        
          // Extract the day, month, and year
          const dayWithSuffix = addSuffix(parsedDate.getDate());
          const month = parsedDate.toLocaleString('en-US', { month: 'long' });
          const year = parsedDate.getFullYear();
        
          // Construct the final formatted date string in dd mm yyyy format
          const finalFormattedDate = `${dayWithSuffix} ${month} ${year}`;
        
          return finalFormattedDate;
        }
    
    let theUserInfo = JSON.parse(window.localStorage.getItem("adminDataPrime"));
    // console.log(theUserInfo)
    hardCopyReceipt += `
        <div class="hardReceiptCopy">
          <div class="h-[185px]">
          
          </div>

          <div class="flex justify-end mx-6">
            <h1 class="fontBold text-2xl">${invoice_info.invoice_number}</h1>
          </div>


          <table class="table table-borderless mx-6 mt-4">
            <tr>
              <td>MDA</td>
              <td>${invoice_info['COL_3']}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>${invoice_info.payment_status.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Tax Item</td>
              <td>${theItems.join(', ')}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${formatMoney(theAmount)}</td>
            </tr>
            <tr>
              <td>PAYER NAME</td>
              <td>${invoice_info.first_name} ${invoice_info.surname}</td>
            </tr>
            <tr>
              <td>Payer ID</td>
              <td>${invoice_info.tax_number}</td>
            </tr>
            <tr>
              <td>TIN</td>
              <td>${invoice_info.tin ? invoice_info.tin : '-'}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>${invoice_info.description}</td>
            </tr>
            <tr>
              <td>Period</td>
              <td>${invoice_info.start_date ? `${invoice_info.start_date} - ${invoice_info.end_date}` :  'Nil'}</td>
            </tr>
            <tr>
              <td>Billing Ref</td>
              <td>${invoice_info.invoice_number}</td>
            </tr>
            <tr>
              <td>Created By</td>
              <td>${invoice_info.first_name} ${invoice_info.surname}</td>
            </tr>
            <tr>
              <td>Date Paid</td>
              <td>${formatDate(invoice_info.timeIn)}</td>
            </tr>
            <tr>
              <td>Administrator Email</td>
              <td>${theUserInfo?.email}</td>
            </tr>
          </table>

          <div class='mx-6 flex justify-between mt-5'>
            <div>
              <div class="border-b border-b border-[#6F6F84] mb-2">
                <img src="./assets/img/sign.png" alt="" class="pb-2">
              </div>
            
              
              <h4 class="fontBold">Executive Chairman PSIRS</h4>
            </div>

            <div class="w-[18%] pr-8" id="qrContainer2"></div>
          </div>
        </div>
    `

    $("#receiptHardCopy").html(hardCopyReceipt)

    const qrCodeContainer2 = document.getElementById("qrContainer2")

    const qrCode2 = new QRCode(qrCodeContainer2, {
      text: `https://plateauigr.com/viewreceipt.html?invnumber=${invoicenum}&load=true`,
      colorDark: '#000000',
      colorLight: '#ffffff',
      version: 10,
    });

    // qrCode2.makeCode();

  } else {
    $("#invoiceCard").html(`Invalid Invoice, or expired invoice`)
  }
}

const receiptUrlParams = new URLSearchParams(window.location.search);
const invnumbering = receiptUrlParams.get('invnumber');

openHardReceipt(invnumbering)

