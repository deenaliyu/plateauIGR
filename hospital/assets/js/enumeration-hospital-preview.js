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
    const html = `
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-header">
                        <h6>Basic Information</h6>
                    </div>
                    <div class="card-body">
                        <table class="table table-sm">
                         <tr>
                                <th>Full Name:</th>
                                <td>${facilityData.first_name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Facility Name:</th>
                                <td>${facilityData.branch_name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Facility Type:</th>
                                <td>${formatFacilityType(facilityData.facility_type)}</td>
                            </tr>
                            <tr>
                                <th>Registration ID:</th>
                                <td>${facilityData.facility_hospital_id || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Owner Address:</th>
                                <td>${facilityData.address || 'N/A'}</td>
                            <tr>
                                <th>Address:</th>
                                <td>${facilityData.physical_address || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>City:</th>
                                <td>${facilityData.city || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>LGA:</th>
                                <td>${facilityData.lga || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>State:</th>
                                <td>${facilityData.state || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Branch Phone:</th>
                                <td>${facilityData.branch_phone_numbers || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Main Phone:</th>
                                <td>${facilityData.phone || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Branch Email:</th>
                                <td>${facilityData.branch_email || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Main Email:</th>
                                <td>${facilityData.email || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Website:</th>
                                <td>${facilityData.branch_website ? `<a href="${facilityData.branch_website}" target="_blank">${facilityData.branch_website}</a>` : 'N/A'}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h6>Operational Details</h6>
                    </div>
                    <div class="card-body">
                        <table class="table table-sm">
                            <tr>
                                <th>Number of Beds:</th>
                                <td>${facilityData.number_of_beds || '0'}</td>
                            </tr>
                            <tr>
                                <th>Average Monthly Visits:</th>
                                <td>${facilityData.avg_monthly_visits || '0'}</td>
                            </tr>
                            ${typeSpecificFields}
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-header">
                        <h6>Services Offered</h6>
                    </div>
                    <div class="card-body">
                        <h6 class="mb-3">Primary Services:</h6>
                        <ul class="list-group mb-4">
                            ${primaryServices.length > 0 ?
                            primaryServices.map(service => `<li class="list-group-item">${service}</li>`).join('') :
                            '<li class="list-group-item text-muted">No primary services listed</li>'}
                        </ul>
                        
                        <h6 class="mb-3">All Services:</h6>
                        <ul class="list-group">
                            ${servicesOffered.length > 0 ?
                            servicesOffered.map(service => `<li class="list-group-item">${service}</li>`).join('') :
                            '<li class="list-group-item text-muted">No services listed</li>'}
                        </ul>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h6>Tax Liabilities</h6>
                    </div>
                    <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item">PAYE</li>
                            <li class="list-group-item">Development Levy</li>
                            <li class="list-group-item">Business Premise Levy</li>
                            <li class="list-group-item">Environmental and Waste Management Fees</li>
                            <li class="list-group-item">Shop/Trade Permit</li>
                            <li class="list-group-item">Tenement Rate</li>
                            <li class="list-group-item">Bill Board Levy</li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h6>Facility QR Code</h6>
                    </div>
                    <div class="card-body text-center">
                        <div id="qrContainer" class="qr-code-container"></div>
                        <p class="mt-2 small text-muted">Scan to view facility details</p>
                    </div>
                </div>
            </div>
        </div>
    `;

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