let userIn = JSON.parse(window.localStorage.getItem("MDAINFO"));
// console.log(userIn);
let ALLINV = ""
let dataToExport = []

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
  AllInvoiceData = userInvoices.message

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
  $("#dataTable").DataTable();
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
           
            ${invoice.payment_status === 'paid' ? `<span class="badge bg-success">${invoice.payment_status}</span>`
        : `<span class="badge bg-danger">${invoice.payment_status}</span>`}
            </td>
            
            <td>
            <a href="./viewinvoice.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Invoice</a>
          </td>
           
            
           
            </tr>
            `);

  })
}


function exportToExcel(fileName = "mda_invoice_report.xlsx", sheetName = "Sheet1") {
  if (!Array.isArray(AllInvoiceData) || AllInvoiceData.length === 0) {
    console.error("No data to export");
    return;
  }

  // Map and transform data
  const transformedData = AllInvoiceData.map(({ COL_5, COL_3, COL_4, COL_6, revenue_head, id, ...rest }) => {
    return {
      ...rest,
      Category: COL_5,
      MDA: COL_3,
      "Revenue Head": COL_4
    };
  });

  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Export the Excel file
  XLSX.writeFile(workbook, fileName);
}

