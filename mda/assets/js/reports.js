let userIn = JSON.parse(window.localStorage.getItem("MDAINFO"));
// console.log(userIn);
let ALLINV = ""

let AllInvoiceData = {}
async function fetchInvoices() {
  $("#showInvoice").html("");


  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  const response = await fetch(
    `${HOST}?getInvoiceByMda&mda_name=${userIn.fullname}`
  );
  const userInvoices = await response.json();
  AllInvoiceData =  userInvoices.message

  userInvoices ? $("#loader").remove() : `<h1>failed to fetch data</h1>`
  // console.log(userInvoices);

  ALLINV = userInvoices

  if (userInvoices.status === 1) {

    displayData(userInvoices.message.reverse())
  
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }

}

fetchInvoices().then(rr => {
  // $("#dataTable").DataTable();
})


function displayData(userInvoices) {
  userInvoices.forEach((invoice, i) => {
    $("#showInvoices").append(`
            <tr>
            <td>${i + 1}</td>
            <td>${invoice.COL_4}</td>
            <td>${invoice.first_name} ${invoice.surname} </td>
            <td>${invoice.invoice_number} </td>
             <td>&#8358 ${invoice.amount_paid} </td>
            <td>${invoice.due_date} </td>
            <td>
           
            ${invoice.payment_status === 'paid' ? `<div class="bg-[#ECFDF3] rounded-2xl py-1 px-3">
            <p class="text-[#027A48] font-bold">${invoice.payment_status}</p>
          </div>`
        : `<div class="bg-orange-100 rounded-2xl py-1 px-3">
            <p class="text-[#CDA545] font-bold">${invoice.payment_status}</p>
          </div>`}
            </td>
            
            <td>
            <a href="./viewinvoice.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
          </td>
           
            
           
            </tr>
            `);
  
  })
}



