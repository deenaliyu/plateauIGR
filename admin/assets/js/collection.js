function formatMoney(amount) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function getFormattedDate(date) {
  date = new Date(date)    
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

let AllInvoiceData = {}

async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(`${HOST}?fetchAllPayment`);
  const userInvoices = await response.json();
  
//   console.log(userInvoices);

  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {

    AllInvoiceData = userInvoices.message

    displayData(userInvoices.message)

  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

function displayData(userInvoices) {
  userInvoices.forEach((userInvoice, i) => {
    let addd = ""
    addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.tin}</td>
        <td>${userInvoice.business_type}</td>
          <td>${userInvoice.industry}</td>
        <td>${userInvoice.invoice_type}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${formatMoney(parseFloat(userInvoice.amount_paid))}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_method}</td>
        <td>${userInvoice.payment_bank}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${getFormattedDate(userInvoice.timeIn)}</td>
        
          `
    addd += `
      <td>
      <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
    </td> 
        </tr>
        `
    $("#showThem").append(addd);
    $("#showThem2").append(`
      <tr class="relative">
          <td>${i + 1}</td>
          <td>${userInvoice.mda_id.replace(/,/g, '')}</td>
          <td>${userInvoice.COL_4.replace(/,/g, '')}</td>
          <td>${userInvoice.first_name?.replace(/,/g, '')} ${userInvoice.surname?.replace(/,/g, '')}</td>
          <td>${userInvoice.tax_number}</td>
          <td>${userInvoice.tin}</td>
          <td>${userInvoice.business_type}</td>
          <td>${userInvoice.industry}</td>
          <td>${userInvoice.invoice_type}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${(parseFloat(userInvoice.amount_paid))}</td>
          <td>${userInvoice.payment_channel}</td>
          <td>${userInvoice.payment_method}</td>
          <td>${userInvoice.payment_bank}</td>
          <td>${userInvoice.payment_reference_number}</td>
          <td>${userInvoice.invoice_number}</td>
          <td>${getFormattedDate(userInvoice.timeIn)}</td>
      </tr>
    `)
  });
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});

