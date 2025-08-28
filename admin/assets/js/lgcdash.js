function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
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
        const response = await fetch(`${HOST}?getYearlyRevenueByLGC&year=${theCurrentYear}`);
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
        const response = await fetch(`${HOST}?getMonthlyRevenueByLGC`);
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
        const response = await fetch(`${HOST}?getMonthlyRevenueByLGC&sort=expected`);
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
        const response = await fetch(`${HOST}?getMonthlyRevenueByLGC&sort=expected`);
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
        const response = await fetch(`${HOST}?getMonthlyUnpaidRevenueByLGC`);
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




