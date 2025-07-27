const urlParamso = new URLSearchParams(window.location.search);

const theId = urlParamso.get('id');

async function fetchUserData() {
    try {
      const response = await fetch(`${HOST}?getEnumUser=true&id=${theId}`);
      const data = await response.json();

      if (data.status === 1 && data.message.length > 0) {
        const user = data.message[0];

        document.getElementById('fullname').textContent = user.fullname;
        document.getElementById('agent-id').textContent = user.agent_id;
        document.getElementById('email').textContent = user.email;
        document.getElementById('contact').textContent = user.phone;
        document.getElementById('state').textContent = user.state;
        document.getElementById('lga').textContent = user.lga;
        document.getElementById('address').textContent = user.address;
        document.getElementById('taxpayers').textContent = user.taxpayer_count; // Replace with actual value if available

        // Optionally update avatar if your API includes a profile picture
        // document.getElementById('avatar').src = user.avatar_url;
      } else {
        console.error('No user found or invalid response');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  // Fetch user data after DOM loads
  document.addEventListener('DOMContentLoaded', fetchUserData);
  
async function getTaxPayers() {
    try {
        const response = await fetch(`${HOST}?getEnumerationTaxPayerById&id=${theId}`)
        const data = await response.json()
    
        if (data.status === 1) {
    
          console.log(data)
          data.message.reverse().forEach((txpayer, i) => {
            $("#showTaxPayers").append(`
              <tr>
                <td>${i + 1}</td>
                <td>${txpayer.tax_number}</td>
                <td>${txpayer.first_name} ${txpayer.surname}</td>
                <td>${txpayer.category}</td>
                <td>${txpayer.timeIn.split(" ")[0]}</td>
                <td>${txpayer.timeIn.split(" ")[0]}</td>
                <td><span class="badge bg-success">verified</span></td>
                <td><span class="badge bg-danger">unverified</span></td>
              </tr>
            `)
          });
        } else {
        $("#showTaxPayers").html(`
            <tr>
                <td colspan='8' class='text-center'>No Users Registered.</td>
            </tr>
        `)
    
    
        }
    
      } catch (error) {
        console.log(error)
        $("#showTaxPayers").html(`
            <tr>
                <td colspan='8' class='text-center'>No Users Registered.</td>
            </tr>
        `)
    }
}

getTaxPayers()