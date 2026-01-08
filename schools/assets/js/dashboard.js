let THEUSERINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


function convertToPercentage(number, total) {
  var percentage = (number / total) * 100;
  return percentage.toFixed(2); // Round the percentage to two decimal places
}

async function taxpayerDistributionbyTin() {
  try {
    const response = await fetch(`${HOST}/?enumeratorTinAnalysis&enumerator=${THEUSERINFO?.id}`)
    const taxpayerDistribution = await response.json()


    // $("#totalTinYes").html(taxpayerDistribution.total_tin_yes);
    // $("#totalTinNo").html(taxpayerDistribution.total_tin_no);

    // Plot the pie chart
    plotTinDistributionGraph(taxpayerDistribution);

  } catch (error) {
    console.log('Error fetching TIN analysis ', error)
    // $("#totalTinYes").html("0");
    // $("#totalTinNo").html("0");
  }

}

taxpayerDistributionbyTin()

function plotTinDistributionGraph(data) {
  var chartDom = document.getElementById('tinDistributionTaxpayer');
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
        name: 'Taxpayer Distribution by TIN',
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
          { value: data.total_tin_yes, name: 'With TIN', itemStyle: { color: '#4caf50' } },
          { value: data.total_tin_no, name: 'Without TIN', itemStyle: { color: '#f44336' } }
        ]
      }
    ]
  };

  option && myChart.setOption(option);
}

function plotGraph(theDattaa) {
  var chartDom = document.getElementById('dashbordChart');
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
        name: '% Of Registered Tax payers',
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
        data: theDattaa
      }
    ]
  };

  option && myChart.setOption(option);
}


let categData
let monthData

async function getAnalytics() {
  try {
    const response = await fetch(`${HOST}?getHealthcareEnumerationDashboard&id=${THEUSERINFO.id}`)
    const data = await response.json()

    $("#totalRegis").html(data[0][0].total_users)

    let theTotal = data[0][0].total_users
    categData = data[1]
    monthData = data[2]

    categData.forEach(categ => {
      $("#categgg").append(`
        <option value="${categ.account_type}">${categ.account_type}</option>
      `)
    });
    $("#totalRegCateg").html(data[1][0].total_users)

    monthData.forEach((categ, i) => {
      $("#categgg2").append(`
        <option value="${categ.registration_month}">${months[parseInt(categ.registration_month) - 1]}</option>
      `)
    });
    $("#totalRegCategRege").html(data[2][0].total_users)

    let theDat = []
    let theDaaa = ["Individual", "Corporate", "Properties"]

    categData.forEach(cate => {
      theDat.push({ value: convertToPercentage(cate.total_users, theTotal), name: cate.account_type })
    })

    plotGraph(theDat)

  } catch (error) {
    console.log(error)
  }
}

getAnalytics()

function fetchCateg(e) {
  let theVal = e.value
  let theData = categData.find(dd => dd.account_type === theVal)

  if (theData) {
    $("#totalRegCateg").html(theData.total_users)
  }

}

function fetchCateg2(e) {
  let theVal = e.value
  let theData = monthData.find(dd => dd.registration_month === theVal)

  if (theData) {
    $("#totalRegCategRege").html(theData.total_users)
  }

}