let USER_SESSION = localStorage.getItem("MDAINFO");
let finalUSER_SESSION = JSON.parse(USER_SESSION);
let mdaID = finalUSER_SESSION.fullname;

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function getDailyRemittance(date) {

  $.ajax({
    url: `${HOST}?getDailyRemittance&mda_id=${mdaID}`, // Replace with the actual path
    type: 'GET',
    data: { date: date },
    dataType: 'json',
    success: function (response) {
      if (response.status === 1) {
        const data = response.message[0];
        $('#numberOfdailyRemittance').html(data.total_daily_remittances.toLocaleString());
        $('#amountOfdailyRemittance').html(formatMoney(parseFloat(data.total_daily_amount)));
      } else {
        // console.log('No data found for today');
        $('#numberOfdailyRemittance').html(0);
        $('#amountOfdailyRemittance').html(formatMoney(parseFloat(0)));
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX Error:', status, error);
      $('#numberOfdailyRemittance').html(0);
      $('#amountOfdailyRemittance').html(formatMoney(parseFloat(0)));
    }
  });

}

$("#dateFilter").val(new Date().toISOString().split('T')[0])

$('#dateFilter').on('change', function () {
  $('#numberOfdailyRemittance').html(`<div class="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>`);
  $('#amountOfdailyRemittance').html(`<div class="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>`);
  getDailyRemittance($(this).val());
});

getDailyRemittance(new Date().toISOString().split('T')[0])

async function fetchPayment() {
  $("#recentPayment").html("");
  $("#loader").css("display", "flex");

  const response = await fetch(
    `${HOST}/php/index.php?getPaymentByMda&mda_name=${mdaID}`
  );
  const paymentHistory = await response.json();
  console.log(paymentHistory);
  $("#loader").css("display", "none");
  if (paymentHistory.status === 1) {

    paymentHistory.message.forEach((payment, i) => {
      const userInvoice = paymentHistory.message[i];
      var date = new Date(payment.timeIn);
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);

      var formattedDate = year + '-' + month + '-' + day;
      $("#recentPayment").append(`
          <tr>
          <td>${payment.first_name} ${payment.surname} </td>
          <td>${payment.COL_4} </td>
          <td>&#8358;${payment.amount_paid} </td>
          <td>${formattedDate}</td>
          </tr>
          `);

    })

  } else {
    $("#dataTable").DataTable();
  }
}

fetchPayment().then(yy => {
  $("#dataTable").DataTable()
});

let ttRem = null
let totalInv = null

async function getDashboardAnalyticsAdmin() {

  const response = await fetch(`${HOST}/php/index.php?dashboardAnalyticsMda&id=${mdaID}`);
  const dashboardAnalytics = await response.json();

  const tttt = document.getElementById("dashboardPie")

  $("#totalInv").html(dashboardAnalytics.total_invoice.toLocaleString())
  $("#totalRem").html("₦" + dashboardAnalytics.total_amount_paid.toLocaleString())



  var chartDom = document.getElementById('dashboardPie');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Total Remitance',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },

        labelLine: {
          show: false
        },
        data: [
          { value: dashboardAnalytics.total_amount_invoiced, name: 'Total Amount Invoiced' },
          { value: dashboardAnalytics.total_amount_paid, name: 'Total Amount Paid' },
          { value: dashboardAnalytics.due_invoices, },
          { value: dashboardAnalytics.due_amount, },
        ]
      }
    ]
  };


  option && myChart.setOption(option);

  fetchInvoicess(dashboardAnalytics.total_amount_paid)
}

getDashboardAnalyticsAdmin();

async function fetchInvoicess(dash) {
  const response = await fetch(
    `${HOST}/php/index.php?AllInvoices`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {
    let theMDAInv = userInvoices.message.filter(inv => inv.COL_3 === mdaID)
    // $("#totalInv").html(theMDAInv.length)
    // totalInv = theMDAInv.length

    var chartDom = document.getElementById('dashboardPi');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Total Remitance',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },

          labelLine: {
            show: false
          },
          data: [
            { value: theMDAInv.length, name: 'Total Invoices' },
            { value: dash, name: 'Total Remittance' }
          ]
        }
      ]
    };

    option && myChart.setOption(option);

  } else {

  }
}


function convertToTwoDigits(number) {
    // Using padStart to add a leading zero if needed
    return String(number).padStart(2, '0');
}

function sortByDateDescending(data) {
    return data.sort((a, b) => new Date(b.month) - new Date(a.month));
}

function fillSelectOptions(selectId, start, end, selectedValue) {
  var select = document.getElementById(selectId);

  for (var i = start; i <= end; i++) {
    var option = document.createElement("option");
    option.value = i;
    if (selectId === "selMonth") {
      option.text = monthss[i - 1];
    } else {
      option.text = i;
    }

    if (i === selectedValue) {
      option.selected = true;
    }
    select.add(option);
  }
}

var ThecurrentDate = new Date();
var theCurrentYear = ThecurrentDate.getFullYear();
var theCurrentMonth = ThecurrentDate.getMonth() + 1;

fillSelectOptions("annualYear", 2023, theCurrentYear + 8, theCurrentYear);

function refreshTheCards() {
//   let theMonth = document.querySelector("#selMonth").value
  let theYear = document.querySelector("#annualYear").value

  theCurrentYear = theYear
//   theCurrentMonth = theMonth
  getYearlyRevenue()
 
}

$("#annualYear").on('change', function () {
  let theYear = document.querySelector("#annualYear").value

  theCurrentYear = theYear
  //   theCurrentMonth = theMonth
  getYearlyRevenue()
})

async function getYearlyRevenue() {
    $("#total_amount_invoiced2").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getYearlyRevenueByMda&year=${theCurrentYear}&mda_id=${mdaID}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#total_amount_invoiced2").html(0)
        } else {
            let theAmountGen = userAnalytics.message[0].total_annual_revenue
            $("#total_amount_invoiced2").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#total_amount_invoiced2").html(0)
    }
}

getYearlyRevenue()

function getMonthName(monthValue) {
    const [year, month] = monthValue.split('-');
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return monthName;
}


function getYear(monthValue) {
    return monthValue.split('-')[0];
}

function filterByMonth(monthsArray, targetMonth) {
    const result = monthsArray.find(monthData => monthData.month === targetMonth);
    return result ? result.total_monthly_revenue : 0;
}

function filterByMonth2(monthsArray, targetMonth) {
    const result = monthsArray.find(monthData => monthData.month === targetMonth);
    return result ? result.total_unpaid_revenue : 0;
}

let allRevenueData = []

function refreshTheCards2() {
    let theMonth = document.querySelector("#monthlyYear").value
    
    let genAmount = filterByMonth(allRevenueData, theMonth)
    $("#total_amount_invoiced").html(formatMoney(genAmount))
}
async function getMonthlyRevenue() {
    $("#total_amount_invoiced").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyRevenueByMda&mda_id=${mdaID}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#total_amount_invoiced").html(0)
        } else {
            allRevenueData = userAnalytics.message
            const monthSelector = document.getElementById('monthlyYear');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
    
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            // console.log(theCurrentMonth)
            $("#total_amount_invoiced").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#total_amount_invoiced").html(0)
    }
}

getMonthlyRevenue()

// getExpectedMonthlyRevenue 
let allExpectedRevenueData = []

function refreshTheCards3() {
    let theMonth = document.querySelector("#monthlyYear2").value
    
    let genAmount = filterByMonth(allExpectedRevenueData, theMonth)
    $("#due_amount").html(formatMoney(genAmount))
}

async function getExpectedMonthlyRevenue() {
    $("#due_amount").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyRevenueByMda&sort=expected&mda_id=${mdaID}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#due_amount").html(0)
        } else {
            allExpectedRevenueData = userAnalytics.message
            const monthSelector = document.getElementById('monthlyYear2');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
    
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            $("#due_amount").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#due_amount").html(0)
    }
}

// getExpectedMonthlyRevenue()

// get Total Revenue 
let allExpectedRevenueDatattl = []

function refreshTheCardsttl() {
    let theMonth = document.querySelector("#monthlyYear2ttl").value
    
    let genAmount = filterByMonth(allExpectedRevenueDatattl, theMonth)
    $("#due_amountttl").html(formatMoney(genAmount))
}

async function getExpectedMonthlyRevenuettl() {
    $("#due_amountttl").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyRevenueByMda&sort=expected&mda_id=${mdaID}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.message.length === 0) {
            $("#due_amountttl").html(0)
        } else {
            
            allExpectedRevenueDatattl.push(...userAnalytics.message)
            const monthSelector = document.getElementById('monthlyYear2ttl');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
    
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            $("#due_amountttl").html(formatMoney(theAmountGen))
        }
        

   
    } catch (error) {
        console.log(error)
        $("#due_amountttl").html(0)
    }
}

getExpectedMonthlyRevenuettl()


// getAccrued Revenue Data 
let allAccruedData = []

function refreshTheCardsAcr() {
    let theMonth = document.querySelector("#accruedRev").value
    
    let genAmount = filterByMonth2(allAccruedData, theMonth)
    $("#accruedRevText").html(formatMoney(genAmount))
}

async function getAccruedData() {
    $("#accruedRevText").html(`
        <div class="flex mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
    `)
    
    try {
        const response = await fetch(`${HOST}?getMonthlyUnpaidRevenueByMda&mda_id=${mdaID}`);
        const userAnalytics = await response.json();
        
        // console.log(userAnalytics)
        if(userAnalytics.status === 0) {
            $("#accruedRevText").html(0)
        } else {
            allAccruedData = userAnalytics.message
            const monthSelector = document.getElementById('accruedRev');
            
            let theSortedData = sortByDateDescending(userAnalytics.message)
            
            for (const monthData of theSortedData) {
                const option = document.createElement('option');
                const monthValue = monthData.month;
                const displayText = `${getMonthName(monthValue)} ${getYear(monthValue)}`;
    
                option.value = monthValue;
                option.text = displayText;
    
                // Set the default selected option to the current month and year
                if (monthValue === `${theCurrentYear}-${theCurrentMonth}`) {
                    option.selected = true;
                }
                monthSelector.add(option);
            }
            
            
            let theAmountGen = filterByMonth2(theSortedData, `${theCurrentYear}-${convertToTwoDigits(theCurrentMonth)}`)
            // console.log(theSortedData,theCurrentYear,theCurrentMonth)
            $("#accruedRevText").html(formatMoney(theAmountGen))
        }

    } catch (error) {
        console.log(error)
        $("#accruedRevText").html(0)
    }
}

getAccruedData()




