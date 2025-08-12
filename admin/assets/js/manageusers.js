const urlParams = new URLSearchParams(window.location.search);
const theUserID = urlParams.get("id");
//

let definition = {
  full: "Full Access",
  full_access: "Full Access",
  no_access: "No Access",
  view_revenue: "View Revenue Performance",
  view_invoice: "View Invoice Manager",
  view_taxpayer: "View Taxpayer Relations",
  view_tin: "View TIN requests manager",
  view_impressions: "View Impressions",
  view_mda: "View MDA list",
  create_mda: "Create MDA",
  activate_mda: "Activate/Deactivate MDA",
  create_revenue: "Create revenue head",
  update_revenue: "Update revenue head",
  approve_revenue: "Approve revenue head",
  activate_revenue: "Activate/Deactivate revenue head",
  view_inv_list: "View Invoice list",
  generate_inv_report: "Generate Invoice Report",
  view_coll_list: "View Collection list",
  generate_coll_report: "Generate Collection Report",
  view_settle_list: "View Settlement list",
  generate_settle_report: "Generate Settlement Report",
  view_tax_list: "View Tax Payer list",
  view_tax_detail: "Edit Tax Payer details",
  acti_taxpayer: "Activate/deactivate Taxpayer",
  allocate_appli: "Allocate applicable taxes",
  download_report: "Download report",
  reg_user: "Register new user",
  view_enum_list: "View the general enumeration list",
  updt_taxpayer: "Update taxpayer details",
  download_report: "Download report",
  access_enum: "Access Enumeration dashboard",
  view_audit: "View the audit trail module",
  analyze_audit:
    "Analyze audit logs (by use of filters and maneuvering the data)",
  generate_reports: "Generate reports",
  manage_logs: "Manage Logs",
  view_admin: "View Admin User List",
  create_new_user: "Create a new user and Assign a Role",
  update_user: "Update user role",
  activate_users: "Activate/deactivate users",
  create_gallery: "Create a new post - Gallery",
  create_news: "Create a new post - News",
  manage_publication_gallery: "Manage publication - Gallery",
  manage_publication_news: "Manage publication - News",
  view_support: "View support Module",
  respond_ticket: "Respond to tickets",
  escalate_issues: "Escalate issues",
  export_support: "Export support data",
  generate_report: "Generate report",
  first_reviewer: "First Reviewer",
  second_reviewer: "Second Reviewer",
  third_reviewer: "Third Reviewer",
  view_payee: "View Payee",
  edit_payee: "Edit Payee",
};


$("#createUser").on("click", function () {
  let allInputs = document.querySelectorAll(".userInputs");
  const checkboxGroups = document.querySelectorAll('.checkbox-group');

  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].value === "") {
      $("#msg_box").html(`
        <p class="text-[red] text-center mt-4 text-lg">All fields are required</p>
      `);
      break;
    } else {
      // e.preventDefault()
      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `);
      $("#createUser").addClass("hidden");

      let obj = {
        id: theUserID,
        img: "",
        verification_status: 1,
      };

      allInputs.forEach((allInput) => {
        obj[allInput.dataset.name] = allInput.value;
      });

      for (let i = 0; i < checkboxGroups.length; i++) {
        const checkboxGroup = checkboxGroups[i];
        const checkboxes = checkboxGroup.querySelectorAll('.acclvl');
        const selectedValues = [];

        for (let j = 0; j < checkboxes.length; j++) {
          const checkbox = checkboxes[j];
          if (checkbox.checked) {
            selectedValues.push(checkbox.value);
          }
        }

        if (selectedValues.length > 0) {
          obj[checkboxes[0].dataset.name] = selectedValues.join('~');
        } else {
          obj[checkboxes[0].dataset.name] = "";
        }
      }

      console.log(obj)
      let queryString = new URLSearchParams(obj).toString();
      $.ajax({
        type: "GET",
        url: `${HOST}?updateAdminUser&${queryString}`,
        dataType: "json",
        // data: StringedData,
        success: function (data) {
          console.log(data);
          if (data.status === 2) {
            $("#msg_box").html(`
              <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
            `);
            $("#createUser").removeClass("hidden");
          } else if (data.status === 1) {
            $("#msg_box").html(`
                  <p class="text-success text-center mt-4 text-lg">${data.message}</p>
                `);

            setTimeout(() => {
              window.location.href = "user.html";
            }, 1000);
          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_box").html(`
              <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
            `);
          $("#createUser").removeClass("hidden");
        },
      });
    }
    break;
  }
  return false;
});

async function fetchUSER() {
  const response = await fetch(`${HOST}/php/index.php?userProfileAdmin&id=${theUserID}`);
  const userInvoices = await response.json();
  // console.log(userInvoices)
  if (userInvoices.status === 1) {
    let theUSER = userInvoices.user;

    $("#accessLevelview").html(`
      <h1 class="text-lg fontBold mb-2">Access Level</h1>

      <table class="table w-[50%]">
        <tr>
          <th>Dashboard Access</th>
          <td>${theUSER.dashboard_access} Access</td>
        </tr>
        <tr>
          <th>Analytics Access</th>
          <td>${theUSER.analytics_access} Access</td>
        </tr>
        <tr>
          <th>Mda Access</th>
          <td>${theUSER.mda_access} Access</td>
        </tr>
        <tr>
          <th>Report Access</th>
          <td>${theUSER.reports_access} Access</td>
        </tr>
        <tr>
          <th>Enumeration Access</th>
          <td>${theUSER.enumeration_access} Access</td>
        </tr>
        <tr>
          <th>Audit Trail Access</th>
          <td>${theUSER.audit_trail_access} Access</td>
        </tr>
        <tr>
          <th>Users Access</th>
          <td>${theUSER.users_access} Access</td>
        </tr>
        <tr>
          <th>Cms Access</th>
          <td>${theUSER.cms_access} Access</td>
        </tr>
        <tr>
          <th>Support Access</th>
          <td>${theUSER.support} Access</td>
        </tr>
        <tr>
          <th>ETCC Access</th>
          <td>${theUSER.etcc_access} Access</td>
        </tr>
        <tr>
          <th>Payee Access</th>
          <td>${theUSER.payee_access} Access</td>
        </tr>
      </table>
    `);

    let alluserInputs = document.querySelectorAll(".userInputs");
    let acclvls = document.querySelectorAll(".acclvl");
    alluserInputs.forEach((uu) => {
      uu.value = theUSER[uu.dataset.name];
    });

    const checkboxGroups = document.querySelectorAll('.checkbox-group');

    checkboxGroups.forEach(checkboxGroup => {
      const checkboxes = checkboxGroup.querySelectorAll('.acclvl');
      const dataName = checkboxes[0].dataset.name;
      const selectedValue = theUSER[dataName];

      if (selectedValue) {
        const mainSelVal = selectedValue.split("~");

        checkboxes.forEach(checkbox => {

          if (mainSelVal.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      }
    });


  } else {

  }
}

fetchUSER();

$("#opPas").on("click", function () {
  let pasInp = document.querySelector(".passInput");

  if (pasInp.type === "password") {
    pasInp.type = "text";
  } else {
    pasInp.type = "password";
  }
})


$("#changePass").on("click", (e) => {

    let emailAdd = document.querySelector("#email").value
  
    e.preventDefault()
    $(".msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  
    $("#changePass").addClass("hidden")
    
    $.ajax({
      type: "GET",
      url: `${HOST}/?resetPasswordAmin&email=${emailAdd}`,
      dataType: 'json',
      success: function (data) {
      if (data.status === 1) {
          $("#msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
          setTimeout(() => {
            window.location.href = `user.html`
          }, 1500);

        } else if (data.status === 0) {
          $("#msg_box").html(`
            <p class="text-warning text-center mt-4 text-base">${data.message}</p>
          `)
        }
      },
      error: function (request, error) {
        console.log(error);
        $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
        `)
      }
    });
  
  })
