const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

let usersName = [
  {
    "name": "Abdullahi Musa",
    "id": "PSIRS-1846",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345678",
    "lga": "Jos North",
    "TIN": "12345678-4321"
  },
  {
    "name": "Aisha Sadiq",
    "id": "PSIRS-2479",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345679",
    "lga": "Jos South",
    "TIN": "87654321-9876"
  },
  {
    "name": "Amina Hassan",
    "id": "PSIRS-3967",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345680",
    "lga": "Barkin Ladi",
    "TIN": "23456789-1234"
  },
  {
    "name": "Bello Abdullahi",
    "id": "PSIRS-5123",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345681",
    "lga": "Bassa",
    "TIN": "98765432-5678"
  },
  {
    "name": "Fatima Ibrahim",
    "id": "PSIRS-6832",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345682",
    "lga": "Bokkos",
    "TIN": "34567890-2345"
  },
  {
    "name": "Gambo Khadija",
    "id": "PSIRS-7501",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345683",
    "lga": "Jos East",
    "TIN": "45678901-3456"
  },
  {
    "name": "Hassan Nafisa",
    "id": "PSIRS-8425",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345684",
    "lga": "Kanam",
    "TIN": "56789012-4567"
  },
  {
    "name": "Hauwa Bello",
    "id": "PSIRS-9742",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345685",
    "lga": "Kanke",
    "TIN": "67890123-5678"
  },
  {
    "name": "Ibrahim Gambo",
    "id": "PSIRS-1134",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345686",
    "lga": "Langtang North",
    "TIN": "78901234-6789"
  },
  {
    "name": "Khadija Zainab",
    "id": "PSIRS-2267",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345687",
    "lga": "Langtang South",
    "TIN": "89012345-7890"
  },
  {
    "name": "Musa Amina",
    "id": "PSIRS-3198",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345688",
    "lga": "Mangu",
    "TIN": "90123456-8901"
  },
  {
    "name": "Nafisa Fatima",
    "id": "PSIRS-4231",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345689",
    "lga": "Mikang",
    "TIN": "01234567-9012"
  },
  {
    "name": "Sadiq Hauwa",
    "id": "PSIRS-5719",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345690",
    "lga": "Pankshin",
    "TIN": "12345678-0123"
  },
  {
    "name": "Zainab Abdullahi",
    "id": "PSIRS-6138",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345691",
    "lga": "Qua'an Pan",
    "TIN": "23456789-1234"
  },
  {
    "name": "Abdullahi Amina",
    "id": "PSIRS-7824",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345692",
    "lga": "Riyom",
    "TIN": "34567890-2345"
  },
  {
    "name": "Aisha Khadija",
    "id": "PSIRS-8923",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345693",
    "lga": "Shendam",
    "TIN": "45678901-3456"
  },
  {
    "name": "Amina Bello",
    "id": "PSIRS-1037",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345694",
    "lga": "Wase",
    "TIN": "56789012-4567"
  },
  {
    "name": "Bello Fatima",
    "id": "PSIRS-2045",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345695",
    "lga": "Jos North",
    "TIN": "67890123-5678"
  },
  {
    "name": "Fatima Hassan",
    "id": "PSIRS-3578",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345696",
    "lga": "Jos South",
    "TIN": "78901234-6789"
  },
  {
    "name": "Gambo Sadiq",
    "id": "PSIRS-4729",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345697",
    "lga": "Barkin Ladi",
    "TIN": "89012345-7890"
  },
  {
    "name": "Hassan Hauwa",
    "id": "PSIRS-5347",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345698",
    "lga": "Bassa",
    "TIN": "90123456-8901"
  },
  {
    "name": "Hauwa Ibrahim",
    "id": "PSIRS-6890",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345699",
    "lga": "Bokkos",
    "TIN": "01234567-9012"
  },
  {
    "name": "Ibrahim Nafisa",
    "id": "PSIRS-7204",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345700",
    "lga": "Jos East",
    "TIN": "12345678-0123"
  },
  {
    "name": "Khadija Musa",
    "id": "PSIRS-8563",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345701",
    "lga": "Kanam",
    "TIN": "23456789-1234"
  },
  {
    "name": "Musa Abdullahi",
    "id": "PSIRS-9391",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345702",
    "lga": "Kanke",
    "TIN": "34567890-2345"
  },
  {
    "name": "Nafisa Aisha",
    "id": "PSIRS-1026",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345703",
    "lga": "Langtang North",
    "TIN": "45678901-3456"
  },
  {
    "name": "Sadiq Amina",
    "id": "PSIRS-2341",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345704",
    "lga": "Langtang South",
    "TIN": "56789012-4567"
  },
  {
    "name": "Zainab Bello",
    "id": "PSIRS-3087",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345705",
    "lga": "Mangu",
    "TIN": "67890123-5678"
  },
  {
    "name": "Abdullahi Fatima",
    "id": "PSIRS-4910",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345706",
    "lga": "Mikang",
    "TIN": "78901234-6789"
  },
  {
    "name": "Aisha Gambo",
    "id": "PSIRS-5648",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345707",
    "lga": "Pankshin",
    "TIN": "89012345-7890"
  },
  {
    "name": "Amina Hassan",
    "id": "PSIRS-6735",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345708",
    "lga": "Qua'an Pan",
    "TIN": "90123456-8901"
  },
  {
    "name": "Bello Khadija",
    "id": "PSIRS-7816",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345709",
    "lga": "Riyom",
    "TIN": "01234567-9012"
  },
  {
    "name": "Fatima Musa",
    "id": "PSIRS-8902",
    "accountStatus": "linked",
    "phoneNumber": "+2347012345710",
    "lga": "Shendam",
    "TIN": "12345678-0123"
  },
  {
    "name": "Gambo Nafisa",
    "id": "PSIRS-1038",
    "accountStatus": "unlinked",
    "phoneNumber": "+2347012345711",
    "lga": "Wase",
    "TIN": "23456789-1234"
  }
]


const enumerated = urlParams.get('enumerated')
let userrrData = {}

let theUSerss = usersName.find((userIdolo => userIdolo.id === userIdo))
let theimg = "./assets/img/avatars/1.png"

$("#userInfo").html(`
    <div class="flex gap-x-2">
    <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
    <div class="mt-2">
    <h6 class="font-bold text-[20px]">${theUSerss.name}</h6>
    <p><span class="font-bold">TIN:</span> ${theUSerss.TIN}</p>
    </div>
    </div>
      
        <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
          <p><span class="font-bold">User ID:</span> ${theUSerss.id}</p>
          <p><span class="font-bold">Category:</span> -</p>
          <p><span class="font-bold">State:</span> Plateau</p>
          <p><span class="font-bold">LGA:</span> ${theUSerss.lga}</p>
          <p><span class="font-bold">Address:</span> -</p>
          <p><span class="font-bold">Email address:</span> ${theUSerss.name.replaceAll(' ', '').toLowerCase() + '@gmail.com'}</p>
          <p><span class="font-bold">Contact:</span> ${theUSerss.phoneNumber}</p>
        </div>
`)

$(".dataTable").DataTable();
// $(".dataTable2").DataTable();

$("#showPayment").append(`
  <tr>
    <td>${theUSerss.id}</td>
    <td>214240206459608</td>
    <td>Accommodation fee(all tertiary institutions)</td>
    <td>NGN 100.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>

  <tr>
    <td>${theUSerss.id}</td>
    <td>T217171481658549</td>
    <td>Development Levy	</td>
    <td>NGN 200.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>

  <tr>
    <td>${theUSerss.id}</td>
    <td>T217171481658549</td>
    <td>Withholding Tax on Rents</td>
    <td>NGN 63,000.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>
`)


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
