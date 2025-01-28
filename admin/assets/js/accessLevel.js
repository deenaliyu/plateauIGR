let adminInfo = JSON.parse(localStorage.getItem("adminDataPrime"))
let currentUrl = window.location.href;
let splitted_url = currentUrl.split("/")

async function getRolesAdmin() {
  const response = await fetch(`${HOST}?getAdminRoles&id=${adminInfo.id}`);
  const userRoles = await response.json();

  console.log(userRoles)

  let currentPage = splitted_url[splitted_url.length - 1]

  if (currentPage === "dashboard.html") {

    $('#theLoader').remove()
    $(".main_section").removeClass("hidden")
    let adminRoles = userRoles.dashboard_access

    let full_access = adminRoles.find(ff => ff === "dashboard_access")
    let no_access = adminRoles.find(ff => ff === "no_access")

    
    if (no_access === undefined && full_access === undefined) {
      $(".main_section").html(`<p class="text-center text-xl fontBold">No Access</p>`)

    } else if (full_access) {
      myCharter.resize();
    } else if (no_access) {
      $(".main_section").html(`<p class="text-center text-xl fontBold">No Access</p>`)
    }

  } else if (currentPage === "analytics.html") {
    let analyticsRoles = userRoles.analytics_access

    let navItems = document.querySelectorAll(".nav-link")

    navItems.forEach(navItem => {
      let findHim = analyticsRoles.find(rr => rr === navItem.dataset.name)
      if (findHim) {

      } else {
        navItem.classList.add("disabled")
      }
    });

  } else if (currentPage === "mda.html") {
    let analyticsRoles = userRoles.mda_access


    let viewMda = analyticsRoles.find(ff => ff === "view_mda")
    let create_mda = analyticsRoles.find(ff => ff === "create_mda")

    $('#mdaContainer').removeClass('hidden')
    $('#theLoader').remove()
    // console.log(analyticsRoles, viewMda)

    if (viewMda === undefined) {
      $(".theTable").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
      $("#theTable").removeAttr('id')
    }

    if (create_mda === undefined) {
      let creareMdaCont = document.querySelectorAll("#creareMdaCont button")
      creareMdaCont.forEach(creCon => {
        creCon.remove()
      });
    }

  } else if (currentPage.includes("mdadetails.html")) {
    let mdaRoles = userRoles.mda_access

    let activate_mda = mdaRoles.find(ff => ff === "activate_mda")
    let create_revenue = mdaRoles.find(ff => ff === "create_revenue")
    let update_revenue = mdaRoles.find(ff => ff === "update_revenue")
    let approve_revenue = mdaRoles.find(ff => ff === "approve_revenue")
    let activate_revenue = mdaRoles.find(ff => ff === "activate_revenue")

    if (create_revenue === undefined) {
      $("#createRevCont").addClass("disabled")
    }

    if (update_revenue === undefined) {
      let updtCont = document.querySelectorAll('#updtCont')
      updtCont.forEach(element => {
        element.classList.add("disabled")
      });
    }

    if (approve_revenue === undefined) {
      $("#aprrv").addClass("disabled")
    }
  } else if (currentPage.includes("invoice.html") || currentPage.includes("collection.html") || currentPage.includes("settlement.html")) {
    let ReportRoles = userRoles.reports_access


    let view_inv_list = ReportRoles.find(ff => ff === "view_inv_list")
    let generate_inv_report = ReportRoles.find(ff => ff === "generate_inv_report")
    let view_coll_list = ReportRoles.find(ff => ff === "view_coll_list")
    let generate_coll_report = ReportRoles.find(ff => ff === "generate_coll_report")
    let view_settle_list = ReportRoles.find(ff => ff === "view_settle_list")
    let generate_settle_report = ReportRoles.find(ff => ff === "generate_settle_report")

    if (view_inv_list === undefined) {
      $(".invoiceTable").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)

      $("#cardsForSummaray").remove()
    }

    if (generate_inv_report === undefined) {
      $("#invReportd").addClass("disabled")
    }

    if (view_coll_list === undefined) {
      $(".collTab").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
    }

    if (generate_coll_report === undefined) {
      $("#collReportd").addClass("disabled")
    }

    if (view_settle_list === undefined) {
      $(".colet").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
    }

    if (generate_settle_report === undefined) {
      $("#settlReportD").addClass("disabled")
    }



  } else if (currentPage.includes("taxpayer.html")) {
    let taxPayers = userRoles.tax_payer_access

    let view_tax_list = taxPayers.find(ff => ff === "view_tax_list")
    let view_tax_detail = taxPayers.find(ff => ff === "view_tax_detail")
    let acti_taxpayer = taxPayers.find(ff => ff === "acti_taxpayer")
    let allocate_appli = taxPayers.find(ff => ff === "allocate_appli")
    let download_report = taxPayers.find(ff => ff === "download_report")

    if (download_report === undefined) {
      $("#txdReport").addClass("disabled")
    }

    if (view_tax_list === undefined) {
      $(".txTable").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
      $(".txTable2").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)

      $("#createTaxP").remove()
    }

    if (view_tax_detail === undefined) {
      let txViews = document.querySelectorAll(".txView")
      txViews.forEach(dd => {
        dd.classList.add("disabled")
      })
    }

  } else if (currentPage.includes("enumeration.html")) {
    let enumPayers = userRoles.enumeration_access

    let reg_user = enumPayers.find(ff => ff === "reg_user")
    let view_enum_list = enumPayers.find(ff => ff === "view_enum_list")
    let updt_taxpayer = enumPayers.find(ff => ff === "updt_taxpayer")
    let download_report = enumPayers.find(ff => ff === "download_report")
    let access_enum = enumPayers.find(ff => ff === "access_enum")

    if (reg_user === undefined) {
      $(".crFieldAg").remove()
    }

    if (view_enum_list === undefined) {
      $(".enumTable").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
    }

    if (updt_taxpayer === undefined) {
      let updtFF = document.querySelectorAll(".updtFF")
      updtFF.forEach(updt => {
        updt.remove()
      });
    }
    if (access_enum === undefined) {
      document.querySelector("#listtEnum").click()
      $("#theEnumDas").remove()
    }


  } else if (currentPage.includes("user.html")) {
    let userorles = userRoles.users_access

    let view_admin = userorles.find(ff => ff === "view_admin")
    let create_new_user = userorles.find(ff => ff === "create_new_user")
    let update_user = userorles.find(ff => ff === "update_user")
    let activate_users = userorles.find(ff => ff === "activate_users")

    $('#userDisplay').removeClass('hidden')
    $('#theLoader').remove()

    $("#userAccessor a").removeClass('hidden')
    if (view_admin === undefined) {
      $(".userTable").html(`
        <p class="text-center text-xl fontBold">No Access to view list !</p>
      `)
    }

    if (create_new_user === undefined) {
      $("#userAccessor").remove()
    }

    if (update_user === undefined) {
      let updateSec = document.querySelectorAll(".updateSec")
      updateSec.forEach(updateS => {
        updateS.remove()
      });
    }
  } else if (currentPage.includes("cms.html") || currentPage.includes("newpost.html")) {
    let cmsrles = userRoles.cms_access

    let create_gallery = cmsrles.find(ff => ff === "create_gallery")
    let create_news = cmsrles.find(ff => ff === "create_news")
    let manage_publication_gallery = cmsrles.find(ff => ff === "manage_publication_gallery")
    let manage_publication_news = cmsrles.find(ff => ff === "manage_publication_news")

    if (create_gallery === undefined && create_news === undefined) {
      $("#theCms").remove()
    } else if (create_gallery === undefined) {
      // $("#theCms").addClass("disabled")
      $(".selPage").html(`
        <option value="" disabled selected>Select --</option>
        <option value="news">News</option>
        
      `)
    } else if (create_news === undefined) {
      $(".selPage").html(`
        <option value="" disabled selected>Select --</option>
        <option value="gallery">Gallery</option>
        
      `)
    }


    if ((manage_publication_gallery === undefined) && (manage_publication_news === undefined)) {
      $(".main_section").html(`
        <p class="text-xl fontBold text-center">No Access !</p>
      `)
    }

  } else if (currentPage.includes("support.html") || currentPage.includes("complain.html")) {
    let supportRoles = userRoles.cms_access

    let view_support = supportRoles.find(ff => ff === "view_support")
    let respond_ticket = supportRoles.find(ff => ff === "respond_ticket")
    let escalate_issues = supportRoles.find(ff => ff === "escalate_issues")
    let export_support = supportRoles.find(ff => ff === "export_support")
    let generate_report = supportRoles.find(ff => ff === "generate_report")

    $('#supportDisplay').removeClass('hidden')
    $('#theLoader').remove()

    if (view_support === undefined) {
      $(".main_section").html(`<p class="text-center text-xl fontBold m-5">No Access</p>`)
    }

    if ((respond_ticket === undefined) || escalate_issues === undefined) {
      $("#submitApp").addClass("disabled")
      $(".message-container").addClass("hidden")
    }

  } else if (currentPage.includes("etcc-management.html")) {
    let etccRoles = userRoles.etcc_access;

    $(".main_section").removeClass('hidden');
    $("#theLoader").remove();

    const firstReviewer = etccRoles.includes("first_reviewer");
    const secondReviewer = etccRoles.includes("second_reviewer");
    const thirdReviewer = etccRoles.includes("third_reviewer");

    // Check if the user has no access
    if (!firstReviewer && !secondReviewer && !thirdReviewer) {
        $(".main_section").html(`<p class="text-center text-xl fontBold m-5">No Access!</p>`);
        $("#initiateEtcc").remove();
    } else {
        // Handle role-based UI adjustments for multiple roles
        if (thirdReviewer && secondReviewer && firstReviewer) {
            // All three roles are present, no need to remove anything
        } else if (thirdReviewer && secondReviewer) {
            // If both thirdReviewer and secondReviewer are present
            $("#first_reviewer").remove();
        } else if (secondReviewer && firstReviewer) {
            // If both secondReviewer and firstReviewer are present
            $("#third_reviewer").remove();
        } else if (thirdReviewer && firstReviewer) {
            // If both thirdReviewer and firstReviewer are present
            $("#second_reviewer").remove();
        } else if (thirdReviewer) {
            // If only thirdReviewer is present
            $("#second_reviewer").remove();
            $("#first_reviewer").remove();
        } else if (secondReviewer) {
            // If only secondReviewer is present
            $("#third_reviewer").remove();
            $("#first_reviewer").remove();
        } else if (firstReviewer) {
            // If only firstReviewer is present
            $("#second_reviewer").remove();
            $("#third_reviewer").remove();
        }
    }
}
 else if (currentPage.includes("service.html")) {
    if (adminInfo.email === "primeguage@gmail.com") {

    } else {
      $(".main_section").html(`<p class="text-center text-xl fontBold m-5">No Access !</p>`)
    }
  } else if (currentPage.includes("paye-management.html") || currentPage.includes("paye-details.html")) {
    let payeRoles = userRoles.payee_access
    // console.log(etccRoles)
    let view_payee = payeRoles.find(ff => ff === "view_payee")
    let edit_payee = payeRoles.find(ff => ff === "edit_payee")

    $('#payeDisplay').removeClass('hidden')
    $('#theLoader').remove()

    if (view_payee === undefined) {
      $(".main_section").html(`
        <p class="text-2xl m-5 text-center">No Access !!</p>
      `)
    }

    if (edit_payee === undefined) {
      $('#thePayes').remove()
    }
  } else if (currentPage.includes("presumptive-tax.html")) {

    $('#preDisplay').removeClass('hidden')
    $('#theLoader').remove()

    let payeRoles = userRoles.tax_manager
    // console.log(etccRoles)
    let no_access = payeRoles?.find(ff => ff === "no_access")
    let full_access = payeRoles?.find(ff => ff === "full_access")



    if (full_access === undefined && no_access === undefined) {
      $("#preDisplay").html(`
        <p class="text-2xl m-5 text-center">No Access !!</p>
      `)

      $('#newTxPyer').remove()
    } else if (full_access) {

    } else if (no_access) {
      $("#preDisplay").html(`
        <p class="text-2xl m-5 text-center">No Access !!</p>
      `)

      $('#newTxPyer').remove()
    }
  } else if (currentPage.includes("enduseraudit.html")) {

    $('.main_section').removeClass('hidden')
    $('#theLoader').remove()

    let auditRoles = userRoles.audit_trail_access
    // console.log(etccRoles)
    let view_audit = auditRoles?.find(ff => ff === "view_audit")
    let analyze_audit = auditRoles?.find(ff => ff === "analyze_audit")
    let generate_reports = auditRoles?.find(ff => ff === "generate_reports")
    let manage_logs = auditRoles?.find(ff => ff === "manage_logs")


    if (view_audit === undefined) {
      $(".main_section").html(`
        <p class="m-5 text-2xl fontBold text-center">No Access !!</p>
      `)
    }

  }
}

getRolesAdmin()




// function removeEdit() {
//     let editTds = document.querySelectorAll(".editTd")
//     console.log(editTds)
//     document.querySelectorAll(".editTd").forEach(edita => {
//         edita.style.display = "none"
//     })
// }