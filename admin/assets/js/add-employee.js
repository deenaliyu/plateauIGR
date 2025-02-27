const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('categ_id');

let singleLinking = document.querySelector("#singleLinking")

if (singleLinking) {
    singleLinking.href = `create-employee.html?categ_id=${category}`
}

document.querySelector('#downloadTemplate').addEventListener('click', () => {
    const headers = [
        'fullname', 'email', 'phone', 'payer_id', 'annual_gross_income',
        'basic_salary', 'date_employed', 'housing', 'transport',
        'utility', 'medical', 'entertainment', 'leaves', 'category_id'
    ];

    const categoryId = new URLSearchParams(window.location.search).get('category_id');

    const csvContent = [headers.join(',')];

    // Add an empty row for template purposes
    const emptyRow = headers.map(header => header === 'category_id' ? categoryId : '').join(',');
    csvContent.push(emptyRow);

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});