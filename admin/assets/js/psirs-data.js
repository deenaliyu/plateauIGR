async function getMigratedDataAnalytics() {
  try {
    const response = await fetch(`https://plateauigr.com/php/?getMigratedDataAnalytics`)
    const getMigrated = await response.json()

    $('#totalNumb').html(getMigrated.total_data_migrated.toLocaleString())
    $('#totalLinked').html(getMigrated.total_data_linked.toLocaleString())
    $('#totalNotLinked').html(getMigrated.total_data_unlinked.toLocaleString())

  } catch (error) {
    console.log(error)
  }
}

getMigratedDataAnalytics()

async function fetchAllData() {
  const apiUrl = 'https://plateauigr.com/php/?pull_old_users&limit=';
  let totalRecords = 0;

  $("#showreport").html('')
  $("#loader").css('display', 'flex')

  fetchTotalRecords().then(total => {
    totalRecords = total;
    createPagination(totalRecords);
    fetchData(1); // Fetch initial data for page 1
  });

  function fetchTotalRecords() {
    return fetch(apiUrl + '1')
      .then(response => response.json())
      .then(data => {
        return { dataLenth: data.length, total: data.message.length }
      }) // Assuming length represents the total records
      .catch(error => console.error('Error fetching total records:', error));
  }

  function fetchData(page) {
    $("#showreport").html('')
    $("#loader").css('display', 'flex')
    fetch(apiUrl + page)
      .then(response => response.json())
      .then(data => displayData(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }

  function displayData(data) {
    $("#loader").css('display', 'none')
    const tbody = document.querySelector('#showreport');
    tbody.innerHTML = '';
    data.forEach((item, i) => {
      const row = `<tr>
        <td>${i + 1}</td>
        <td>PSIRS-${item.user_id}</td>
        <td>${item.user_tin}</td>
        <td>${item.name}</td>
        <td>
        ${item.status === "Unlinked" ? '<span class="badge bg-danger">un-linked</span>' : '<span class="badge bg-success">linked</span>'}
          
        </td>
        <td>
          <div class="flex gap-3">
            <a href="psirs-datadetails.html?id=${item.user_tin}" class="btn btn-primary btn-sm">View</a>
            <button class="btn btn-primary btn-sm" data-usertin="${item.user_tin}" onclick='openLinkUser(this)' data-bs-toggle="modal" data-bs-target="#linkUser">Link User</button>       
          </div>
        </td>
      </tr>
    `;
      tbody.innerHTML += row;

      $("#showreport2").append(`
        <tr>
          <td>${i + 1}</td>
          <td>PSIRS-${item.user_id}</td>
          <td>${item.user_tin}</td>
          <td>${item.name.replace(/,/g, '')}</td>
          <td>${item.user_type}</td>
          <td>${item.email}</td>
          <td>${item.phone?.replace(/,/g, '')}</td>
          <td>${item.city?.replace(/,/g, '')}</td>
          <td>${item.address?.replace(/,/g, '')}</td>
          <td>${item.status}</td>
        </tr>
      `)
    });
  }

  function createPagination(totalRecords) {
    const pagination = document.getElementById('pagination');
    // console.log(totalRecords)
    let numberOfPagination = totalRecords.dataLenth / totalRecords.total
    $("#showing").html(`Showing 1 to ${totalRecords.total} of ${totalRecords.dataLenth.toLocaleString()} entries`)
    $("#paging").html('Page 1')

    for (let i = 1; i <= numberOfPagination; i++) {
      const li = document.createElement('li');
      li.textContent = i;
      li.addEventListener('click', () => {
        fetchData(i);
        document.querySelectorAll('.pagination li').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        $("#showing").html(`Showing ${i * 100} to ${(i + 1) * 100} of ${totalRecords.dataLenth.toLocaleString()} entries`)
        $("#paging").html(`Page ${i}`)
      });
      if (i === 1) li.classList.add('active'); // Mark the first page as active
      pagination.appendChild(li);
    }
  }
}

fetchAllData()



// USER LINKING 

function openLinkUser(e) {
  let theTin = e.dataset.usertin
  console.log(theTin)
  sessionStorage.setItem('thelinkingusertin', theTin)
}

$("#linkTheUser").on('click', function () {
  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#linkTheUser").addClass("hidden")

  let theTin = sessionStorage.getItem('thelinkingusertin')
  let thePLID = document.querySelector('#theUserPlid').value

  $.ajax({
    type: "GET",
    url: `https://plateauigr.com/php/?linkUser&oldtin=${theTin}&newtin=${thePLID}`,
    dataType: "json",
    success: function (data) {
      // console.log(data)

      if (data.status === 1) {
        $("#msg_box2").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#linkTheUser").removeClass("hidden")

        setTimeout(() => {
          $("#linkUser").modal("hide")
        }, 1000);


      } else {
        $("#msg_box2").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again !</p>
      `)
        $("#linkTheUser").removeClass("hidden")


      }
    },
    error: function (request, error) {
      $("#msg_box2").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again !</p>
      `)
      $("#linkTheUser").removeClass("hidden")
      console.log(error);
    }
  });

})

$("#searchBtn").on('click', async function () {
  let theValue = document.querySelector("#searchInpt").value

  if (theValue === "") {
    // alert()
  } else {
    // console.log(theValue)

    $('#searchBtn').html(`
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
    `)

    try {
      const response = await fetch(`https://plateauigr.com/php/?searchOldData&value=${theValue}`)
      const gettSearchedData = await response.json()

      $("#showreport").html('')

      gettSearchedData.forEach((searched, i) => {
        $("#showreport").append(`
          <tr>
            <td>${i + 1}</td>
            <td>PSIRS-${searched.user_id}</td>
            <td>${searched.user_tin}</td>
            <td>${searched.name}</td>
            <td>
              ${searched.status === "Unlinked" ? '<span class="badge bg-danger">un-linked</span>' : '<span class="badge bg-success">linked</span>'}
            </td>
            <td>
              <div class="flex gap-3">
                <a href="psirs-datadetails.html?id=${searched.user_tin}" class="btn btn-primary btn-sm">View</a>
                <button class="btn btn-primary btn-sm" data-usertin="${searched.user_tin}" onclick='openLinkUser(this)' data-bs-toggle="modal" data-bs-target="#linkUser">Link User</button>       
              </div>
            </td>
          </tr>
        `)

        $("#showreport2").append(`
          <tr>
            <td>${i + 1}</td>
            <td>PSIRS-${searched.user_id}</td>
            <td>${searched.user_tin}</td>
            <td>${searched.name.replace(/,/g, '')}</td>
            <td>${searched.user_type}</td>
            <td>${searched.email}</td>
            <td>${searched.phone?.replace(/,/g, '')}</td>
            <td>${searched.city?.replace(/,/g, '')}</td>
            <td>${searched.address.replace(/,/g, '')}</td>
            <td>${searched.status}</td>
          </tr>
        `)
      })

      $('#searchBtn').html('Search')

    } catch (error) {
      console.log(error)
      $('#searchBtn').html('Search')
      $("#showreport").html(`
        <tr>
          <td class="text-center" colspan='6'>No Record found</td>
        </tr>
      `)
    }
  }

})