const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

// Store tax filing data globally
let taxFilingData = null;

async function fetchTaxfillers() {
  $("#showdetails").html("");
  $("#loader").css("display", "flex");

  try {
    const response = await fetch(`${HOST}?getTaxFilingById&id=${userIdo}`);
    const userInvoices = await response.json();

    $("#loader").css("display", "none");

    if (userInvoices.status === 1 && userInvoices.message.length > 0) {
      const userInvoice = userInvoices.message[0];
      taxFilingData = userInvoice;

      // Display basic information
      displayBasicInfo(userInvoice);

      // Display PIT Form if income data exists
      if (userInvoice.income) {
        populatePITForm(userInvoice);
        $("#pitFormCard").show();
        $("#actionButtons").css("display", "flex");
      }

      // Show approve/reject buttons if pending
      if (userInvoice.application_status === "pending") {
        $("#showbtn").html(`
          <button class="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2" id="approveApp">Approve</button>
          <button class="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2" id="rejectApp">Reject</button>
        `);

        $("#approveApp").on("click", function () {
          updateApplicationStatus("approved");
        });

        $("#rejectApp").on("click", function () {
          updateApplicationStatus("rejected");
        });
      }

    } else {
      $("#showdetails").html('<tr><td colspan="2" class="text-center text-danger">No data found</td></tr>');
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    $("#loader").css("display", "none");
    $("#showdetails").html('<tr><td colspan="2" class="text-center text-danger">Error loading data</td></tr>');
  }
}

function displayBasicInfo(data) {
  let html = `
    <tr>
      <td class="detail-label">Reference Number</td>
      <td class="detail-value"><strong>${data.tax_filling_refrence || '-'}</strong></td>
    </tr>
    <tr>
      <td class="detail-label">Category</td>
      <td class="detail-value">${data.category || '-'}</td>
    </tr>
  `;

  if (data.category === "Individual") {
    html += `
      <tr>
        <td class="detail-label">First Name</td>
        <td class="detail-value">${data.first_name || '-'}</td>
      </tr>
      <tr>
        <td class="detail-label">Surname</td>
        <td class="detail-value">${data.surname || '-'}</td>
      </tr>
    `;
  } else {
    html += `
      <tr>
        <td class="detail-label">Organization Name</td>
        <td class="detail-value">${data.first_name || '-'}</td>
      </tr>
    `;
  }

  html += `
    <tr>
      <td class="detail-label">Email</td>
      <td class="detail-value">${data.email || '-'}</td>
    </tr>
    <tr>
      <td class="detail-label">Phone Number</td>
      <td class="detail-value">${data.phone_number || '-'}</td>
    </tr>
    <tr>
      <td class="detail-label">Tax Type</td>
      <td class="detail-value">${data.tax_type || '-'}</td>
    </tr>
    <tr>
      <td class="detail-label">Tax to File</td>
      <td class="detail-value">${data.tax_to_file || '-'}</td>
    </tr>
    <tr>
      <td class="detail-label">Start Date</td>
      <td class="detail-value">${formatDate(data.start_date)}</td>
    </tr>
    <tr>
      <td class="detail-label">End Date</td>
      <td class="detail-value">${formatDate(data.end_date)}</td>
    </tr>
    <tr>
      <td class="detail-label">Application Status</td>
      <td class="detail-value">
        <span class="badge ${data.application_status === 'approved' ? 'bg-success' : data.application_status === 'rejected' ? 'bg-danger' : 'bg-warning'}">
          ${(data.application_status || 'pending').toUpperCase()}
        </span>
      </td>
    </tr>
  `;

  // File uploads
  if (data.form_assessment_upload) {
    html += `
      <tr>
        <td class="detail-label">Tax Filing Template</td>
        <td class="detail-value">
          <a href="${data.form_assessment_upload}" target="_blank" class="btn btn-primary btn-sm">
            <iconify-icon icon="material-symbols:download"></iconify-icon> Download
          </a>
        </td>
      </tr>
    `;
  }

  if (data.evidence_of_tax_payment) {
    html += `
      <tr>
        <td class="detail-label">Evidence of Tax Payment</td>
        <td class="detail-value">
          <a href="${data.evidence_of_tax_payment}" target="_blank" class="btn btn-primary btn-sm">
            <iconify-icon icon="material-symbols:download"></iconify-icon> Download
          </a>
        </td>
      </tr>
    `;
  }

  $("#showdetails").html(html);
}

function populatePITForm(data) {
  let incomeData;
  try {
    incomeData = JSON.parse(data.income);
  } catch (e) {
    console.error("Error parsing income data:", e);
    return;
  }

  const fullName = data.category === "Individual" 
    ? `${data.first_name || ''} ${data.surname || ''}`.trim() 
    : data.first_name || '';

  const years = incomeData.years || [
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 3
  ];

  // Meta information
  $("#pdf-tin").text(data.tin || '');
  $("#pdf-file-no").text(data.tax_filling_refrence || '');
  $("#pdf-tax-year").text(years[0]);
  $("#pdf-issue-date").text(new Date().toLocaleDateString('en-GB'));
  $("#pdf-year-ending").text(String(years[0]).slice(-2));

  // Personal data
  $("#pdf-name").text(fullName);
  $("#pdf-nationality").text(data.nationality || 'Nigerian');
  $("#pdf-residential-address").text(data.address || '');
  $("#pdf-office-address").text(data.address || 'N/A');
  $("#pdf-contact").text(data.phone_number || 'N/A');
  $("#pdf-tin-2").text(data.tin || '');
  $("#pdf-occupation").text(data.occupation || '');
  $("#pdf-commencement-date").text(formatDate(data.start_date));

  // Income table headers
  $("#pdf-year-col-1").html(`RENT/INCOME RECEIVED (₦)<br>${years[0]}`);
  $("#pdf-year-col-2").text(years[1]);
  $("#pdf-year-col-3").text(years[2]);

  // Build income table rows
  let tableRows = '';
  let rowNum = 1;

  // Fixed sources
  incomeData.sources.forEach(source => {
    if (source.type === 'fixed') {
      tableRows += `
        <tr>
          <td>${rowNum}. ${source.name.toUpperCase()}</td>
          <td class="amount">${formatCurrency(source.amounts[years[0]])}</td>
          <td class="amount">${formatCurrency(source.amounts[years[1]])}</td>
          <td class="amount">${formatCurrency(source.amounts[years[2]])}</td>
        </tr>
      `;
      rowNum++;
    }
  });

  // Other sources header
  tableRows += `
    <tr>
      <td><strong>${rowNum}. OTHER SOURCES (SPECIFY)</strong></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  `;

  // Other sources
  let otherIndex = 'a';
  incomeData.sources.forEach(source => {
    if (source.type === 'other') {
      tableRows += `
        <tr>
          <td style="padding-left: 25px;">(${otherIndex}). ${source.name}</td>
          <td class="amount">${formatCurrency(source.amounts[years[0]])}</td>
          <td class="amount">${formatCurrency(source.amounts[years[1]])}</td>
          <td class="amount">${formatCurrency(source.amounts[years[2]])}</td>
        </tr>
      `;
      otherIndex = String.fromCharCode(otherIndex.charCodeAt(0) + 1);
    }
  });

  // Add empty rows for other sources if less than 6
  while (otherIndex <= 'f') {
    tableRows += `
      <tr>
        <td style="padding-left: 25px;">(${otherIndex}).</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
    otherIndex = String.fromCharCode(otherIndex.charCodeAt(0) + 1);
  }

  $("#pdf-income-table-body").html(tableRows);

  // Declaration section
  $("#pdf-declarant-name").text(fullName);
  $("#pdf-sig-name").text(fullName);
  $("#pdf-sig-designation").text(data.occupation || '');
}

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  if (num === 0) return '';
  return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

// PDF Download Handler
$("#downloadPITBtn").on("click", function() {
  if (!taxFilingData) {
    alert("No data available to generate PDF");
    return;
  }

  const element = document.getElementById('pitFormContent');
  const fullName = taxFilingData.category === "Individual" 
    ? `${taxFilingData.first_name || ''} ${taxFilingData.surname || ''}`.trim() 
    : taxFilingData.first_name || '';
  
  const fileName = `PIT_Returns_${taxFilingData.tax_filling_refrence || 'Form'}_${fullName.replace(/\s+/g, '_')}.pdf`;

  // Show loading state
  const btn = $(this);
  const originalText = btn.html();
  btn.html('<span class="animate-spin inline-block mr-2">⏳</span> Generating PDF...');
  btn.prop('disabled', true);

  const opt = {
    margin: [10, 10, 10, 10],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: 'avoid-all', before: '.page-break' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    // Restore button
    btn.html(originalText);
    btn.prop('disabled', false);
  }).catch(err => {
    console.error("PDF generation error:", err);
    btn.html(originalText);
    btn.prop('disabled', false);
    alert("Error generating PDF. Please try again.");
  });
});

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
        window.location.reload();
      }, 1500);
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

// Initialize
fetchTaxfillers();