let USERINFO = JSON.parse(window.localStorage.getItem("enumDataPrime"));

async function getTaxPayers() {
  try {
    const response = await fetch(`${HOST}?getEnumerationTaxPayerById&id=${USERINFO.id}`);
    const data = await response.json();
    
    if (data.status === 1) {
      console.log('Taxpayer data:', data);
      const $showTaxPayers = $("#showTaxPayers");
      $showTaxPayers.empty();

      data.message.reverse().forEach((txpayer, i) => {
        // Create a clean, stringifiable version of the taxpayer data
        const taxpayerData = {
          id: txpayer.id,
          tax_number: txpayer.tax_number,
          category: txpayer.category,
          name: `${txpayer.first_name} ${txpayer.surname}`.trim(),
          email: txpayer.email,
          phone: txpayer.phone || txpayer.rep_phone,
          state: txpayer.state,
          lga: txpayer.lga,
          address: txpayer.address,
          img: txpayer.img,
          verification_status: txpayer.verification_status === "1" ? "Verified" : "Unverified",
          timeIn: txpayer.timeIn,
          representative: {
            name: `${txpayer.rep_firstname} ${txpayer.rep_surname}`.trim(),
            email: txpayer.rep_email,
            phone: txpayer.rep_phone,
            position: txpayer.rep_position,
            address: txpayer.rep_address
          },
          business_info: {
            industry: txpayer.industry,
            business_type: txpayer.business_type,
            annual_revenue: txpayer.annual_revenue,
            staff_count: txpayer.number_of_staff
          }
        };

        // Add row to table
        $showTaxPayers.append(`
          <tr>
            <td>${i + 1}</td>
            <td>${txpayer.tax_number}</td>
            <td>${taxpayerData.name}</td>
            <td>${taxpayerData.email}</td>
            <td>${taxpayerData.phone}</td>
            <td>${txpayer.category}</td>
            <td>${txpayer.timeIn.split(" ")[0]}</td>
            <td>
              ${taxpayerData.verification_status === "Verified" 
                ? '<span class="badge bg-success">Verified</span>' 
                : '<span class="badge bg-danger">Unverified</span>'}
            </td>
            <td>
      <div class="btn-group d-flex space-x-4">
        <a class="btn btn-primary btn-sm" href="taxpayerlist.html?id=${txpayer.tax_number}">
          <i class="fas fa-eye"></i> View
        </a>
        <button class="btn btn-secondary btn-sm print-btn" 
                data-taxpayer="${encodeURIComponent(JSON.stringify(taxpayerData))}">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </td>
          </tr>
        `);
      });

      // Handle print button clicks
     // In your getTaxPayers function, modify the print button creation:

// Update the print button click handler:
$(document).off('click', '.print-btn').on('click', '.print-btn', function() {
  try {
    const taxpayerJson = decodeURIComponent($(this).attr('data-taxpayer'));
    const taxpayer = JSON.parse(taxpayerJson);
    printTaxPayerInfo(taxpayer);
  } catch (error) {
    console.error("Error parsing taxpayer data:", error);
    Swal.fire({
      icon: 'error',
      title: 'Print Error',
      text: 'Could not load taxpayer data for printing',
      confirmButtonText: 'OK'
    });
  }
});

    } else {
      console.error("Error fetching taxpayers:", data.message);
      $("#showTaxPayers").html(`
        <tr>
          <td colspan="10" class="text-center text-danger py-3">
            <i class="fas fa-exclamation-circle"></i> ${data.message || 'No taxpayers found'}
          </td>
        </tr>
      `);
    }

  } catch (error) {
    console.error("Error:", error);
    $("#showTaxPayers").html(`
      <tr>
        <td colspan="10" class="text-center text-danger py-3">
          <i class="fas fa-exclamation-triangle"></i> Failed to load taxpayer data
        </td>
      </tr>
    `);
  }
}

function printTaxPayerInfo(taxpayer) {
  // Create printable content
  const printContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; display: inline-block;">
          Taxpayer Information
        </h2>
      </div>
      
      <div style="display: flex; margin-bottom: 30px;">
        <div style="flex: 1; padding-right: 20px;">
          <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Basic Information</h3>
          <p><strong>Tax Number:</strong> ${taxpayer.tax_number || 'N/A'}</p>
          <p><strong>Name:</strong> ${taxpayer.name || 'N/A'}</p>
          <p><strong>Category:</strong> ${taxpayer.category || 'N/A'}</p>
          <p><strong>Status:</strong> ${taxpayer.verification_status || 'N/A'}</p>
          <p><strong>Registration Date:</strong> ${taxpayer.timeIn ? taxpayer.timeIn.split(" ")[0] : 'N/A'}</p>
        </div>
        
        ${taxpayer.img ? `
        <div style="flex: 1; text-align: center;">
          <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Photo</h3>
          <img src="${taxpayer.img}" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; padding: 5px;">
        </div>
        ` : ''}
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Contact Information</h3>
        <p><strong>Email:</strong> ${taxpayer.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${taxpayer.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${taxpayer.address || 'N/A'}</p>
        <p><strong>LGA:</strong> ${taxpayer.lga || 'N/A'}, <strong>State:</strong> ${taxpayer.state || 'N/A'}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Representative Information</h3>
        <p><strong>Name:</strong> ${taxpayer.representative.name || 'N/A'}</p>
        <p><strong>Position:</strong> ${taxpayer.representative.position || 'N/A'}</p>
        <p><strong>Email:</strong> ${taxpayer.representative.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${taxpayer.representative.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${taxpayer.representative.address || 'N/A'}</p>
      </div>
      
      ${taxpayer.business_info ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Business Information</h3>
        <p><strong>Industry:</strong> ${taxpayer.business_info.industry || 'N/A'}</p>
        <p><strong>Business Type:</strong> ${taxpayer.business_info.business_type || 'N/A'}</p>
        <p><strong>Annual Revenue:</strong> ${taxpayer.business_info.annual_revenue || 'N/A'}</p>
        <p><strong>Staff Count:</strong> ${taxpayer.business_info.staff_count || 'N/A'}</p>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
        Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
      </div>
    </div>
  `;

  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Taxpayer Information - ${taxpayer.tax_number || ''}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          @media print {
            @page { size: auto; margin: 10mm; }
            body { padding: 0; }
          }
          h2, h3 { color: #333; }
          strong { font-weight: 600; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          setTimeout(function() {
            window.print();
            window.close();
          }, 300);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

getTaxPayers().then(uu => {
  $("#dataTable").DataTable();
})