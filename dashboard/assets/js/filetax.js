const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');


async function getTaxFiling() {
  let userDATA = JSON.parse(localStorage.getItem("userDataPrime"))


  try {
    const response = await fetch(`${HOST}?getTaxFilingByUser&id=${userDATA.id}`)
    const data = await response.json()

    $("#loader").remove()
    if (data.status === 0) {

    } else {
      data.message.forEach(element => {
        $("#eservicesTable").append(`
            <tr>
              <td>${element.created_at.split(" ")[0]}</td>
              <td>${element.created_at.split(" ")[0]}</td>
              <td>${element.tax_filling_refrence}</td>
              <td>${element.tax_to_file}</td>
              <td><a href="taxfiling-view.html?id=${element.id}&load=true" class="button text-xs py-1  px-2">View</a></td>
            </tr>
          `)
      });

    }


  } catch (error) {
    console.log(error)
    $("#loader").remove()
  }


}

getTaxFiling().then(() => {
  $("#dataTable").DataTable();
})



async function fetchTaxfillers() {
  $("#showdetails").html("");
  $("#loader").css("display", "flex");

  try {
    const response = await fetch(`${HOST}?getTaxFilingById&id=${userIdo}`);
    const userInvoices = await response.json();

    $("#loader").css("display", "none");

    if (userInvoices.status === 1) {
      userInvoices.message.reverse().forEach((userInvoice, i) => {
        let addd = `
                    <tr class="relative">
                        <td>First Name</td>
                        <td>${userInvoice.first_name}</td>
                    </tr>
                    <tr class="relative">
                        <td>Surname</td>
                        <td>${userInvoice.surname}</td>
                    </tr>
                    <tr class="relative">
                        <td>Email</td>
                        <td>${userInvoice.email}</td>
                    </tr>
                    <tr class="relative">
                        <td>Phone Number</td>
                        <td>${userInvoice.phone_number}</td>
                    </tr>
                    <tr class="relative">
                        <td>Category</td>
                        <td>${userInvoice.category}</td>
                    </tr>
                    <tr class="relative">
                        <td>Tax Type</td>
                        <td>${userInvoice.tax_type}</td>
                    </tr>
                    <tr class="relative">
                        <td>Tax to File</td>
                        <td>${userInvoice.tax_to_file}</td>
                    </tr>
                `;

        if (userInvoice.category === "Individual") {
          addd += `
                        <tr class="relative">
                            <td>Form Assessment Upload</td>
                          <td><a href="${userInvoice.form_assessment_upload}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Tax Income Upload</td>
                         <td><a href="${userInvoice.tax_income_upload}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Evidence of Tax Payment</td>
                   <td><a href="${userInvoice.evidence_of_tax_payment}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                    `;
        } else {
          addd += `
                        <tr class="relative">
                            <td>Form Assessment Upload</td>
                            <td><a href="${userInvoice.form_assessment_upload}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Tax Income Upload</td>
                            <td><a href="${userInvoice.tax_income_upload}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Evidence of Tax Payment</td>
                            <td><a href="${userInvoice.evidence_of_tax_payment}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Form H1</td>
                            <td><a href="${userInvoice.form_upload_4}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                        <tr class="relative">
                            <td>Schedule of Tax Deduction</td>
                            <td><a href="${userInvoice.form_upload_5}" target="_blank" class="btn btn-primary btn-sm">View File</a></td>
                        </tr>
                    `;
        }

        $("#showdetails").append(addd);

      });


    } else {
      $("#showdetails").html(`
        <p class="p-4">Not Found</p>
        `);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchTaxfillers()