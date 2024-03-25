const urlParams = new URLSearchParams(window.location.search);
const theUserID = urlParams.get('id')
// 

async function fetchUSER() {


  const response = await fetch(
    `${HOST}/php/index.php?getAdminUser`
  );
  const userInvoices = await response.json();

  if (userInvoices.status === 1) {

    let theUSER = userInvoices.message.filter(tt => tt.id === theUserID)[0]

    let alluserInputs = document.querySelectorAll(".userInputs")
    alluserInputs.forEach(uu => {
      uu.value = theUSER[uu.dataset.name]
    })

    
    const checkboxGroups = document.querySelectorAll('.checkbox-group');

    checkboxGroups.forEach(checkboxGroup => {
      const checkboxes = checkboxGroup.querySelectorAll('.acclvl');
      const dataName = checkboxes[0].dataset.name;
      const selectedValue = theUSER[dataName];

      if (selectedValue) {
        const mainSelVal = selectedValue.split("~");

        checkboxes.forEach(checkbox => {

          if (mainSelVal.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      }
    });
  } else {

  }
}
{/* <td class="text-[#22C55E]">Full access</td> */ }
fetchUSER()

$("#opPas").on("click", function () {
  let pasInp = document.querySelector(".passInput")

  if (pasInp.type === "password") {
    pasInp.type = "text"
  } else {
    pasInp.type = "password"
  }
})
