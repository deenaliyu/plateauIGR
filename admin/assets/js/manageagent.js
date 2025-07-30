const urlParamso = new URLSearchParams(window.location.search);

const theId = urlParamso.get('id');

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
    const response = await fetch(`${HOST}?getEnumerationSpecificAgentDashboard&id=${theId}`)
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

async function fetchUserData() {
  try {
    const response = await fetch(`${HOST}?getEnumUser=true&id=${theId}`);
    const data = await response.json();

    if (data.status === 1 && data.message.length > 0) {
      const user = data.message[0];

      document.getElementById('fullname').textContent = user.fullname;
      document.getElementById('agent-id').textContent = user.agent_id;
      document.getElementById('email').textContent = user.email;
      document.getElementById('contact').textContent = user.phone;
      document.getElementById('state').textContent = user.state;
      document.getElementById('lga').textContent = user.lga;
      document.getElementById('address').textContent = user.address;
      document.getElementById('taxpayers').textContent = user.taxpayer_count; // Replace with actual value if available

      // Optionally update avatar if your API includes a profile picture
      // document.getElementById('avatar').src = user.avatar_url;
    } else {
      console.error('No user found or invalid response');
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
  }
}

// Fetch user data after DOM loads
document.addEventListener('DOMContentLoaded', fetchUserData);

async function getTaxPayers() {
  try {
    const response = await fetch(`${HOST}?getEnumerationTaxPayerById&id=${theId}`)
    const data = await response.json()

    if (data.status === 1) {

      // console.log(data)
      data.message.reverse().forEach((txpayer, i) => {
        $("#showTaxPayers").append(`
              <tr>
                <td>${i + 1}</td>
                <td>${txpayer.tax_number}</td>
                <td>${txpayer.first_name} ${txpayer.surname}</td>
                <td>${txpayer.category}</td>
                <td>${txpayer.timeIn.split(" ")[0]}</td>
                <td>${txpayer.timeIn.split(" ")[0]}</td>
                <td><span class="badge bg-success">verified</span></td>
                <td><span class="badge bg-danger">unverified</span></td>
              </tr>
            `)
      });
    } else {
      $("#showTaxPayers").html(`
            <tr>
                <td colspan='8' class='text-center'>No Users Registered.</td>
            </tr>
        `)


    }

  } catch (error) {
    console.log(error)
    $("#showTaxPayers").html(`
            <tr>
                <td colspan='8' class='text-center'>No Users Registered.</td>
            </tr>
        `)
  }
}

getTaxPayers()