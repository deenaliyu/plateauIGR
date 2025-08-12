const the_industries = [
  "AGRICULTURAL",
  "AGRO BUSINESS",
  "ART AND ENTERTAINMENT",
  "ASSOCIATION",
  "AUTOMOBILE BUSINESS",
  "BEAUTY & FASHION",
  "BUSINESS",
  "COMMUNICATION",
  "CONSTRUCTION",
  "CONTRACTOR",
  "Contract",
  "DRILLING",
  "EDUCATION",
  "EXTRACTION",
  "FASHION DESIGNING",
  "FINANCIAL SERVICES",
  "GAMING / LOTTERY",
  "HEALTH",
  "HOSPITALITY",
  "INFORMATION TECHNOLOGY",
  "InFormal",
  "LEGAL SERVICES",
  "MANUFACTURING",
  "MINING",
  "MINISTRY",
  "NGO",
  "OIL AND GAS",
  "PROFESSIONAL SERVICES",
  "RELIGIOUS",
  "RETAIL TRADE",
  "SECURITY SERVICES",
  "SERVICE",
  "SOCIAL SERVICES",
  "TRANSPORTATION",
  "Trading"
]

$(document).ready(function () {
  the_industries.forEach(industry => {
    $('#getSector').append(`<option value="${industry}">${industry}</option>`)
  })
});

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
  const apiUrl = 'https://plateauigr.com/php/?pull_old_users1';
  let totalRecords = 0;

  initializeLoader(true); // Show loader

  try {
    totalRecords = await fetchTotalRecords();
    createPagination(472070);
    await fetchData(1); // Fetch initial data for page 1
  } catch (error) {
    console.error('Error during data fetching:', error);
  } finally {
    initializeLoader(false); // Hide loader
  }

  // Event listener for the filter
  document.getElementById('filterMda').addEventListener('click', async () => {
    const category = document.querySelector('.thecategselect').value;
    const sector = document.querySelector('.thesectorselect').value;

    await fetchData(1, category, sector); // Apply filters and fetch data
    $("#filterData").modal("hide")
  });

  // Fetch total records from the API
  function fetchTotalRecords(category = '', sector = '') {
    const url = `${apiUrl}&limit=1&category=${category}&sector=${sector}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const individualRecords = data.individual ? data.individual.length : 0;
        const companyRecords = data.companies ? data.companies.length : 0;
        return individualRecords + companyRecords;
      })
      .catch(error => {
        console.error('Error fetching total records:', error);
        throw error; // Re-throw error to handle it in fetchAllData
      });
  }

  // Fetch data for a specific page
  function fetchData(page, category = '', sector = '') {
    const url = `${apiUrl}&limit=${page}&category=${category}&sector=${sector}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        let combinedData = [...(data.individual || []), ...(data.companies || [])];
        displayData(combinedData);
      })
      .catch(error => {
        console.error('Error fetching data for page:', page, error);
        throw error; // Re-throw error to handle it in fetchAllData
      });
  }

  // Display data in the table
  function displayData(data) {
    const tbody = document.querySelector('#showreport');
    const tbody2 = document.querySelector('#showreport2');

    tbody.innerHTML = '';
    tbody2.innerHTML = ''; // Clear the second table as well

    data.forEach((item, index) => {
      const statusBadge = item.status === "Unlinked"
        ? '<span class="badge bg-danger">un-linked</span>'
        : '<span class="badge bg-success">linked</span>';

      const row1 = `
              <tr>
                  <td>${index + 1}</td>
                  <td>PSIRS-${item.user_id}</td>
                  <td>${item.user_tin}</td>
                  <td>${item.category}</td>
                  <td>${item.name}</td>
                  <td>${item.sector ? item.sector : '-'}</td>
                  <td>${statusBadge}</td>
                  <td>
                      <div class="flex gap-3">
                          <a href="psirs-datadetails.html?id=${item.user_tin}" class="btn btn-primary btn-sm">View</a>
                          <button class="btn btn-primary btn-sm" data-usertin="${item.user_tin}" onclick='openLinkUser(this)' data-bs-toggle="modal" data-bs-target="#linkUser">Link User</button>
                      </div>
                  </td>
              </tr>
          `;
      tbody.innerHTML += row1;

      const row2 = `
              <tr>
                  <td>${index + 1}</td>
                  <td>PSIRS-${item.user_id}</td>
                  <td>${item.user_tin}</td>
                  <td>${item.category}</td>
                  <td>${sanitizeText(item.name)}</td>
                  <td>${item.user_type || 'N/A'}</td>
                  <td>${item.email || 'N/A'}</td>
                  <td>${sanitizeText(item.phone) || 'N/A'}</td>
                  <td>${sanitizeText(item.city) || 'N/A'}</td>
                  <td>${sanitizeText(item.address) || 'N/A'}</td>
                  <td>${item.status}</td>
              </tr>
          `;
      tbody2.innerHTML += row2;
    });
  }

  // Sanitize text by removing commas or handling null values
  function sanitizeText(text) {
    return text ? text.replace(/,/g, '') : 'N/A';
  }

  // Initialize or hide loader
  function initializeLoader(show) {
    const loader = $("#loader");
    if (show) {
      loader.css('display', 'flex');
    } else {
      loader.css('display', 'none');
    }
  }

  // Create pagination for the data
  function createPagination(totalRecords) {
    const pagination = document.getElementById('pagination');
    const entriesPerPage = 200; // Example number of records per page
    const totalPages = Math.ceil(totalRecords / entriesPerPage);

    $("#showing").html(`Showing 1 to ${entriesPerPage} of ${totalRecords.toLocaleString()} entries`);
    $("#paging").html('Page 1');

    pagination.innerHTML = ''; // Clear previous pagination

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.textContent = i;
      li.classList.add('page-item');

      li.addEventListener('click', () => {
        const category = document.querySelector('.thecategselect').value;
        const sector = document.querySelector('.thesectorselect').value;
        fetchData(i, category, sector);
        updatePaginationUI(i, totalRecords, entriesPerPage, pagination);
      });

      if (i === 1) li.classList.add('active'); // Mark first page as active
      pagination.appendChild(li);
    }
  }

  // Update the pagination UI and data display
  function updatePaginationUI(currentPage, totalRecords, entriesPerPage, pagination) {
    const startRecord = (currentPage - 1) * entriesPerPage + 1;
    const endRecord = Math.min(currentPage * entriesPerPage, totalRecords);

    $("#showing").html(`Showing ${startRecord} to ${endRecord} of ${totalRecords.toLocaleString()} entries`);
    $("#paging").html(`Page ${currentPage}`);

    document.querySelectorAll('.pagination li').forEach(el => el.classList.remove('active'));
    pagination.children[currentPage - 1].classList.add('active');
  }
}

fetchAllData();

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
            <td>${searched.category}</td>
            <td>${searched.name}</td>
            <td>${searched.sector ? searched.sector : '-'}</td>
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
            <td>${searched.category}</td>
            <td>${searched.name?.replace(/,/g, '')}</td>
            <td>${searched.user_type}</td>
            <td>${searched.email}</td>
            <td>${searched.phone?.replace(/,/g, '')}</td>
            <td>${searched.city?.replace(/,/g, '')}</td>
            <td>${searched.address?.replace(/,/g, '')}</td>
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