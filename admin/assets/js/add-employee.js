const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('categ_id');

let singleLinking = document.querySelector("#singleLinking")

if (singleLinking) {
  singleLinking.href = `create-employee.html?categ_id=${category}`
}

document.querySelector('#downloadTemplate').addEventListener('click', () => {
  const headers = [
    'fullname', 'email', 'phone', 'tin', 'annual_gross_income',
    'basic_salary', 'date_employed', 'housing', 'transport',
    'utility', 'medical', 'entertainment', 'leaves', 'category_id'
  ];

  const categoryId = new URLSearchParams(window.location.search).get('categ_id');

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

function registerUsersFromCSV(file) {
  $("#msg_box").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>  
  `)
  const reader = new FileReader();
  const successfulRegistrations = [];
  const failedRegistrations = [];

  reader.onload = async (e) => {
    const csv = e.target.result;
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(',');
    const users = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index] ? values[index].trim() : '';
        return obj;
      }, {});
    });

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const EnumData = {
        endpoint: "createSpecialUserEmployee",
        data: user
      };

      $("#msg_box").html(`
        <div class="flex justify-center items-center mt-4">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>  
      `)

      try {
        const response = await fetch(HOST, {
          method: "POST",
          body: JSON.stringify(EnumData),
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();

        if (data.status === 1) {
          console.log(`Success: ${user.fullname} registered.`);
          successfulRegistrations.push(user.email);

        } else {
          failedRegistrations.push({ email: user.email, error: data.message });

        }
      } catch (error) {
        failedRegistrations.push({ email: user.email, error: error.message });
        console.log(`Error registering ${user.fullname}:`, error);
      }
    }

    $("#msg_box").html(`
      <div class="mt-4 flex justify-center items-center flex-col">
        <p>Registration Summary:</p>
        <p>Successful registrations: ${successfulRegistrations.length}</p>
        <p>${successfulRegistrations.join(', ')}</p>
      </div>
    `)

    if (failedRegistrations.length > 0) {
      $("#msg_box").append(`
          <div class="mt-4 flex justify-center items-center flex-col">
          <p>Failed registrations: ${failedRegistrations.length}</p>
          <p>${failedRegistrations.map(fail => `${fail.email}: ${fail.error}`).join('<br>')}</p>
        </div>
      `);
    }
  };

  reader.onerror = () => {
    console.error('Failed to read the file');
    alert('Failed to read the file')
  };

  reader.readAsText(file);
}

// Usage example:
// <input type="file" id="csvFile" onchange="handleFileUpload(event)">
function handleFileButtonClick() {
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (file) {
    registerUsersFromCSV(file);
  } else {
    console.error('No file selected');
  }
}
