
let theInfo = JSON.parse(localStorage.getItem("adminDataPrime"))

async function getEnumerators() {
  try {
    const response = await fetch(`${HOST}?getEnumUser`)
    const data = await response.json()
    console.log(data)

    if (data.status === 1) {
      // console.log(data)


      data.message.reverse().forEach((txpayer, i) => {
        let aaa = ``
        aaa += `
          <tr>
            <td>${i + 1}</td>
            <td>${txpayer.agent_id}</td>
            <td>${txpayer.fullname}</td>
            <td>${txpayer.email}</td>
            <td>${txpayer.phone}</td>
            <td>${txpayer.taxpayer_count}</td>
            <td id="enumEdit">
                <div class="flex items-center gap-3 updtFF">
                    <a href="viewagent.html?id=${txpayer.id}"><iconify-icon icon="material-symbols:edit-square-outline" style="font-size: 20px;"></iconify-icon></a>
                </div>   
            </td>
            <td><a href="manageagent.html?id=${txpayer.id}" class="btn btn-primary btn-sm">View</a></td>
          </tr>
        `

        $("#showEnumerators").append(aaa)
      });
    } else {



    }

  } catch (error) {
    console.log(error)
  }
}

getEnumerators().then(uu => {
  $("#dataTable").DataTable();
})


async function fetchMDAs() {

  const response = await fetch(`${HOST}/?getEnumCount`)
  const MDAs = await response.json()
  // console.log(MDAs.message[0].total)
  $("#totalField").html(MDAs.message[0].total)


}

fetchMDAs()


function calculatePercentage(number, total) {

  if (total === 0) {
    return 0;
  }

  return (number / total) * 100;
}



async function loadDashboardData() {
  try {
    const response = await fetch(`${HOST}?getEnumerationCategoryDashboard`);
    const data = await response.json();

    // 1. Display totals
    document.getElementById('theTotal').textContent = data.total_taxpayers[0].total;

    // 2. Prepare business type data
    const businessData = data.taxpayers_by_business
      .filter(item => item.business_type && item.business_type !== "" && item.business_type !== "null")
      .reduce((acc, item) => {
        const key = item.business_type.trim();
        acc[key] = (acc[key] || 0) + parseInt(item.count);
        return acc;
      }, {});

    const businessLabels = Object.keys(businessData);
    const businessValues = Object.values(businessData);

    // 3. Create business type chart (top 10)
    const top10 = businessLabels
      .map((label, i) => ({label, value: businessValues[i]}))
      .sort((a,b) => b.value - a.value)
      .slice(0,10);

    pieCharts(
      top10.map(item => item.label),
      "Top 10 Business Types",
      top10.map(item => item.value),
      "businessTypeChart"
    );

    // 4. Create taxpayer category chart
    const categoryData = data.taxpayers_by_business.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + parseInt(item.count);
      return acc;
    }, {});

    pieCharts(
      Object.keys(categoryData).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
      "Taxpayers by Category",
      Object.values(categoryData),
      "taxpayerCategoryChart"
    );

  } catch (error) {
    console.error("Dashboard error:", error);
    alert("Failed to load dashboard data");
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);


function pieCharts(labels, title, theData, theId) {
  // Check if the element exists
  const element = document.getElementById(theId);
  if (!element) {
    console.error(`Element with ID ${theId} not found`);
    return;
  }

  // Destroy previous chart instance if it exists
  if (element.chart) {
    element.chart.destroy();
  }

  const ctx = element.getContext('2d');
  
  // Generate distinct colors for each segment
  const generateColors = (count) => {
    const colors = [];
    const baseColors = [
      '#CDA545', '#EA4335', '#63B967', '#3A37D0', 
      '#7AD0C7', '#242424', '#FF9F40', '#4BC0C0',
      '#9966FF', '#FF6384', '#36A2EB', '#FFCE56'
    ];
    
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  // Create the chart
  element.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        backgroundColor: generateColors(labels.length),
        borderColor: '#fff',
        borderWidth: 1,
        data: theData
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 12,
            padding: 20,
            font: {
              size: 12
            },
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          display: false
        }
      },
      // Add animation configuration
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}