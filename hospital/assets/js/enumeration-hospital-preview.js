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
    const html = `
        <div class="printable-page">
            <h1 class="font-bold text-xl text-center">Enumeration Biodata</h1>
            <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="row">
                                <!-- Left Column - Basic Info -->
                                <div class="col-6">
                                    <div class="info-section">
                                        <h5 class="section-title">Basic Information</h5>
                                        <table class="table table-sm table-borderless">
                                            <tr>
                                                <th width="40%">Full Name:</th>
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
                                            </tr>
                                            <tr>
                                                <th>Physical Address:</th>
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
                                        </table>
                                    </div>
                                    
                                    <div class="info-section mt-4">
                                        <h5 class="section-title">Contact Information</h5>
                                        <table class="table table-sm table-borderless">
                                            <tr>
                                                <th width="40%">Branch Phone:</th>
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

                                        <div id="qrContainer" class="qr-code-container mx-auto"></div>
                                    </div>
                                </div>
                                
                                <!-- Right Column - Operational Details -->
                                <div class="col-6">
                                    <div class="info-section">
                                        <h5 class="section-title">Operational Details</h5>
                                        <table class="table table-sm table-borderless">
                                            <tr>
                                                <th width="40%">Number of Beds:</th>
                                                <td>${facilityData.number_of_beds || '0'}</td>
                                            </tr>
                                            <tr>
                                                <th>Average Monthly Visits:</th>
                                                <td>${facilityData.avg_monthly_visits || '0'}</td>
                                            </tr>
                                            ${typeSpecificFields}
                                        </table>
                                    </div>
                                    
                                    <div class="info-section mt-4">
                                        <h5 class="section-title">Services Offered</h5>
                                        <div class="services-container">
                                            <div class="services-column">
                                                <h6>Primary Services:</h6>
                                                <ul class="list-unstyled">
                                                    ${primaryServices.length > 0 ?
                                                    primaryServices.map(service => `<li>• ${service}</li>`).join('') :
                                                    '<li class="text-muted">No primary services listed</li>'}
                                                </ul>
                                            </div>
                                            <div class="services-column">
                                                <h6>All Services:</h6>
                                                <ul class="list-unstyled">
                                                    ${servicesOffered.length > 0 ?
                                                    servicesOffered.map(service => `<li>• ${service}</li>`).join('') :
                                                    '<li class="text-muted">No services listed</li>'}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="info-section mt-4">
                                        <h5 class="section-title">Tax Liabilities</h5>
                                        <div class="tax-liabilities">
                                            <ul class="list-unstyled row">
                                                <li class="col-6">• PAYE</li>
                                                <li class="col-6">• Development Levy</li>
                                                <li class="col-6">• Business Premise Levy</li>
                                                <li class="col-6">• Environmental Fees</li>
                                                <li class="col-6">• Shop/Trade Permit</li>
                                                <li class="col-6">• Tenement Rate</li>
                                                <li class="col-6">• Bill Board Levy</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
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