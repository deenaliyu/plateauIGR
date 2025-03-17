const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

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

                if (userInvoice.application_status === "pending") {
                    $("#showbtn").html(`
                        <button class="w-54 bg-green-600 text-white rounded-md p-2 mt-2" id="approveApp">Approve</button>
                        <button class="w-54 bg-red-600 text-white rounded-md p-2 mt-2" id="rejectApp">Reject</button>
                    `);
                }
            });

            // Attach event listeners after rendering buttons
            $("#approveApp").on("click", function () {
                updateApplicationStatus("approved");
            });

            $("#rejectApp").on("click", function () {
                updateApplicationStatus("rejected");
            });

        } else {
            $("#dataTable").DataTable();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function updateApplicationStatus(status) {
    $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
    `);

    $("#approveApp, #rejectApp").addClass("hidden");

    try {
        const response = await fetch(`${HOST}/?updateTaxFilingStatus&id=${userIdo}&status=${status}`, {
            method: "GET",
        });

        const data = await response.json();

        if (data.status === 1) {
            $("#msg_box").html(`
                <p class="text-success text-center mt-4 text-lg">${status === "approved" ? "Approved" : "Rejected"} Successfully</p>
            `);
            setTimeout(() => {
                window.location.href = "./service.html";
            }, 1000);
        } else {
            $("#msg_box").html(`
                <p class="text-warning text-center mt-4 text-base">${data.message}</p>
            `);
            $("#approveApp, #rejectApp").removeClass("hidden");
        }
    } catch (error) {
        console.error("Error updating status:", error);
        $("#msg_box").html(`
            <p class="text-danger text-center mt-4 text-lg">Something went wrong, try again!</p>
        `);
        $("#approveApp, #rejectApp").removeClass("hidden");
    }
}

fetchTaxfillers();