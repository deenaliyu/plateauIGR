let allTinData = []

async function getTinManagements() {
  try {
    const response = await fetch(`https://plateauigr.com/php/tinGeneration/fetch.php`)
    const data = await response.json()

    $("#loader").remove()
    allTinData = data.data

    data.data.reverse().forEach((tinmngment, i) => {
      $("#showreport").append(`
        <tr>
          <td>${i + 1}</td>
          <td>${tinmngment.type}</td>
          <td>${tinmngment.type === 'corporate' ? tinmngment.organization_name : `${tinmngment.first_name} ${tinmngment.middle_name} ${tinmngment.last_name}`}</td>
          <td>${tinmngment.phone_number}</td>
          <td>${tinmngment.email}</td>
          <td>${tinmngment.state}</td>
          <td>${tinmngment.industry ? tinmngment.industry : '-'}</td>
          <td>self</td>
          <td>${new Date(tinmngment.created_at).toDateString()}</td>
          <td><a href="#viewData" data-bs-toggle="modal" onclick="viewUser(this)" data-userid="${tinmngment.id}" class="btn btn-primary btn-sm">View</a></td>
        </tr>
      `)
    });


  } catch (error) {
    console.log(error)
  }

}

getTinManagements().then(e => {
  $("#dataTable").DataTable();
})

function viewUser(e) {
  let theID = e.dataset.userid

  let theuser = allTinData.find(alluser => alluser.id === parseInt(theID))
  // console.log(theuser, theID)
  if (theuser) {
    $('#userDataID').html(`
      <tr>
        <th>Name of business</th>
        <td>${theuser.organization_name}</td>
      </tr>

      <tr>
        <th>Name</th>
        <td>${theuser.type === 'corporate' ? '-' : `${theuser.first_name} ${theuser.middle_name} ${theuser.last_name}`}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>${theuser.type}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${theuser.email}</td>
      </tr>
      <tr>
        <th>Phone</th>
        <td>${theuser.phone_number}</td>
      </tr>
      <tr>
        <th>State</th>
        <td>${theuser.state}</td>
      </tr>
      <tr>
        <th>LGA</th>
        <td>${theuser.lga}</td>
      </tr>
      <tr>
        <th>Industry</th>
        <td>${theuser.industry ? theuser.industry : '-'}</td>
      </tr>
      <tr>
        <th>Sector</th>
        <td>${theuser.sector ? theuser.sector : '-'}</td>
      </tr>
      <tr>
        <th>Created by</th>
        <td>Self</td>
      </tr>
      <tr>
        <th>Date Created</th>
        <td>${new Date(theuser.created_at).toDateString()}</td>
      </tr>
    `)
  }
}