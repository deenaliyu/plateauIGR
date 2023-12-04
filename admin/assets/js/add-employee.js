const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('categ_id');

let singleLinking = document.querySelector("#singleLinking")

if (singleLinking) {
    singleLinking.href = `create-employee.html?categ_id=${category}`
}