function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;


  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;

}

// Get facility ID from URL
function getFacilityIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Format facility type for display
function formatFacilityType(type) {
    if (!type) return 'N/A';
    return type.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Parse JSON safely
function parseJsonSafely(jsonString) {
    try {
        return jsonString ? JSON.parse(jsonString) : [];
    } catch (e) {
        console.error("Error parsing JSON:", e);
        return [];
    }
}

// Format currency
function formatCurrency(amount) {
    return amount ? `₦${parseFloat(amount).toLocaleString()}` : 'N/A';
}

// Render facility summary
function renderFacilitySummary(facility) {
    const reviewSummaryElement = document.getElementById('reviewSummary');
    if (!reviewSummaryElement) {
        console.error('Error: reviewSummary element not found in DOM');
        return;
    }

    const facilityData = facility || {};
    const typeData = facility.type_data || {};

    // Parse JSON data
    const servicesOffered = parseJsonSafely(typeData.services_offered); // Note: Fixed typo in original (services_offered vs services_offered)
    const primaryServices = parseJsonSafely(typeData.primary_services_offered);

    // Generate type-specific fields
    let typeSpecificFields = '';
    for (const [key, value] of Object.entries(typeData)) {
        if (!['id', 'facility_hospital_id', 'created_at', 'updated_at', 'services_offered', 'primary_services_offered'].includes(key)) {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let displayValue = value;

            if (key.includes('fee') || key.includes('cost') || key.includes('price')) {
                displayValue = formatCurrency(value);
            }

            typeSpecificFields += `
                <tr>
                    <th width="40%">${label}:</th>
                    <td>${displayValue || 'N/A'}</td>
                </tr>
            `;
        }
    }

    // Generate HTML
const html = `<div class="printable-page bg-white p-3 position-relative">
    <!-- Logo Watermark -->
    <div class="watermark position-absolute w-100 h-100 d-flex align-items-center justify-content-center" 
         style="top: 0; left: 0; z-index: 1; opacity: 0.08; pointer-events: none;">
        <img src="./assets/img/logo.png" style="width: 400px; height: 400px; transform: rotate(-15deg);" alt="Watermark Logo" />
    </div>

    <!-- Content -->
    <div class="position-relative" style="z-index: 2;">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="fw-bold" style="font-size: 15px;">PlateauIGR</div>
            <div class="d-flex align-items-center gap-2">
                <img src="./assets/img/logo.png" style="width: 40px; height: 40px;" alt="Logo" />
                <span class="fw-bold" style="font-size: 17px;">ENUMERATION BIODATA</span>
            </div>
            <div style="font-size: 13px;">${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', {hour12: true})}</div>
        </div>

        <!-- Photo and QR Code Row -->
        <div class="d-flex justify-content-between align-items-start mb-3">
            <div style="width: 280px;">
                <img src="${facilityData.facility_photo || './assets/img/facility-placeholder.jpg'}" 
                     class="img-fluid" style="width: 100%; height: 160px; object-fit: cover; border: 1px solid #ccc;" alt="Facility Photo" />
            </div>
            <div>
                <div id="qrContainer" style="width: 100px; height: 100px; border: 1px solid #000;"></div>
            </div>
        </div>

        <!-- Facility Info -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">FACILITY INFO</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Facility Name:</strong><br>
                        <span style="font-size: 12px;">${facilityData.branch_name || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Facility Type:</strong><br>
                        <span style="font-size: 12px;">${formatFacilityType(facilityData.facility_type)}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">CAC Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.cac_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Type of Ownership:</strong><br>
                        <span style="font-size: 12px;">${facilityData.ownership_type || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Operating License Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.license_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Issuing Authority:</strong><br>
                        <span style="font-size: 12px;">${facilityData.issuing_authority || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">License Expiry Date:</strong><br>
                        <span style="font-size: 12px;">${facilityData.license_expiry || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">National Health Facility Code:</strong><br>
                        <span style="font-size: 12px;">${facilityData.nhfc_code || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">NHIS Accreditation Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.nhis_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Certificate of Standards No.:</strong><br>
                        <span style="font-size: 12px;">${facilityData.standards_cert || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">TIN:</strong><br>
                        <span style="font-size: 12px;">${facilityData.tin || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Date of Establishment:</strong><br>
                        <span style="font-size: 12px;">${facilityData.establishment_date || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Operations Info -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">OPERATIONS INFO</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Primary Services Offered:</strong><br>
                        <span style="font-size: 12px;">${facilityData.primary_services || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Type of Major Equipment:</strong><br>
                        <span style="font-size: 12px;">${facilityData.major_equipment || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Number of Employees:</strong><br>
                        <span style="font-size: 12px;">${facilityData.employee_count || '0'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Number of Beds:</strong><br>
                        <span style="font-size: 12px;">${facilityData.number_of_beds || '0'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Average Monthly Patient Visits:</strong><br>
                        <span style="font-size: 12px;">${facilityData.avg_monthly_visits || '0'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Number of Surgeries/Procedures per Month:</strong><br>
                        <span style="font-size: 12px;">${facilityData.monthly_procedures || '0'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Cost of Hospital Card/Registration Fee:</strong><br>
                        <span style="font-size: 12px;">${facilityData.registration_fee || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact & Location -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">CONTACT & LOCATION</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Physical Address:</strong><br>
                        <span style="font-size: 12px;">${facilityData.physical_address || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">City/Town:</strong><br>
                        <span style="font-size: 12px;">${facilityData.city || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">LGA:</strong><br>
                        <span style="font-size: 12px;">${facilityData.lga || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Phone Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.phone || facilityData.branch_phone_numbers || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Email Address:</strong><br>
                        <span style="font-size: 12px;">${facilityData.email || facilityData.branch_email || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Website:</strong><br>
                        <span style="font-size: 12px;">${facilityData.branch_website || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Latitude:</strong><br>
                        <span style="font-size: 12px;">${facilityData.latitude || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Longitude:</strong><br>
                        <span style="font-size: 12px;">${facilityData.longitude || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Facility Representative -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">FACILITY REPRESENTATIVE</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Full Name of Representative:</strong><br>
                        <span style="font-size: 12px;">${facilityData.representative_name || facilityData.first_name || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Address:</strong><br>
                        <span style="font-size: 12px;">${facilityData.representative_address || facilityData.address || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Phone Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.representative_phone || facilityData.phone || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Alternate Phone Number:</strong><br>
                        <span style="font-size: 12px;">${facilityData.alternate_phone || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">TIN:</strong><br>
                        <span style="font-size: 12px;">${facilityData.representative_tin || facilityData.tin || 'N/A'}</span>
                    </div>
                    <div class="mb-1">
                        <strong style="font-size: 12px;">Email Address:</strong><br>
                        <span style="font-size: 12px;">${facilityData.representative_email || facilityData.email || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tax Liabilities -->
        <div class="mb-2">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">TAX LIABILITIES</h6>
            <div>
                ${
                    facilityData.liabilities &&
                    facilityData.liabilities !== 'null' &&
                    facilityData.liabilities.trim() !== ''
                    ? facilityData.liabilities.split('\n').map(tax => `<div class="mb-1" style="font-size: 12px;">${tax}</div>`).join('')
                    : '<div style="font-size: 12px;">No taxes selected</div>'
                }
            </div>
        </div>
    </div>
</div>`;


    document.getElementById('reviewSummary').innerHTML = html;

    // Generate QR code
    if (facilityData.facility_hospital_id) {
        const qrContainer = document.getElementById('qrContainer');
        if (qrContainer) {
            new QRCode(qrContainer, {
                text: `https://plateauigr.com/hospital/enumeration-hospital-preview.html?id=${facilityData.payer_user_id}`,
                width: 150,
                height: 150,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
}

// Load facility details
async function loadFacilityDetails(facilityId) {
    const reviewSummaryElement = document.getElementById('reviewSummary');
    if (!reviewSummaryElement) {
        console.error('Error: reviewSummary element not found in DOM');
        return;
    }

    try {
        const response = await fetch(`https://plateauigr.com/php/index.php?gettHospitalFacilities&facility_hospital_id=${facilityId}`);
        const data = await response.json();

        if (data.status === 1 && data.facilities && data.facilities.length > 0) {
            console.log('Facility details loaded:', data.facilities[0]);
            renderFacilitySummary(data.facilities[0]);
        } else {
            reviewSummaryElement.innerHTML = `
                <div class="alert alert-danger">Facility details not found</div>
            `;
        }
    } catch (error) {
        console.error('Error loading facility details:', error);
        if (reviewSummaryElement) {
            reviewSummaryElement.innerHTML = `
                <div class="alert alert-danger">Error loading facility details. Please try again later.</div>
            `;
        }
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const facilityId = getFacilityIdFromUrl();
    const reviewSummaryElement = document.getElementById('reviewSummary');
    
    if (!reviewSummaryElement) {
        console.error('Error: reviewSummary element not found in DOM');
        return;
    }

    if (facilityId) {
        loadFacilityDetails(facilityId);
    } else {
        reviewSummaryElement.innerHTML = `
            <div class="alert alert-danger">No facility ID provided in URL</div>
        `;
    }
});