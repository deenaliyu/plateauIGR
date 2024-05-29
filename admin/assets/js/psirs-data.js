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


usersName.forEach((user, i) => {
  $("#showreport").append(`
    <tr>
      <td>${i + 1}</td>
      <td>PSIRS-${user.id}</td>
      <td>${user.tin}</td>
      <td>${user.name}</td>
      <td>
        ${user.accountStatus === "linked" ? '<span class="badge bg-success">linked</span>' : '<span class="badge bg-danger">un-linked</span>'}
      </td>
      <td>
        <div class="flex gap-3">
          <a href="psirs-datadetails.html?id=${user.id}" class="btn btn-primary btn-sm">View</a>

          ${user.accountStatus === "linked" ? `
                <button class="btn btn-primary btn-sm disabled" disabled data-bs-toggle="modal" data-bs-target="#linkUser">Link
                User</button>`:
      `<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#linkUser">Link User</button>`}
          
        </div>
      </td>
    </tr>
  `)
});


$('#dataTable').DataTable();