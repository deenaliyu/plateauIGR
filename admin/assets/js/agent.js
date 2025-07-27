// Function to prefill form with user data
function prefillUserForm(userData) {
  if (userData && userData.message && userData.message.length > 0) {
    const user = userData.message[0];
    
    // Fill form fields
    document.getElementById('userId').value = user.id;
    document.getElementById('fullname').value = user.fullname;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('address').value = user.address;
    document.getElementById('password').value = user.password;
     document.getElementById('STATES').value = user.state;
     document.getElementById('LGAs').value = user.lga;
  }
}

// Function to update user details
function showMessage(message, type) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: type,
    title: message
  })
}

// Updated updateUserDetails function with SweetAlert confirm and results
async function updateUserDetails(event) {
  event.preventDefault();
  
  // Show loading state
  $("#updateAgentBtn").addClass("hidden");
  $("#msg_box").html(`
    <div class="flex justify-center items-center mb-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);

  // Prepare data object
  let updateData = {
    "endpoint": "updateEnumUser",
    "data": {}
  };

  // Collect all form data
  document.querySelectorAll(".userInputs, .regInputs, input[type='hidden']").forEach((input) => {
    updateData.data[input.dataset.name] = input.value;
  });

  console.log("Sending update:", updateData);

  try {
    // First show confirmation dialog
    const { value: confirm } = await Swal.fire({
      title: 'Are you sure?',
      text: "You're about to update this user's details",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });
    
    if (!confirm) {
      $("#updateAgentBtn").removeClass("hidden");
      $("#msg_box").html("");
      return;
    }

    // Send the request
    const response = await fetch(HOST, {
      method: "POST",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.status === 1) {
      $("#msg_box").html(`
        <p class="text-success text-center text-lg">${data.message}</p>
      `);
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'User details have been updated successfully',
        confirmButtonColor: '#CDA545',
        confirmButtonText: 'Close',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "manageagent.html"; // Redirect to manage agent page
        }
      });

    } else {
      $("#updateAgentBtn").removeClass("hidden");
      $("#msg_box").html(`
        <p class="text-warning text-center text-lg">${data.message}</p>
      `);
    }

  } catch (error) {
    console.error("Update error:", error);
    $("#updateAgentBtn").removeClass("hidden");
    $("#msg_box").html(`
      <p class="text-danger text-center text-lg">Something went wrong! Please try again.</p>
    `);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update user details',
      confirmButtonText: 'OK'
    });
  }
}

// Keep all other functions (prefillUserForm, setSelectedOption, etc.) the same as before

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Assuming you have a way to get the user data (from URL parameter or other means)
  const userId = new URLSearchParams(window.location.search).get('id');
  if (userId) {
    fetch(`${HOST}?getEnumUser=true&id=${userId}`)

      .then(response => response.json())
      .then(data => prefillUserForm(data))
      .catch(error => console.error('Error fetching user data:', error));


  }
  
  // Attach form submit handler
  document.getElementById('updateUserForm').addEventListener('submit', updateUserDetails);
});