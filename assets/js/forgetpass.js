


$("#LoginNow").on("click", (e) => {

    
  const urlParams = new URLSearchParams(window.location.search);

let myParam = urlParams.get('type');
  
console.log(myParam);
  let emailAdd = document.querySelector("#emailAdd").value
  
    e.preventDefault()
    $(".msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  
    $("#loginNow").addClass("hidden")
    
    $.ajax({
      type: "GET",
      url: `${HOST}/?resetPassword&email=${emailAdd}&type=${myParam}`,
      dataType: 'json',
      success: function (data) {
      if (data.status === 1) {
          $("#msg_box").html(`
            <p class="text-success text-center mt-4 text-lg">${data.message}</p>
          `)
          // window.location.href = `resetpass.html?id=${data.id}`

        } else if (data.status === 0) {
          $("#msg_box").html(`
            <p class="text-warning text-center mt-4 text-base">${data.message}</p>
          `)
        }
      },
      error: function (request, error) {
        console.log(error);
        $("#msg_box").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
        `)
      }
    });
  
  })

  const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('id');
const type = urlParams.get('type');
  $("#ResetNow").on("click", (e) => {
    e.preventDefault()
  
  
    let ppsword = document.querySelector("#pps").value
    let ppsword2 = document.querySelector("#pps2").value
  
  
  
    let valPas = document.querySelector("#valPas")
  
    if (ppsword === "") {
      valPas.innerHTML = "Password cannot be empty"
  
    }
 
    else if (ppsword2 !== ppsword) {
      valPas.innerHTML = "Confirm password must match password !"
  
    }
    else {
      $(".valPas").html("")
      $("#load").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      `)
  
      $("#ResetNow").addClass("hidden")
      $.ajax({
        type: "GET",
        url: `${HOST}/?changePassword&id=${userid}&password=${ppsword}&type=${type}`,
        dataType: 'json',
        success: function (data) {
        if (data.status === 1) {
            $("#load").html(`
              <p class="text-success text-center mt-4 text-lg">${data.message}</p>
            `)
            if (type === 'enum') {
              window.location.href = `hospital`
            } else if (type === 'user') {
            window.location.href = `signin.html`
          }
          } else if (data.status === 0) {
            $("#load").html(`
              <p class="text-warning text-center mt-4 text-base">${data.message}</p>
            `)
          }
        },
        error: function (request, error) {
          console.log(error);
          $("#load").html(`
            <p class="text-danger text-center mt-4 text-lg">Something went wrong try again !</p>
          `)
        }
      });
     
    }
  
  })