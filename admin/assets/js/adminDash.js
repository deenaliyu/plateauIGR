async function fetchAnalytics() {

  let config = {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  try {
    const response = await fetch(
      `${HOST}/php/index.php?getDashboardAnalyticsAdmin`
    );

    const userAnalytics = await response.json();

    console.log(userAnalytics)

    
    $("#due_amount").html(userAnalytics.due_amount.toLocaleString())
    $("#due_invoices").html(userAnalytics.due_invoices.toLocaleString())
    $("#total_amount_invoiced").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amount_invoiced2").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amount_invoiced3").html(userAnalytics.total_amount_invoiced.toLocaleString())
    $("#total_amountP").html(userAnalytics.total_amount_paid.toLocaleString())
    $("#due_amount2").html(userAnalytics.due_amount.toLocaleString())
    $("#total_invoice").html(userAnalytics.total_invoice.toLocaleString())
    $("#total_amount").html(userAnalytics.total_invoice_paid.toLocaleString())
    $("#reg_taxP").html(userAnalytics.total_user.toLocaleString())

    let tt = parseFloat(userAnalytics.total_amount_paid);
    let ti = parseFloat(userAnalytics.total_amount_invoiced);
   
   
      total = (tt / ti) * 100;
  
  console.log(total)
  
  
   

      var chartDom = document.getElementById('Compliance');
      var myChart = echarts.init(chartDom);
      var option;
      
      option = {
        xAxis: {
          type: 'category',
          data: ['','','','','Tax performance',]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [0,0, 0, 0, total],
            type: 'line'
          }
        ]
      };
      
      option && myChart.setOption(option);
    
      // }
    
   
   
  } catch (error) {
    console.log(error)
  }


}

fetchAnalytics()



async function fetchMDAs() {

  const response = await fetch(`${HOST}/?getMDAsCount`)
  const MDAs = await response.json()
// console.log(MDAs.message[0].total)
  $("#totalMDAs").html(MDAs.message[0].total)


}

fetchMDAs()

async function fetchRevHeads() {

  const response = await fetch(`${HOST}/?getRevenueCount`)
  const MDAs = await response.json()

  $("#totalrevs").html(MDAs.message[0].total)


}

fetchRevHeads()