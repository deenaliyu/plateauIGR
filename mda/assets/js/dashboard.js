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





