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
            // Format the key: replace underscores with spaces and capitalize each word
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let displayValue = value;

            // Handle different value types
            if (typeof value === 'string' && (value.startsWith('[') && value.endsWith(']'))) {
                // Handle JSON arrays (services lists)
                try {
                    const parsedArray = JSON.parse(value);
                    displayValue = Array.isArray(parsedArray) ? parsedArray.join(', ') : value;
                } catch (e) {
                    displayValue = value;
                }
            } else if (key.includes('fee') || key.includes('cost') || key.includes('price')) {
                // Format currency values
                displayValue = formatCurrency(value);
            } else if (key.includes('count')) {
                // Format count values
                displayValue = value || '0';
            }

            typeSpecificFields += `
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">${label}:</strong><br>
                        <span style="font-size: 13px;">${displayValue || 'N/A'}</span>
                    </div>
                </div>
            `;
        }
    }

    // Generate HTML
    const html = `<div class="printable-page bg-white p-3 position-relative">
    <!-- Logo Watermark -->
    <div class="watermark position-absolute w-100 h-100 d-flex align-items-center justify-content-center" 
         style="top: 0; left: 0; z-index: 1; opacity: 0.08; pointer-events: none;">
        <img src="./assets/img/logo.png" style="width: 500px; height: 500px; transform: rotate(-15deg);" alt="Watermark Logo" />
    </div>

    <!-- Content -->
    <div class="position-relative" style="z-index: 2;">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 bg-[#FDF7EF] p-3 rounded">
            <div class="fw-bold" style="font-size: 15px;">PlateauIGR</div>
            <div class="d-flex align-items-center gap-2">
                <img src="./assets/img/logo.png" style="width: 40px; height: 40px;" alt="Logo" />
                <span class="fw-bold" style="font-size: 17px;">ENUMERATION BIODATA</span>
            </div>
            <div style="font-size: 13px;">${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', { hour12: true })}</div>
        </div>

        <!-- Photo and QR Code Row -->
        <div class="d-flex justify-content-between align-items-start mb-4">
            
            <div class="text-center" >
                <div id="qrContainer" style="width: 100px;" ></div>
            </div>

            <!-- Tax Liabilities -->
        <div class="mb-2">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">TAX LIABILITIES</h6>
            <div>
                ${facilityData.liabilities &&
            facilityData.liabilities !== 'null' &&
            facilityData.liabilities.trim() !== ''
            ? facilityData.liabilities.split('\n').map(tax => `<div class="mb-1 flex space-x-6" style="font-size: 13px;">${tax}</div>`).join('')
            : '<div style="font-size: 13px;">No taxes selected</div>'
        }
            </div>
        </div>
        </div>

        <!-- Facility Info -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">FACILITY INFO</h6>
            <div class="row">
                <div class="col-6">
                <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Enumeration ID:</strong><br>
                        <span style="font-size: 13px;">${facilityData.enumeration_id || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Facility Name:</strong><br>
                        <span style="font-size: 13px;">${facilityData.first_name || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Facility Type:</strong><br>
                        <span style="font-size: 13px;">${formatFacilityType(facilityData.facility_type)}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">CAC Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.cac_rc_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Type of Ownership:</strong><br>
                        <span style="font-size: 13px;">${facilityData.ownership_type || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Operating License Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.license_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Issuing Authority:</strong><br>
                        <span style="font-size: 13px;">${facilityData.issuing_authority || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">License Expiry Date:</strong><br>
                        <span style="font-size: 13px;">${facilityData.license_expiry || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">National Health Facility Code:</strong><br>
                        <span style="font-size: 13px;">${facilityData.health_facility_code || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">NHIS Accreditation Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.nhis_number || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Certificate of Standards No.:</strong><br>
                        <span style="font-size: 13px;">${facilityData.certificate_of_standards || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">TIN:</strong><br>
                        <span style="font-size: 13px;">${facilityData.tin || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Date of Establishment:</strong><br>
                        <span style="font-size: 13px;">${facilityData.date_established || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Primary Services Offered:</strong><br>
                        <span style="font-size: 13px;">${facilityData.primary_services || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Type of Major Equipment:</strong><br>
                        <span style="font-size: 13px;">${facilityData.major_equipment || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Number of Employees:</strong><br>
                        <span style="font-size: 13px;">${facilityData.number_of_employees || '0'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Number of Beds:</strong><br>
                        <span style="font-size: 13px;">${facilityData.number_of_beds || '0'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Average Monthly Patient Visits:</strong><br>
                        <span style="font-size: 13px;">${facilityData.avg_monthly_visits || '0'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Number of Surgeries/Procedures per Month:</strong><br>
                        <span style="font-size: 13px;">${facilityData.monthly_surgeries || '0'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Cost of Hospital Card/Registration Fee:</strong><br>
                        <span style="font-size: 13px;">${facilityData.card_fee || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Operations Info -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">OPERATIONS INFO</h6>
            <div class="row">
                ${typeSpecificFields}
            </div>
        </div>

        <!-- Contact & Location -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">CONTACT & LOCATION</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Physical Address:</strong><br>
                        <span style="font-size: 13px;">${facilityData.address || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">City/Town:</strong><br>
                        <span style="font-size: 13px;">${facilityData.lga || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">LGA:</strong><br>
                        <span style="font-size: 13px;">${facilityData.lga || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Phone Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.phone || facilityData.branch_phone_numbers || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Email Address:</strong><br>
                        <span style="font-size: 13px;">${facilityData.email || facilityData.branch_email || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Website:</strong><br>
                        <span style="font-size: 13px;">${facilityData.branch_website || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Latitude:</strong><br>
                        <span style="font-size: 13px;">${facilityData.enumlatitude || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Longitude:</strong><br>
                        <span style="font-size: 13px;">${facilityData.enumlongitude || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Facility Representative -->
        <div class="mb-3">
            <h6 class="fw-bold mb-2" style="font-size: 15px;">FACILITY REPRESENTATIVE</h6>
            <div class="row">
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Full Name of Representative:</strong><br>
                        <span style="font-size: 13px;">${facilityData.rep_firstname + ' ' + facilityData.rep_surname || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Address:</strong><br>
                        <span style="font-size: 13px;">${facilityData.rep_address || facilityData.address || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Phone Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.rep_phone || facilityData.phone || 'N/A'}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Alternate Phone Number:</strong><br>
                        <span style="font-size: 13px;">${facilityData.alternate_phone || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">TIN:</strong><br>
                        <span style="font-size: 13px;">${facilityData.representative_tin || facilityData.tin || 'N/A'}</span>
                    </div>
                    <div class="mb-1 flex space-x-6">
                        <strong style="font-size: 13px;">Email Address:</strong><br>
                        <span style="font-size: 13px;">${facilityData.representative_email || facilityData.email || 'N/A'}</span>
                    </div>
                </div>
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