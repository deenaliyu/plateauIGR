const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

const enumerated = urlParams.get('enumerated')

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'NGN', // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function decodeTimestamp(timestamp) {
  // Convert the Unix timestamp to milliseconds
  let date = new Date(timestamp * 1000);
  // Format the date and time
  let formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);
  return formattedDate;
}


async function getSingleUser() {
  const response = await fetch(`https://plateauigr.com/php/?pull_old_users&id=${userIdo}&limit=1`)
  const userDatas = await response.json()

  // console.log(userDatas)
  let theUSerss = userDatas.message[0]

  $("#userInfo").html(`
    <div class="flex gap-x-2">
    <img src="./assets/img/avatars/1.png" class="h-[70px] w-[70px] object-cover rounded-full" />
    <div class="mt-2">
    <h6 class="font-bold text-[20px]">${theUSerss.name}</h6>
    <p><span class="font-bold">TIN:</span> ${theUSerss.user_tin}</p>
    </div>
    </div>
      <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
        <p><span class="font-bold">User ID:</span> PSIRS-${theUSerss.user_id}</p>
        <p><span class="font-bold">Category:</span> -</p>
        <p><span class="font-bold">State:</span> ${theUSerss.state}</p>
        <p><span class="font-bold">LGA:</span> ${theUSerss.city}</p>
        <p><span class="font-bold">Address:</span> ${theUSerss.address}</p>
        <p><span class="font-bold">Email address:</span> ${theUSerss.email}</p>
        <p><span class="font-bold">Contact:</span> ${theUSerss.phone}</p>
      </div>
  `)

}

getSingleUser()



$(".dataTable").DataTable();
// $(".dataTable2").DataTable();

async function getPaymentUser() {
  try {
    const response = await fetch(`https://plateauigr.com/php/?pull_old_payments&id=${userIdo}`)
    const userPDatas = await response.json()

    // console.log(userPDatas)
    userPDatas.message.forEach(((pDatas, i) => {
      let ruless = JSON.parse(pDatas.rules)

      $("#showPayment").append(`
        <tr>
          <td>${pDatas.name}</td>
          <td>${pDatas.user_tin}</td>
          <td>${pDatas.user_type}</td>
          <td>${ruless.description ? ruless.description : '-'}</td>
          <td>${formatMoney(pDatas.amount)}</td>
          <td>${pDatas.payment_channel}</td>
          <td><span class="badge bg-success">Paid</span></td>
          <td>${decodeTimestamp(pDatas.payment_date)}</td>
        </tr>
      `)
    }))



  } catch (error) {
    console.log(error, 'no payment data')

  }


}

getPaymentUser().then(res => {
  $('#dataTable4').DataTable();
})




function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: 'csv',
    // file name
    filename: 'report.csv'
  });
}


async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

getTaxesCateg()


async function getAnalytics() {
  try {

    const response = await fetch(`${HOST}?inAppNotification&user_id=${userIdo}`)
    const data = await response.json()
    console.log(data)
    if (data.status === 0) {
      $("#ActivityLogs").html(``)

    } else {
      // <button class="text-[#CDA545] text-[12px] underline underline-offset-1">clear</button>

      data.message.forEach((notification, i) => {
        $("#ActivityLogs").append(`
        <tr>
          <td>${notification.timeIn}</td>
          <td>${notification.comment}</td>
        </tr>
      `)

      });


    }

  } catch (error) {
    console.log(error)
  }
}

getAnalytics().then(ee => {
  $('#dataTable77').DataTable();
})
