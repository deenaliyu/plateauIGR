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
  const response = await fetch(`${HOST}?getAllTaxFiling`);
  const userInvoices = await response.json();
  console.log(userInvoices);
  $("#totalInv").html(userInvoices.message.length);
  $("#loader").css("display", "none");
  if (userInvoices.status === 1) {
    userInvoices.message.reverse().forEach((userInvoice, i) => {
      let addd = "";
      addd += `
        <tr class="relative">
        <td>${userInvoice.first_name} ${userInvoice.surname}</td>
        <td>${userInvoice.tax_to_file}</td>
        <td>${userInvoice.tax_filling_refrence}</td>
        <td>${userInvoice.start_date}</td>
        <td>${userInvoice.end_date}</td>
            `;
      if (userInvoice.application_status === "approved") {
        addd += `
              <td id="" class="checking">
                <p class='text-success'>${userInvoice.application_status}</p>
              </td>
              
              `;
      } else {
        addd += `
              <td id="" class="checking">
                <p class='text-danger'>${userInvoice.application_status}</p>
              </td>
              `;
      }

      addd += `
          <td>
            <a href="viewtaxfilling.html?id=${userInvoice.id}&load=true" target="_blank" class="btn btn-primary btn-sm viewUser" >View</a>
          </td>
          </tr>
          `;
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
  try {
    const response = await fetch(`${HOST}/php/index.php?getTaxFillingDash`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userAnalytics = await response.json();
    console.log(userAnalytics);

    // Ensure message exists and has data
    if (userAnalytics.status === 1 && userAnalytics.message.length > 0) {
      let data = userAnalytics.message[0];

      // Update HTML elements with fetched data
      $("#total").html(data.total_count);
      $("#pending").html(data.pending_count);
      $("#approved").html(data.approved_count);
    } else {
      console.error("No valid data received.");
    }

  } catch (error) {
    console.error("Error fetching analytics:", error);
  }
}


fetchAnalytics()