let USERINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));


async function getTaxPayers() {
  try {
    const response = await fetch(`${HOST}?getEnumerationTaxPayerById&id=${USERINFO.id}`)
    const data = await response.json()

    if (data.status === 1) {

      console.log(data)
      data.message.reverse().forEach((txpayer, i) => {
        $("#showTaxPayers").append(`
          <tr>
            <td>${i + 1}</td>
            <td>${txpayer.tax_number}</td>
            <td>${txpayer.first_name} ${txpayer.surname}</td>
            <td>${txpayer.email}</td>
            <td>${txpayer.phone}</td>
            <td>${txpayer.category}</td>
            <td>${txpayer.timeIn.split(" ")[0]}</td>
            <td><span class="badge bg-success">verified</span></td>
            <td><span class="badge bg-danger">unverified</span></td>
            <td><a class="btn btn-primary btn-sm" href="taxpayerlist.html?id=${txpayer.tax_number}">View</a></td>
          </tr>
        `)
      });
    } else {



    }

  } catch (error) {
    console.log(error)
  }
}

getTaxPayers().then(uu => {
  $("#dataTable").DataTable();
})