let ALLMDAUSERS = []

function generatePassword(length = 8) {
  if (length < 1) {
    throw new Error("Password length must be at least 1.");
  }

  const digits = '0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    password += digits[randomIndex];
  }

  return password;
}

async function fetchUSERS() {
  $("#showUsers").html("");

  const response = await fetch(`${HOST}?mda_id=${mdaId}&usersParticularMDA`);
  const allMDAUsers = await response.json();

  // console.log(allMDAUsers);
  ALLMDAUSERS = []
  ALLMDAUSERS.push(...allMDAUsers.message);

  if (allMDAUsers.status === 1) {
    allMDAUsers.message.forEach((MDAUSer, i) => {
      $("#showUsers").append(`
        <tr class="">
          <td>${i + 1}</td>
          <td>${MDAUSer.name}</td>
          <td>${MDAUSer.email}</td>
          <td>${MDAUSer.phone_number}</td>
          <td>${MDAUSer.created_at}</td>
          <td>
            <div class="flex gap-3 align-items-center">
              <button onclick="editMDAFunc(this)" data-revid="${MDAUSer.id}" data-bs-target="#editMDAUser"  data-bs-toggle="modal"><iconify-icon icon="fa6-regular:pen-to-square" width="20"
                  height="20"></iconify-icon></button>
              <iconify-icon onclick="deleteMDAUser(this)" class="cursor-pointer" data-revid="${MDAUSer.id}" icon="material-symbols:delete-outline-sharp" width="20"
                height="20"></iconify-icon>
            </div>
          </td>
        </tr>
      `);
    });
  } else {
    // $("#mdaAdminTable").empty();
  }
}

fetchUSERS().then((uu) => {
  $("#mdaAdminTable").DataTable();
});

$("#createUser").on("click", function () {

  // console.log('you cick')
  let allInputs = document.querySelectorAll(".userInputs");
  let allRadioBoxs = document.querySelectorAll(".form-select.accleveler");


  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].value === "") {
      $("#msg_boxadmin").html(`
          <p class="text-[red] text-center mt-4 text-lg">All fields are required</p>
        `);
      break;
    } else {
      // e.preventDefault()
      $("#msg_boxadmin").html(`
          <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
        `);
      $("#createUser").addClass("hidden");

      let queryString = window.location.search;
      let urlParams = new URLSearchParams(queryString);
      let mdaID = urlParams.get('id');

      let obj = {
        endpoint: "createMDAUser",
        data: {
          mda_id: mdaID,
          dashboard_access: "full",
          revenue_head_access: "full",
          payment_access: "full",
          users_access: "full",
          report_access: "full",
          passwd: generatePassword(8),
          offices: "Not Assigned"
        },
      };

      allInputs.forEach((allInput) => {
        obj.data[allInput.dataset.name] = allInput.value;
      });
      allRadioBoxs.forEach((allRadioBox) => {
        // if (allRadioBox.select) {
        obj.data[allRadioBox?.name] = allRadioBox.value;
        // }
      });

      console.log(obj)
      let StringedData = JSON.stringify(obj);

      console.log(StringedData)
      $.ajax({
        type: "POST",
        url: HOST,
        // dataType: "json",
        data: StringedData,
        success: function (data) {
          console.log(data);
          if (data.status === 2) {
            $("#msg_boxadmin").html(`
              <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
            `);
            $("#createUser").removeClass("hidden");
          } else if (data.status === 1) {
            $("#msg_boxadmin").html(`
              <p class="text-success text-center mt-4 text-lg">${data.message}</p>
            `);

            setTimeout(() => {
              fetchUSERS()
              $("#createMdaAdmin").modal('hide')
            }, 2000);

          }
        },
        error: function (request, error) {
          console.log(error);
          $("#msg_boxadmin").html(`
              <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
            `);
          $("#createUser").removeClass("hidden");
        },
      });
    }
    break;
  }
  return false;
});


// DELETE MDA ADMIN

function deleteMDAUser(e) {
  let theRevId = e.dataset.revid;
  console.log(theRevId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: `${HOST}?deleteMDAUser&id=${theRevId}`,
        dataType: "json",
        success: function (data) {
          // console.log(data);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          // if (data.status === 1) {
          //   Swal.fire("Deleted!", "User has been deleted.", "success");
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 1000);
          // } else {
          //   Swal.fire(
          //     "Try again!",
          //     "Something went wrong, try again !",
          //     "error"
          //   );
          // }
        },
        error: function (request, error) {
          Swal.fire("Try again!", "Something went wrong, try again !", "error");
        },
      });
    }
  });
}

function editMDAFunc(e) {
  let editaID = e.dataset.revid
  // console.log(editaID)
  sessionStorage.setItem("userUpdate", editaID)

  let theREV = ALLMDAUSERS.find(dd => dd.id === editaID)

  let userDataMdaaa = JSON.parse(localStorage.getItem("adminDataPrime"))
  if (userDataMdaaa.email === "primeguage@gmail.com") {
    $("#thePasswordField").html(`
      <div class="form-group mb-3">
        <label for="defaultSelect" class="my-0">Password<span class="text-[red]">*</span></label>
        <input required type="text" class="form-control userInputs2" data-name="password" />
      </div>  
    `)
  } else {
    $("#thePasswordField").html('')
  }

  let allInputs = document.querySelectorAll(".userInputs2")
  let allRadioBoxs = document.querySelectorAll(".form-select.accleveler2");

  allInputs.forEach(theInpt => {
    if (theREV[theInpt.dataset.name]) {
      theInpt.value = theREV[theInpt.dataset.name]
    }
  })

  allRadioBoxs.forEach(radi => {
    if (theREV[radi.name]) {
      radi.value = theREV[radi.name]
    }
  })

}

$("#editMDA").on("click", () => {
  let theRevId = sessionStorage.getItem("userUpdate")

  $("#msg_boxedit").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#editMDA").addClass("hidden")

  let allInputs = document.querySelectorAll(".userInputs2")
  let allSelectBoxes = document.querySelectorAll(".form-select.accleveler2");

  let obj = {
    data: {
      id: theRevId,
    }
  }
  allInputs.forEach(allInput => {
    obj.data[allInput.dataset.name] = allInput.value
  });

  console.log(obj.data);

  allSelectBoxes.forEach((allSelected) => {

    if (allSelected.name != 'dataTable_length') {
      obj.data[allSelected?.name] = allSelected.value;
    }

  });

  let queryString = $.param(obj.data);

  console.log(queryString)

  $.ajax({
    type: "GET",
    url: `${HOST}?updateMDAUser&` + queryString,
    dataType: "json",
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_boxedit").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#editRevenue").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_boxedit").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#editMDA").removeClass("hidden")
        setTimeout(() => {
          fetchUSERS()
          $('#editMDAUser').modal('hide');
        }, 2000);

      }
    },
    error: function (request, error) {
      $("#msg_boxedit").html(`
        <p class="text-danger text-center mt-4 text-lg">Something went wrong, Try again !</p>
      `)
      $("#editMDA").removeClass("hidden")
      console.log(error);
    }
  });
})