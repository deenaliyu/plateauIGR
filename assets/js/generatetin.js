const urlParams = new URLSearchParams(window.location.search);
let myParam = urlParams.get('category');

let regType = urlParams.get('user');

if (regType === "admin") {
    $("#theHeader").remove()
}

$(".checki").on("change", function () {
    let val = $(this).val()

    if (val === "yes") {
        $("#businessType").html(`
    <div class="flex gap-x-10 pt-2 px-3 items-center md:flex-nowrap sm:flex-wrap">
    <p>Type of business</p>
    <div class="form-group mb-2 md:w-[320px] w-full">
        <select class="form-select mt-1 regInputs" required data-name="typeofbusiness">
          <option value="" selected>-Select the name of the business--</option>
          <option value="Commercial">Commercial</option>
          <option value="Pool">Pool betting</option>
          <option value="Education">Education</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Mining">Mining</option>
          <option value="Services">Services</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Housing">Housing/real estate/lands</option>
          <option value="Transporting">Transporting</option>
          <option value="Legal">Legal</option>
          <option value="General">General</option>
        </select>
        <small class="validate text-[red]"></small>
      </div>
</div>
    `)

    } else {

        $("#businessType").html(`
    <div class=""></div>
    `)

    }
})

let selectcategory = document.querySelectorAll(".cardi")
selectcategory.forEach(selecti => {
    selecti.addEventListener("click", () => {
        selectcategory.forEach(element => {
            element.classList.remove("selectedcat");
        });
        selecti.classList.add("selectedcat");
        let btnclicked = document.querySelector(".bb");
        btnclicked.classList.remove("disabled");
        var dataId = selecti.getAttribute("data-name");
        // console.log(dataId)
        if (dataId === "individual") {
            $(".bb").on("click", (e) => {
                window.location.href = `generatetin-ind.html${regType === "admin" ? '?user=admin' : ''}`;
            })
        } else {
            $(".bb").on("click", (e) => {
                window.location.href = `generatetin-corp.html${regType === "admin" ? '?user=admin' : ''}`;
            })
        }
    })
})
