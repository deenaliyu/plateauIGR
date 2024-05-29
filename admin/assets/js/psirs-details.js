const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

let usersName = [
  {
    "id": 390164,
    "name": "JOSEPH IYANYA",
    "tin": "23000043-7",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390165,
    "name": "IORLAHA AHANGBA ISAAC",
    "tin": "23205021-59",
    "accountStatus": "unlinked",
    "phoneNumber": "7034372015",
    "lga": "909",
    "address": "UKADUM MAZA ROAD, JOS NORTH"
  },
  {
    "id": 390166,
    "name": "ADANU SUNDAY SIMON",
    "tin": "23200970-58",
    "accountStatus": "linked",
    "phoneNumber": "8036197944",
    "lga": "1239",
    "address": "NURTW FANDA KARSHI"
  },
  {
    "id": 390167,
    "name": "DANIEL OKACHI",
    "tin": "23000028-57",
    "accountStatus": "linked",
    "phoneNumber": "8164145770",
    "lga": "954",
    "address": "N/A"
  },
  {
    "id": 390168,
    "name": "LUCIE-ANN M LAHA",
    "tin": "23000044-2",
    "accountStatus": "unlinked",
    "phoneNumber": "8039668212",
    "lga": "897",
    "address": "SABON BARKI, JOS SOUTH"
  },
  {
    "id": 390169,
    "name": "Mr. Emmauel O Agha",
    "tin": "23000040-8",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390171,
    "name": "RAPHEAL ASIEGBU",
    "tin": "23000040-9",
    "accountStatus": "unlinked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390172,
    "name": "daniel asabe mattah",
    "tin": "23000041-2",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390173,
    "name": "ZUMUNTAN MATA EKLISIYA COCIN LCC SARKIN MANGU",
    "tin": "23205372-48",
    "accountStatus": "linked",
    "phoneNumber": "8035701158",
    "lga": "1431",
    "address": "MANGU"
  },
  {
    "id": 390174,
    "name": "JEROBOAM JEBULOL",
    "tin": "23000040-2",
    "accountStatus": "unlinked",
    "phoneNumber": "8105883615",
    "lga": "1056",
    "address": "N/A"
  },
  {
    "id": 390175,
    "name": "RABI'ATA YUSUF",
    "tin": "23000041-8",
    "accountStatus": "linked",
    "phoneNumber": "7036832030",
    "lga": "871",
    "address": "RIKKOS, NEAR NDLEA OFFICE"
  },
  {
    "id": 390176,
    "name": "HYELDUGAL NIGERIA LIMITED",
    "tin": "23000043-0",
    "accountStatus": "unlinked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
]

const enumerated = urlParams.get('enumerated')
let userrrData = {}

let theUSerss = usersName.find((userIdolo => userIdolo.id === parseInt(userIdo)))

let theimg = "./assets/img/avatars/1.png"

$("#userInfo").html(`
    <div class="flex gap-x-2">
    <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
    <div class="mt-2">
    <h6 class="font-bold text-[20px]">${theUSerss.name}</h6>
    <p><span class="font-bold">TIN:</span> ${theUSerss.tin}</p>
    </div>
    </div>
      
        <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
          <p><span class="font-bold">User ID:</span> PSIRS-${theUSerss.id}</p>
          <p><span class="font-bold">Category:</span> -</p>
          <p><span class="font-bold">State:</span> Plateau</p>
          <p><span class="font-bold">LGA:</span> ${theUSerss.lga}</p>
          <p><span class="font-bold">Address:</span> ${theUSerss.address}</p>
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
