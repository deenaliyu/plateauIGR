/**
 * PayZamfara Dashboard - API Integration
 * Integrates dashboard cards with backend APIs
 * Charts excluded from this integration
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMoney(amount) {
  return `₦ ${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

function showSpinner(elementId) {
  $(`#${elementId}`).html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
}

// ============================================
// YEAR DROPDOWN POPULATION
// ============================================

let remittanceDateInput = document.getElementById("remittanceDate");
if (remittanceDateInput) {
  remittanceDateInput.value = new Date().toISOString().split("T")[0];
}

function populateYearDropdown() {
  const yearSelects = document.querySelectorAll(".annualRevFilter");
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const endYear = currentYear;

  yearSelects.forEach((yearSelect) => {
    // Clear existing options first
    yearSelect.innerHTML = "";

    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
  });
}

// ============================================
// REVENUE CARD APIs
// ============================================

/**
 * Fetch Total Monthly Revenue
 * Endpoint: /get-total-amount-paid
 */
async function fetchTotalRevenue(monthYear) {
  showSpinner("totalMonthlyRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyRevenue&month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#totalMonthlyRevenue").html(formatMoney(data.message[0].total_monthly_revenue || 0));
    } else {
      $("#totalMonthlyRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching total monthly revenue:", error);
    $("#totalMonthlyRevenue").html(formatMoney(0));
  }
}

/**
 * Fetch Expected Monthly Revenue
 * Endpoint: /get-expected-monthly-revenue
 */
async function fetchExpectedMonthlyRevenue(monthYear) {
  showSpinner("expectedMonthlyRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyRevenue&month=${month}&year=${year}&sort=expected`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#expectedMonthlyRevenue").html(formatMoney(data.message[0].total_monthly_revenue || 0));
    } else {
      $("#expectedMonthlyRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching expected monthly revenue:", error);
    $("#expectedMonthlyRevenue").html(formatMoney(0));
  }
}

/**
 * Fetch Accrued (Unpaid) Monthly Revenue
 * Endpoint: /get-accrued-monthly-revenue
 */
async function fetchExpectedAccruedRevenue(monthYear) {
  showSpinner("expectedAccruedRevenue");
  const [year, month] = monthYear.split("-");

  try {
    const response = await fetch(
      `${HOST}?getMonthlyUnpaidRevenue&month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === 1) {
      $("#expectedAccruedRevenue").html(formatMoney(data.message[0].total_unpaid_revenue || 0));
    } else {
      $("#expectedAccruedRevenue").html(formatMoney(0));
    }
  } catch (error) {
    console.error("Error fetching accrued revenue:", error);
    $("#expectedAccruedRevenue").html(formatMoney(0));
  }
}

// ============================================
// TAXPAYER STATISTICS API
// ============================================


// ============================================
// INVOICE STATISTICS API
// ============================================

/**
 * Fetch Invoice Summary Statistics
 * Endpoint: /invoices-summary
 * Populates multiple cards at once
 */
function fetchInvoiceStatistics(monthYear) {
  // Show spinners for all invoice-related cards
  showSpinner("totalInvoices");
  showSpinner("totalInvoiced");
  showSpinner("totalPaidInvoice");
  showSpinner("totalUnpaidInvoice");
  // showSpinner("totalInvoicesDue");
  // showSpinner("totalInvoicesPaid");
  // showSpinner("totalAmountDue");
  // showSpinner("totalMDA");
  // showSpinner("totalRevenueHeads");

  const [year, month] = monthYear.split("-");

  $.ajax({
    type: "GET",
    url: `${HOST}?invoiceSummaryTiles&year=${year}&month=${month}`,
    dataType: "json",
    headers: {
      
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;
        // Total number of invoices
        $("#totalInvoices").text(stats.total_invoice.toLocaleString());

        // Total amount invoiced
        $("#totalInvoiced").text(formatMoney(stats.total_amount_invoiced || 0));

        // Total amount paid
        $("#totalPaidInvoice").text(formatMoney(stats.total_amount_paid || 0));

        // Total amount unpaid
        $("#totalUnpaidInvoice").text(formatMoney(stats.total_amount_unpaid || 0));

        // $("#totalInvoicesDue").text(stats.total_invoices_due.toLocaleString());
        // $("#totalInvoicesPaid").text(stats.total_invoices_paid.toLocaleString());
        // $("#totalAmountDue").text(formatMoney(stats.total_invoices_amount_due || 0));
        // $("#totalMDA").text(stats.total_mda.toLocaleString());
        // $("#totalRevenueHeads").text(stats.total_rh.toLocaleString());
      } else {
        console.error("Failed to fetch invoice statistics");
        resetInvoiceCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching invoice statistics:", error);
      resetInvoiceCards();
    },
  });
}

/**
 * Reset invoice cards to zero on error
 */
function resetInvoiceCards() {
  $("#totalInvoices").text("0");
  $("#totalInvoiced").text(formatMoney(0));
  $("#totalPaidInvoice").text(formatMoney(0));
  $("#totalUnpaidInvoice").text(formatMoney(0));
  $("#totalInvoicesDue").text("0");
  $("#totalInvoicesPaid").text("0");
  $("#totalAmountDue").text(formatMoney(0));
  $("#totalMDA").text("0");
  $("#totalRevenueHeads").text("0");
}

// ============================================
// E-SERVICES / TAX SUMMARY API
// ============================================

/**
 * Fetch Tax Summary (E-Services Section)
 * Endpoint: /admin-tax-summary
 */
function fetchTaxSummary(monthYear, isMonthYear = false) {
  // Show loading indicators
  showSpinner("tinIssued");
  showSpinner("tccIssued");
  showSpinner("payeRemitted");
  showSpinner("totalAmountUnpaidPaye");
  showSpinner("totalUnpaidPaye");

  let url = `${HOST}/admin-tax-summary`;
  if (isMonthYear && monthYear) {
    const [year, month] = monthYear.split("-");
    url += `?year=${year}&month=${month}`;
  }

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    headers: {
      
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;

        // TIN Issued
        $("#tinIssued").text((data.tin_issued || 0).toLocaleString());

        // TCC Issued
        $("#tccIssued").text((data.tcc_issued || 0).toLocaleString());

        // PAYE Remitted
        $("#payeRemitted").text(
          formatMoney(data.paye_remitted || 0)
        );

        // Total Amount of Unpaid PAYE
        $("#totalAmountUnpaidPaye").text(
          formatMoney(data.unpaid_amount_paye_taxes || 0)
        );

        // Total Unpaid PAYE (count)
        $("#totalUnpaidPaye").text((data.unpaid_paye_taxes || 0).toLocaleString());

        // Total TIN Request (using the same element ID from HTML - note: there's a duplicate ID in HTML)
        // If you have a separate element for TIN requests, update accordingly
        if (data.total_tin_requests !== undefined) {
          $("[id='totalTinRequest']").text((data.total_tin_requests || 0).toLocaleString());
        }
      } else {
        console.error("Failed to fetch tax summary");
        resetTaxSummaryCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching tax summary:", error);
      resetTaxSummaryCards();
    },
  });
}

/**
 * Reset tax summary cards to zero on error
 */
function resetTaxSummaryCards() {
  $("#tinIssued").text("0");
  $("#tccIssued").text("0");
  $("#payeRemitted").text(formatMoney(0));
  $("#totalAmountUnpaidPaye").text(formatMoney(0));
  $("#totalUnpaidPaye").text("0");
}

// ============================================
// AVERAGE DAILY REVENUE API
// ============================================

/**
 * Fetch Average Daily Revenue
 * Endpoint: /get-average-daily-revenue
 */

async function fetchDailyRemittance() {
  showSpinner("dailyRemittanceAmount");
  const date = document.getElementById("remittanceDate").value;

  const url = new URL(`${HOST}?getDailyRemittance&date=${date}`);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Parse and display data
    const dailyRemittance = parseFloat((data.message[0].total_daily_amount || "0").toString().replace(/,/g, "")) || 0;

    $("#dailyRemittanceAmount").text("₦" + dailyRemittance.toLocaleString("en-NG", { minimumFractionDigits: 2 }));
    $("#remittanceCount").text(data.message[0].total_daily_remittances || 0);
  } catch (error) {
    $("#dailyRemittanceAmount").text("₦0");
    $("#remittanceCount").text("0");
  }
}

async function fetchAverageDailyRevenue() {
  // Set default dates if not provided (first and last day of current month)

  const url = `${HOST}?getDailyRevenue`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Parse and display data
    const averageDailyRevenue = parseFloat((data.message[0].total_daily_revenue || "0").toString().replace(/,/g, "")) || 0;

    $("#averageDailyRevenue").text("₦" + averageDailyRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2 }));
  } catch (error) {
    $("#averageDailyRevenue").text("₦0");
  }
}

// ============================================
// TIN REQUEST COUNT API (Data only, no chart)
// ============================================

/**
 * Fetch TIN Request Count
 * Endpoint: /tin-request-counts
 */
async function fetchTimeRequestCountGauge() {
  const startDate = document.getElementById("tinStartDate")?.value || "";
  const endDate = document.getElementById("tinEndDate")?.value || "";
  const datemonth = document.getElementById("tinMonth")?.value || "";

  let month = "";
  let year = "";

  if (datemonth) {
    [year, month] = datemonth.split("-");
  }

  const url = `${HOST}/tin-request-counts?start_date=${startDate}&end_date=${endDate}&month=${month}&year=${year}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      // Data available for gauge chart rendering (charts excluded per request)
      console.log("TIN Request Count:", data.data?.tin_request_count);
    }
  } catch (error) {
    console.error("Error fetching TIN request count:", error);
  }
}

// ============================================
// INITIALIZATION & EVENT LISTENERS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Get filter elements
  const monthInput = document.querySelector(".monthlyRevFilter");
  const monthInput2 = document.querySelector(".monthlyRevFilter2");
  const yearInput = document.querySelector(".annualRevFilter");

  // Get current date values
  const currentMonthYear = getCurrentMonthYear();
  const currentYear = new Date().getFullYear();

  // Populate year dropdowns
  populateYearDropdown();

  // Set default values for filter inputs
  if (monthInput) monthInput.value = currentMonthYear;
  if (monthInput2) monthInput2.value = currentMonthYear;
  if (yearInput) yearInput.value = currentYear;

  // ============================================
  // INITIAL DATA FETCH
  // ============================================

  // Revenue Cards
  fetchTotalRevenue(currentMonthYear);
  fetchExpectedMonthlyRevenue(currentMonthYear);
  fetchExpectedAccruedRevenue(currentMonthYear);

  // Statistics Cards
  fetchInvoiceStatistics(currentMonthYear);

  // E-Services / Tax Summary
  fetchTaxSummary(currentMonthYear, true);

  // Average Daily Revenue
  fetchAverageDailyRevenue();
  fetchDailyRemittance()

  fetchTimeRequestCountGauge();

  // ============================================
  // EVENT LISTENERS FOR FILTERS
  // ============================================

  // Total Monthly Revenue Filter
  if (monthInput) {
    monthInput.addEventListener("change", (event) => {
      const selectedMonthYear = event.target.value;
      fetchTotalRevenue(selectedMonthYear);
      fetchExpectedMonthlyRevenue(selectedMonthYear);
      fetchExpectedAccruedRevenue(selectedMonthYear);
      fetchInvoiceStatistics(selectedMonthYear)
    });
  }

  if (monthInput2) {
    monthInput2.addEventListener("change", (event) => {
      const selectedMonthYear = event.target.value;
      fetchTaxSummary(selectedMonthYear, true);
    });
  }

  if (remittanceDateInput) {
    remittanceDateInput.addEventListener("change", (event) => {
      fetchDailyRemittance();
    });
  }

  // Show dashboard container after loading
  const dashboardContainer = document.getElementById("dashboard-container");
  if (dashboardContainer) {
    dashboardContainer.classList.remove("d-none");
  }
});

// ============================================
// EXPOSE FUNCTIONS GLOBALLY (for inline handlers)
// ============================================

// These functions are called from inline onchange handlers in HTML
window.fetchAverageDailyRevenue = fetchAverageDailyRevenue;
window.fetchTimeRequestCountGauge = fetchTimeRequestCountGauge;