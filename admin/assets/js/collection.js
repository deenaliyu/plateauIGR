async function fetchInvoice() {

  $("#showThem").html("");
  $("#loader").css("display", "flex");

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  const response = await fetch(
    `${HOST}/php/index.php?fetchAllPayment`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {

   
    $("#total_count").html( userInvoices.message.length.toLocaleString())
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = ""
      addd += `
        <tr class="relative">
        <td>${i + 1}</td>
        <td>${userInvoice.mda_id}</td>
        <td>${userInvoice.COL_4}</td>
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_number}</td>
        <td>${userInvoice.invoice_number}</td>
        <td>${userInvoice.amount_paid}</td>
        <td>${userInvoice.payment_channel}</td>
        <td>${userInvoice.payment_reference_number}</td>
        <td>${userInvoice.receipt_number}</td>
        <td>${userInvoice.timeIn}</td>
        
          `
      addd += `
      <td>
      <a href="./viewreceipt.html?invnumber=${userInvoice.invoice_number}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View Receipt</a>
    </td> 
        </tr>
        `
      $("#showThem").append(addd);
    });
  } else {
    // $("#showInvoice").html("<tr></tr>");
    $("#dataTable").DataTable();
  }
}

fetchInvoice().then((uu) => {
  $("#dataTable").DataTable();
});


async function fetchAnalytics() {

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  try {
    const response = await fetch(
      `${HOST}/php/index.php?getDashboardAnalyticsAdmin`
    );

    const userAnalytics = await response.json();

    console.log(userAnalytics)

    
   
    $("#due_invoices").html(userAnalytics.due_invoices.toLocaleString())
    $("#total_amount_invoiced").html(userAnalytics.total_invoice_paid.toLocaleString())
    $("#total_amount_invoiced2").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amount_invoiced3").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())
    $("#due_amount2").html(userAnalytics.due_amount.toLocaleString())
    $("#total_invoice").html(userAnalytics.total_invoice.toLocaleString())
    $("#total_amount").html(userAnalytics.total_invoice_paid.toLocaleString())
    $("#reg_taxP").html(userAnalytics.total_user.toLocaleString())

  //  console.log(userAnalytics.total_amount_invoiced)
   
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()

