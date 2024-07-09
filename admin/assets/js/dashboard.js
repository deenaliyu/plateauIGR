
$("#viewmore").on("click", function () {
  let theTextt = document.querySelector(".theText")

  if (theTextt.textContent === "View More") {
    theTextt.textContent = "See less"
  } else {
    theTextt.textContent = "View More"
  }
})

function createLineChart() {

  var chartDom = document.getElementById('Compliance');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };

  option && myChart.setOption(option);

  // }

}
createLineChart();

let monthss = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
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

// Get current date
var ThecurrentDate = new Date();
var theCurrentYear = ThecurrentDate.getFullYear();
var theCurrentMonth = ThecurrentDate.getMonth() + 1; // Months are zero-based

fillSelectOptions("selMonth", 1, 12, theCurrentMonth);

fillSelectOptions("selYear", theCurrentYear - 2, theCurrentYear + 8, theCurrentYear);

function refreshTheCards() {
  let theMonth = document.querySelector("#selMonth").value
  let theYear = document.querySelector("#selYear").value

  theCurrentYear = theYear
  theCurrentMonth = theMonth

  getMonthlyTCC()
  getMonthlyPAYE()
  getMonthlyInformalCollection()
}

async function getMonthlyTCC() {
  try {
    const response = await fetch(`${HOST}?getMonthlyTCC&year=${theCurrentYear}&month=${theCurrentMonth}`)
    const data = await response.json()

    const response2 = await fetch(`${HOST}?getMonthlyTCC&year=${theCurrentYear}`)
    const data2 = await response2.json()

    // console.log(data)
    $("#tccMonth").text(data.message[0].record_count)
    $("#tccYearly").text(data2.message[0].record_count)

  } catch (error) {
    console.log(error)
  }
}

async function getMonthlyPAYE() {
  try {
    const response = await fetch(`${HOST}?getMonthlyPAYE&year=${theCurrentYear}&month=${theCurrentMonth}`)
    const data = await response.json()

    const response2 = await fetch(`${HOST}?getMonthlyPAYE&year=${theCurrentYear}`)
    const data2 = await response2.json()

    // console.log(data, data2)
    $("#payeMonth").text(data.message[0].total_remittance ? formatMoney(data.message[0].total_remittance) : formatMoney(0))
    $("#payeYearly").text(data2.message[0].total_remittance? formatMoney(data2.message[0].total_remittance) : formatMoney(0))

  } catch (error) {
    console.log(error)
  }
}

async function getMonthlyInformalCollection() {
  try {
    const response = await fetch(`${HOST}?getMonthlyInformalCollection&year=${theCurrentYear}&month=${theCurrentMonth}`)
    const data = await response.json()

    const response2 = await fetch(`${HOST}?getMonthlyInformalCollection&year=${theCurrentYear}`)
    const data2 = await response2.json()

    // console.log(data, data2)
    $("#informalMonth").text(data.message[0].informal_collection_count ? data.message[0].informal_collection_count : 0)
    $("#informalYearly").text(data2.message[0].informal_collection_count? data2.message[0].informal_collection_count : 0)

  } catch (error) {
    console.log(error)
  }
}

$(document).ready(function () {
  getMonthlyTCC()
  getMonthlyPAYE()
  getMonthlyInformalCollection()

});
// Chart


// function createBarChart() {
//   var chartDom = document.getElementById('report-bar-chart');
//   var myChart = echarts.init(chartDom);
//   var option;

//   option = {
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'shadow'
//       }
//     },
//     color: ["#3A37D0", "#63B967", "#EC4899"],
//     legend: {},
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '3%',
//       containLabel: true
//     },
//     yAxis: {
//       type: 'value',
//       boundaryGap: [0, 0.01]
//     },
//     xAxis: {
//       type: 'category',
//       data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
//     },
//     series: [
//       {
//         name: 'Total Amount',
//         type: 'bar',
//         data: [2000, 1999, 1892, 1600, 2000, 1200]
//       },
//       {
//         name: 'Amount Paid',
//         type: 'bar',
//         data: [832, 1000, 300, 854, 1800, 392]
//       },
//       {
//         name: 'Amount Due',
//         type: 'bar',
//         data: [83, 203, 200, 90, 40, 30]
//       }
//     ]
//   };

//   option && myChart.setOption(option);
//   // let ctxb = document.getElementById('report-bar-chart').getContext("2d");
//   // let myChart = new Chart(ctxb, {
//   //   type: "bar",
//   //   data: {
//   //     labels: [
//   //       "Jan",
//   //       "Feb",
//   //       "Mar",
//   //       "Apr",
//   //       "May",
//   //       "Jun",
//   //       "Jul",
//   //       "Aug",
//   //     ],
//   //     datasets: [
//   //       {
//   //         label: "Total Anual Invoice",
//   //         barPercentage: 0.5,
//   //         barThickness: 6,
//   //         maxBarThickness: 8,
//   //         minBarLength: 2,
//   //         data: [0, 200, 250, 200, 500, 450, 850, 1050],
//   //         backgroundColor: 'rgb(0, 39, 255)',
//   //       },
//   //       {
//   //         label: "Total Anual Revenue",
//   //         barPercentage: 0.5,
//   //         barThickness: 6,
//   //         maxBarThickness: 8,
//   //         minBarLength: 2,
//   //         data: [0, 300, 400, 560, 320, 600, 720, 850],
//   //         backgroundColor: 'rgb(0, 255, 132)'
//   //       },
//   //     ],
//   //   },
//   //   options: {
//   //     maintainAspectRatio: false,
//   //     plugins: {
//   //       legend: {
//   //         labels: {
//   //           color: 'rgb(0, 0, 0)',
//   //         },
//   //       },
//   //     },
//   //     scales: {
//   //       x: {
//   //         ticks: {
//   //           font: {
//   //             size: 12,
//   //           },
//   //           color: 'rgb(0,0,0)',
//   //         },
//   //         grid: {
//   //           display: false,
//   //           drawBorder: false,
//   //         },
//   //       },
//   //       y: {
//   //         ticks: {
//   //           font: {
//   //             size: "12",
//   //           },
//   //           color: 'rgb(0, 0, 0)',
//   //           callback: function (value, index, values) {
//   //             return "$" + value;
//   //           },
//   //         },
//   //         grid: {
//   //           color: 'rgb(0, 0, 0)',
//   //           borderDash: [2, 2],
//   //           drawBorder: false,
//   //         },
//   //       },
//   //     },
//   //   },
//   // });
// }

// createBarChart();

// function createDonutChart() {

//   var chartDom = document.getElementById('donut-chart-widget');
//   var myChart = echarts.init(chartDom);
//   var option;

//   option = {
//     tooltip: {
//       trigger: 'item'
//     },
//     legend: {
//       top: '5%',
//       left: 'center',
//       position: 'right',
//       orient: 'horizontal'
//     },
//     series: [
//       {
//         name: 'Rev. Generated',
//         type: 'pie',
//         radius: ['40%', '70%'],
//         avoidLabelOverlap: false,
//         itemStyle: {
//           borderRadius: 10,
//           borderColor: '#fff',
//           borderWidth: 2
//         },
//         label: {
//           show: false,
//           position: 'right'
//         },
//         emphasis: {
//           label: {
//             show: false,
//             fontSize: 40,
//             fontWeight: 'bold'
//           }
//         },
//         labelLine: {
//           show: false
//         },
//         data: [
//           { value: 1048, name: 'AKIRS' },
//           { value: 735, name: 'Ministry of work' },
//           { value: 580, name: 'Ministry of Justice' },
//           { value: 484, name: 'AGRICULTURAL LOANS BOARD' },
//           { value: 300, name: 'Ministry of work' }
//         ]
//       }
//     ]
//   };

//   option && myChart.setOption(option);

// }

// createDonutChart();


function convertToTwoDigitsEx(number) {
  // Using padStart to add a leading zero if needed
  return String(number).padStart(2, '0');
}

function sortByDateDescendingExpired4(data) {
  return data.sort((a, b) => new Date(b.month) - new Date(a.month));
}

function getMonthNameEx4(monthValue) {
  const [year, month] = monthValue.split('-');
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}


function getYearEx4(monthValue) {
  return monthValue.split('-')[0];
}

function filterByMonthEx(monthsArray, targetMonth) {
  const result = monthsArray.find(monthData => monthData.month === targetMonth);
  return result ? result.total_expired_revenue : 0;
}

var finalp = 0;

var ThecurrentDateEx4 = new Date();
var theCurrentYearEx4 = ThecurrentDateEx4.getFullYear();
var theCurrentMonthEx4 = ThecurrentDateEx4.getMonth() + 1;

let allExpectedRevenueDataEx4 = []

function refreshTheMonth1() {
  let theMonth = document.querySelector("#theMonth").value

  let genAmount = filterByMonthEx(allExpectedRevenueDataEx4, theMonth)
  $("#percent").html(genAmount)
  console.log(genAmount)
  fetchGraph(genAmount)
}


async function totalE() {
  $("#percent").html(`
          <div class="flex mb-4">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
      `)

  try {
    const response = await fetch(`${HOST}?getPercentage`);
    const userAnalytics = await response.json();

    console.log(userAnalytics)
   
      allExpectedRevenueDataEx4 = userAnalytics
      const monthSelector = document.getElementById('theMonth');

      let theSortedData = sortByDateDescendingExpired4(userAnalytics)

      for (const monthData of theSortedData) {
        const option = document.createElement('option');
        const monthValue = monthData.month;
        const displayText = `${getMonthNameEx4(monthValue)} ${getYearEx4(monthValue)}`;

        option.value = monthValue;
        option.text = displayText;

        // Set the default selected option to the current month and year
        if (monthValue === `${theCurrentYearEx4}-${theCurrentMonthEx4}`) {
          option.selected = true;
        }

        monthSelector.add(option);
      }


      let theAmountGen = filterByMonthEx(theSortedData, `${theCurrentYearEx4}-${convertToTwoDigitsEx(theCurrentMonthEx4)}`)
      // console.log(theAmountGen, theCurrentYearEx, theCurrentMonthEx)
      console.log(theAmountGen)
      $("#percent").html(theAmountGen)
      fetchGraph(theAmountGen)


  } catch (error) {
    console.log(error)
    $("#percent").html(0)
  }
}

totalE()

console.log(finalp)

function fetchGraph(finalp) {

  let valui = parseInt(finalp)
  let value2 = valui / 100

  var chartDom = document.getElementById('gauge-graph');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'inherit'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'inherit',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'inherit',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 14,
          distance: -60,
          rotate: 'tangential',
          formatter: function (value) {
            if (value === 0.875) {
              return '100%';
            } else if (value === 0.625) {
              return '75%';
            } else if (value === 0.375) {
              return '50%';
            } else if (value === 0.125) {
              return '0%';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 14
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '';
          },
          color: 'inherit'
        },
        data: [
          {
            value: value2,
            fontSize: 14,
            name: ''
          }
        ]
      }
    ]
  };

  option && myChart.setOption(option);

}




