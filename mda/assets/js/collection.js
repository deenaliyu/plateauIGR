let userIn = JSON.parse(window.localStorage.getItem("MDAINFO"));
// console.log(userIn);
let ALLINV = ""

let AllInvoiceData = {}


async function featchCollectionReport() {
  $("#showInvoice").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}?getPaymentByMda&mda_name=${userIn.fullname}`
  );
  const allCollections = await response.json();
  AllInvoiceData = allCollections.message
  // console.log(AllInvoiceData)
  $("#loader").css("display", "none");
  if (allCollections.status === 1) {

    displayData(allCollections.message.reverse())
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

featchCollectionReport().then(rr => {
  $("#dataTable").DataTable();

})


function displayData(allCollections) {
  allCollections.forEach((invoice, i) => {
    var date = new Date(invoice.timeIn);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);

    var formattedDate = year + '-' + month + '-' + day;
    $("#showCollections").append(`
                <tr class="relative">
                <td>${i + 1}</td>
                <td>${invoice.COL_4}</td>
                <td>${invoice.first_name} ${invoice.surname} </td>
                <td>${invoice.tin === "" ? "N/A" : invoice.tin}</td>
                <td>${invoice.invoice_number}</td>
                <td>&#8358 ${invoice.amount_paid}</td>
                <td>${formattedDate}</td>
                <td>${invoice.payment_channel}</td>
                <td>${invoice.payment_reference_number}</td>
                <td>
                <a href="./viewreceipt.html?invnumber=${invoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
              </td> 
                </tr>
                `);

  })
}

function exportToExcel(fileName = "mda_collection_report.xlsx", sheetName = "Sheet1") {
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
