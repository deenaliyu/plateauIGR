const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

let usersName = [
  {
    "name": "Abdullahi Musa",
    "id": "PSIRS-1846",
    "accountStatus": "linked"
  },
  {
    "name": "Aisha Sadiq",
    "id": "PSIRS-2479",
    "accountStatus": "unlinked"
  },
  {
    "name": "Amina Hassan",
    "id": "PSIRS-3967",
    "accountStatus": "linked"
  },
  {
    "name": "Bello Abdullahi",
    "id": "PSIRS-5123",
    "accountStatus": "unlinked"
  },
  {
    "name": "Fatima Ibrahim",
    "id": "PSIRS-6832",
    "accountStatus": "linked"
  },
  {
    "name": "Gambo Khadija",
    "id": "PSIRS-7501",
    "accountStatus": "unlinked"
  },
  {
    "name": "Hassan Nafisa",
    "id": "PSIRS-8425",
    "accountStatus": "linked"
  },
  {
    "name": "Hauwa Bello",
    "id": "PSIRS-9742",
    "accountStatus": "unlinked"
  },
  {
    "name": "Ibrahim Gambo",
    "id": "PSIRS-1134",
    "accountStatus": "linked"
  },
  {
    "name": "Khadija Zainab",
    "id": "PSIRS-2267",
    "accountStatus": "unlinked"
  },
  {
    "name": "Musa Amina",
    "id": "PSIRS-3198",
    "accountStatus": "linked"
  },
  {
    "name": "Nafisa Fatima",
    "id": "PSIRS-4231",
    "accountStatus": "unlinked"
  },
  {
    "name": "Sadiq Hauwa",
    "id": "PSIRS-5719",
    "accountStatus": "linked"
  },
  {
    "name": "Zainab Abdullahi",
    "id": "PSIRS-6138",
    "accountStatus": "unlinked"
  },
  {
    "name": "Abdullahi Amina",
    "id": "PSIRS-7824",
    "accountStatus": "linked"
  },
  {
    "name": "Aisha Khadija",
    "id": "PSIRS-8923",
    "accountStatus": "unlinked"
  },
  {
    "name": "Amina Bello",
    "id": "PSIRS-1037",
    "accountStatus": "linked"
  },
  {
    "name": "Bello Fatima",
    "id": "PSIRS-2045",
    "accountStatus": "unlinked"
  },
  {
    "name": "Fatima Hassan",
    "id": "PSIRS-3578",
    "accountStatus": "linked"
  },
  {
    "name": "Gambo Sadiq",
    "id": "PSIRS-4729",
    "accountStatus": "unlinked"
  },
  {
    "name": "Hassan Hauwa",
    "id": "PSIRS-5347",
    "accountStatus": "linked"
  },
  {
    "name": "Hauwa Ibrahim",
    "id": "PSIRS-6890",
    "accountStatus": "unlinked"
  },
  {
    "name": "Ibrahim Nafisa",
    "id": "PSIRS-7204",
    "accountStatus": "linked"
  },
  {
    "name": "Khadija Musa",
    "id": "PSIRS-8563",
    "accountStatus": "unlinked"
  },
  {
    "name": "Musa Abdullahi",
    "id": "PSIRS-9391",
    "accountStatus": "linked"
  },
  {
    "name": "Nafisa Aisha",
    "id": "PSIRS-1026",
    "accountStatus": "unlinked"
  },
  {
    "name": "Sadiq Amina",
    "id": "PSIRS-2341",
    "accountStatus": "linked"
  },
  {
    "name": "Zainab Bello",
    "id": "PSIRS-3087",
    "accountStatus": "unlinked"
  },
  {
    "name": "Abdullahi Fatima",
    "id": "PSIRS-4910",
    "accountStatus": "linked"
  },
  {
    "name": "Aisha Gambo",
    "id": "PSIRS-5648",
    "accountStatus": "unlinked"
  },
  {
    "name": "Amina Hassan",
    "id": "PSIRS-6492",
    "accountStatus": "linked"
  },
  {
    "name": "Bello Hauwa",
    "id": "PSIRS-7034",
    "accountStatus": "unlinked"
  },
  {
    "name": "Fatima Ibrahim",
    "id": "PSIRS-8590",
    "accountStatus": "linked"
  },
  {
    "name": "Gambo Nafisa",
    "id": "PSIRS-9265",
    "accountStatus": "unlinked"
  },
  {
    "name": "Hassan Zainab",
    "id": "PSIRS-1013",
    "accountStatus": "linked"
  },
  {
    "name": "Hauwa Abdullahi",
    "id": "PSIRS-2149",
    "accountStatus": "unlinked"
  },
  {
    "name": "Ibrahim Aisha",
    "id": "PSIRS-3985",
    "accountStatus": "linked"
  },
  {
    "name": "Khadija Amina",
    "id": "PSIRS-4750",
    "accountStatus": "unlinked"
  },
  {
    "name": "Musa Bello",
    "id": "PSIRS-5438",
    "accountStatus": "linked"
  },
  {
    "name": "Nafisa Fatima",
    "id": "PSIRS-6731",
    "accountStatus": "unlinked"
  },
  {
    "name": "Sadiq Gambo",
    "id": "PSIRS-7085",
    "accountStatus": "linked"
  },
  {
    "name": "Zainab Hassan",
    "id": "PSIRS-8903",
    "accountStatus": "unlinked"
  },
  {
    "name": "Abdullahi Hauwa",
    "id": "PSIRS-9327",
    "accountStatus": "linked"
  },
  {
    "name": "Aisha Ibrahim",
    "id": "PSIRS-1078",
    "accountStatus": "unlinked"
  },
  {
    "name": "Amina Nafisa",
    "id": "PSIRS-2041",
    "accountStatus": "linked"
  },
  {
    "name": "Bello Musa",
    "id": "PSIRS-3815",
    "accountStatus": "unlinked"
  },
  {
    "name": "Fatima Abdullahi",
    "id": "PSIRS-4630",
    "accountStatus": "linked"
  },
  {
    "name": "Gambo Aisha",
    "id": "PSIRS-5984",
    "accountStatus": "unlinked"
  },
  {
    "name": "Hassan Amina",
    "id": "PSIRS-6432",
    "accountStatus": "linked"
  },
  {
    "name": "Hauwa Bello",
    "id": "PSIRS-7601",
    "accountStatus": "unlinked"
  },
  {
    "name": "Ibrahim Fatima",
    "id": "PSIRS-8236",
    "accountStatus": "linked"
  },
  {
    "name": "Khadija Gambo",
    "id": "PSIRS-9112",
    "accountStatus": "unlinked"
  },
  {
    "name": "Musa Hassan",
    "id": "PSIRS-1089",
    "accountStatus": "linked"
  },
  {
    "name": "Nafisa Hauwa",
    "id": "PSIRS-2935",
    "accountStatus": "unlinked"
  },
  {
    "name": "Sadiq Ibrahim",
    "id": "PSIRS-3517",
    "accountStatus": "linked"
  },
  {
    "name": "Zainab Nafisa",
    "id": "PSIRS-4786",
    "accountStatus": "unlinked"
  },
  {
    "name": "Abdullahi Zainab",
    "id": "PSIRS-5034",
    "accountStatus": "linked"
  },
  {
    "name": "Aisha Abdullahi",
    "id": "PSIRS-6795",
    "accountStatus": "unlinked"
  },
  {
    "name": "Amina Aisha",
    "id": "PSIRS-7041",
    "accountStatus": "linked"
  },
  {
    "name": "Emmanuel John",
    "id": "PSIRS-4831",
    "accountStatus": "linked"
  },
  {
    "name": "Blessing Grace",
    "id": "PSIRS-2395",
    "accountStatus": "unlinked"
  },
  {
    "name": "Joseph Peter",
    "id": "PSIRS-4927",
    "accountStatus": "linked"
  },
  {
    "name": "Esther Faith",
    "id": "PSIRS-8541",
    "accountStatus": "unlinked"
  },
  {
    "name": "Gabriel Paul",
    "id": "PSIRS-7392",
    "accountStatus": "linked"
  },
  {
    "name": "Joyce Mary",
    "id": "PSIRS-6745",
    "accountStatus": "unlinked"
  },
  {
    "name": "Samuel David",
    "id": "PSIRS-1238",
    "accountStatus": "linked"
  },
  {
    "name": "Ruth Elizabeth",
    "id": "PSIRS-9871",
    "accountStatus": "unlinked"
  },
  {
    "name": "Daniel Matthew",
    "id": "PSIRS-2549",
    "accountStatus": "linked"
  },
  {
    "name": "Hannah Deborah",
    "id": "PSIRS-6410",
    "accountStatus": "unlinked"
  },
  {
    "name": "Joshua James",
    "id": "PSIRS-7829",
    "accountStatus": "linked"
  },
  {
    "name": "Victoria Patience",
    "id": "PSIRS-3147",
    "accountStatus": "unlinked"
  },
  {
    "name": "Andrew Philip",
    "id": "PSIRS-5694",
    "accountStatus": "linked"
  },
  {
    "name": "Dorcas Comfort",
    "id": "PSIRS-6230",
    "accountStatus": "unlinked"
  },
  {
    "name": "Caleb Simon",
    "id": "PSIRS-3105",
    "accountStatus": "linked"
  },
  {
    "name": "Naomi Rachel",
    "id": "PSIRS-4816",
    "accountStatus": "unlinked"
  },
  {
    "name": "Michael Stephen",
    "id": "PSIRS-7293",
    "accountStatus": "linked"
  },
  {
    "name": "Sarah Angela",
    "id": "PSIRS-8245",
    "accountStatus": "unlinked"
  },
  {
    "name": "Isaac Timothy",
    "id": "PSIRS-1567",
    "accountStatus": "linked"
  },
  {
    "name": "Grace Rebecca",
    "id": "PSIRS-2749",
    "accountStatus": "unlinked"
  },
  {
    "name": "Ezekiel Henry",
    "id": "PSIRS-3834",
    "accountStatus": "linked"
  },
  {
    "name": "Miriam Lydia",
    "id": "PSIRS-5921",
    "accountStatus": "unlinked"
  },
  {
    "name": "Paul Mark",
    "id": "PSIRS-6238",
    "accountStatus": "linked"
  },
  {
    "name": "Charity Esther",
    "id": "PSIRS-7452",
    "accountStatus": "unlinked"
  },
  {
    "name": "Simon Christopher",
    "id": "PSIRS-8593",
    "accountStatus": "linked"
  },
  {
    "name": "Peace Judith",
    "id": "PSIRS-9218",
    "accountStatus": "unlinked"
  },
  {
    "name": "David Thomas",
    "id": "PSIRS-1279",
    "accountStatus": "linked"
  },
  {
    "name": "Angela Hope",
    "id": "PSIRS-3761",
    "accountStatus": "unlinked"
  },
  {
    "name": "Benjamin John",
    "id": "PSIRS-4827",
    "accountStatus": "linked"
  },
  {
    "name": "Evelyn Blessing",
    "id": "PSIRS-6491",
    "accountStatus": "unlinked"
  },
  {
    "name": "Philip Joseph",
    "id": "PSIRS-7582",
    "accountStatus": "linked"
  },
  {
    "name": "Martha Hannah",
    "id": "PSIRS-8349",
    "accountStatus": "unlinked"
  },
  {
    "name": "Nathaniel Peter",
    "id": "PSIRS-9312",
    "accountStatus": "linked"
  },
  {
    "name": "Mercy Faith",
    "id": "PSIRS-1054",
    "accountStatus": "unlinked"
  },
  {
    "name": "Jonathan Gabriel",
    "id": "PSIRS-2971",
    "accountStatus": "linked"
  },
  {
    "name": "Rebecca Mary",
    "id": "PSIRS-3568",
    "accountStatus": "unlinked"
  },
  {
    "name": "Stephen Samuel",
    "id": "PSIRS-4197",
    "accountStatus": "linked"
  },
  {
    "name": "Patience Ruth",
    "id": "PSIRS-5263",
    "accountStatus": "unlinked"
  },
  {
    "name": "Mark Daniel",
    "id": "PSIRS-6782",
    "accountStatus": "linked"
  },
  {
    "name": "Comfort Victoria",
    "id": "PSIRS-7384",
    "accountStatus": "unlinked"
  },
  {
    "name": "Timothy Joshua",
    "id": "PSIRS-8597",
    "accountStatus": "linked"
  },
  {
    "name": "Lydia Dorcas",
    "id": "PSIRS-9104",
    "accountStatus": "unlinked"
  },
  {
    "name": "Henry Andrew",
    "id": "PSIRS-1258",
    "accountStatus": "linked"
  },
  {
    "name": "Rachel Naomi",
    "id": "PSIRS-2890",
    "accountStatus": "unlinked"
  },
  {
    "name": "Thomas Michael",
    "id": "PSIRS-3476",
    "accountStatus": "linked"
  },
  {
    "name": "Angela Sarah",
    "id": "PSIRS-4912",
    "accountStatus": "unlinked"
  },
  {
    "name": "Samuel Isaac",
    "id": "PSIRS-5378",
    "accountStatus": "linked"
  },
  {
    "name": "Rebecca Grace",
    "id": "PSIRS-6821",
    "accountStatus": "unlinked"
  },
  {
    "name": "Christopher Ezekiel",
    "id": "PSIRS-7309",
    "accountStatus": "linked"
  },
  {
    "name": "Esther Miriam",
    "id": "PSIRS-8546",
    "accountStatus": "unlinked"
  },
  {
    "name": "John Paul",
    "id": "PSIRS-9632",
    "accountStatus": "linked"
  },
  {
    "name": "Hope Charity",
    "id": "PSIRS-1759",
    "accountStatus": "unlinked"
  },
  {
    "name": "Peter Simon",
    "id": "PSIRS-2874",
    "accountStatus": "linked"
  },
  {
    "name": "Judith Peace",
    "id": "PSIRS-3521",
    "accountStatus": "unlinked"
  },
  {
    "name": "Thomas David",
    "id": "PSIRS-4639",
    "accountStatus": "linked"
  },
  {
    "name": "Mary Angela",
    "id": "PSIRS-5231",
    "accountStatus": "unlinked"
  },
  {
    "name": "John Benjamin",
    "id": "PSIRS-6048",
    "accountStatus": "linked"
  },
  {
    "name": "Faith Evelyn",
    "id": "PSIRS-7189",
    "accountStatus": "unlinked"
  },
  {
    "name": "Joseph Philip",
    "id": "PSIRS-8745",
    "accountStatus": "linked"
  },
  {
    "name": "Hannah Martha",
    "id": "PSIRS-9315",
    "accountStatus": "unlinked"
  },
  {
    "name": "Peter Nathaniel",
    "id": "PSIRS-1042",
    "accountStatus": "linked"
  },
  {
    "name": "Faith Mercy",
    "id": "PSIRS-2357",
    "accountStatus": "unlinked"
  },
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
    <p><span class="font-bold">TIN:</span> 9084587323</p>
    </div>
    </div>
      
        <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
          <p><span class="font-bold">Category:</span> Individual</p>
          <p><span class="font-bold">State:</span> Plateau</p>
          <p><span class="font-bold">LGA:</span> Wase</p>
          <p><span class="font-bold">Address:</span> -</p>
          <p><span class="font-bold">Email address:</span> ${theUSerss.name.replaceAll(' ', '').toLowerCase() + '@gmail.com'}</p>
          <p><span class="font-bold">Contact:</span> 0908745232</p>
          <p><span class="font-bold">Tax Number:</span> ${theUSerss.id}</p>
        </div>
`)

$(".dataTable").DataTable();
$(".dataTable2").DataTable();


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
