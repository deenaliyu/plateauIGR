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


function renderFacilitySummary(facility) {
    const reviewSummaryElement = document.getElementById('reviewSummary');
    if (!reviewSummaryElement) {
        console.error('Error: reviewSummary element not found in DOM');
        return;
    }

    const facilityData = facility || {};
    const typeData = facility.type_data || {};

    // Generate simplified type-specific fields (only 3 fields now)
    const typeSpecificFields = `
        <div class="col-6">
            <div class="mb-1 flex space-x-6">
                <strong style="font-size: 13px;">Number Of Staff:</strong><br>
                <span style="font-size: 13px;">${typeData.number_of_staff || 'N/A'}</span>
            </div>
        </div>
        <div class="col-6">
            <div class="mb-1 flex space-x-6">
                <strong style="font-size: 13px;">Avg New Intakes Per Session:</strong><br>
                <span style="font-size: 13px;">${typeData.avg_new_intakes_per_session || 'N/A'}</span>
            </div>
        </div>
        <div class="col-6">
            <div class="mb-1 flex space-x-6">
                <strong style="font-size: 13px;">Avg Number Of Students:</strong><br>
                <span style="font-size: 13px;">${typeData.avg_number_of_students || 'N/A'}</span>
            </div>
        </div>
    `;

    // Generate branch data HTML
    let branchDataHTML = '';
    const facilityBranches = facility.facility_branches || [];

    // Handle both single object and array cases
    let branchesArray = [];
    if (Array.isArray(facilityBranches)) {
        branchesArray = facilityBranches;
    } else if (facilityBranches && typeof facilityBranches === 'object' && facilityBranches.branch_name) {
        branchesArray = [facilityBranches];
    }

    if (branchesArray.length > 0) {
        branchDataHTML = `
            <div class="row mb-2">
                <div class="col-12">
                    <h6 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Branch Information:</h6>
                </div>
            </div>
        `;

        branchesArray.forEach((branch, index) => {
            branchDataHTML += `
                <div class="row mb-2" style="border-left: 3px solid #CDA545; padding-left: 10px; margin-bottom: 15px;">
                    <div class="col-12">
                        <strong style="font-size: 13px;">Branch ${index + 1}: ${branch.branch_name || 'N/A'}</strong>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Address:</strong><br>
                            <span style="font-size: 13px;">${branch.physical_address || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">City:</strong><br>
                            <span style="font-size: 13px;">${branch.city || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">LGA:</strong><br>
                            <span style="font-size: 13px;">${branch.lga || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Phone:</strong><br>
                            <span style="font-size: 13px;">${branch.phone_numbers || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Email:</strong><br>
                            <span style="font-size: 13px;">${branch.email || 'N/A'}</span>
                        </div>
                    </div>
                    ${branch.website ? `
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Website:</strong><br>
                            <span style="font-size: 13px;">${branch.website}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            `;
        });
    }

    // Render the complete summary
    reviewSummaryElement.innerHTML = `
        <div class="printable-page" style="background: #fff; padding: 20px; position: relative; overflow: hidden;">
            <!-- Watermark -->
            <div class="watermark" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; z-index: 0; pointer-events: none;">
                <img src="./assets/img/logo.png" style="width: 400px; height: 400px;" alt="Watermark">
            </div>

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px; position: relative; z-index: 1;">
                <img src="./assets/img/logo.png" style="width: 80px; margin-bottom: 10px;" alt="Logo">
                <h4 style="margin: 0; font-weight: 600;">Plateau State Internal Revenue Service</h4>
                <p style="margin: 5px 0; font-size: 13px;">Educational Facility Registration Summary</p>
                <p style="margin: 0; font-size: 12px; color: #666;">TIN: ${facilityData.tax_number || 'Pending'}</p>
            </div>

            <hr style="border: 1px solid #CDA545; margin-bottom: 20px;">

            <!-- Basic Information -->
            <div style="position: relative; z-index: 1;">
                <div class="row mb-2">
                    <div class="col-12">
                        <h6 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #CDA545;">Basic Information</h6>
                    </div>
                </div>

                <div class="row">
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Facility Name:</strong><br>
                            <span style="font-size: 13px;">${facilityData.facility_name || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Facility Type:</strong><br>
                            <span style="font-size: 13px;">${formatFacilityType(facilityData.facility_type)}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">CAC/RC Number:</strong><br>
                            <span style="font-size: 13px;">${facilityData.cac_rc_number || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Ownership Type:</strong><br>
                            <span style="font-size: 13px;">${facilityData.ownership_type || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">License Number:</strong><br>
                            <span style="font-size: 13px;">${facilityData.license_number || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">License Expiry:</strong><br>
                            <span style="font-size: 13px;">${facilityData.license_expiry || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Date Established:</strong><br>
                            <span style="font-size: 13px;">${facilityData.date_established || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <hr style="border: 0.5px solid #ddd; margin: 15px 0;">

                <!-- Operations Information -->
                <div class="row mb-2">
                    <div class="col-12">
                        <h6 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #CDA545;">Operations Information</h6>
                    </div>
                </div>

                <div class="row">
                    ${typeSpecificFields}
                </div>

                <hr style="border: 0.5px solid #ddd; margin: 15px 0;">

                <!-- Contact & Location -->
                <div class="row mb-2">
                    <div class="col-12">
                        <h6 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #CDA545;">Contact & Location</h6>
                    </div>
                </div>

                <div class="row">
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Email:</strong><br>
                            <span style="font-size: 13px;">${facilityData.email || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Phone:</strong><br>
                            <span style="font-size: 13px;">${facilityData.phone || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">Address:</strong><br>
                            <span style="font-size: 13px;">${facilityData.address || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">LGA:</strong><br>
                            <span style="font-size: 13px;">${facilityData.lga || 'N/A'}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-1 flex space-x-6">
                            <strong style="font-size: 13px;">State:</strong><br>
                            <span style="font-size: 13px;">${facilityData.state || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                ${branchDataHTML ? `
                <hr style="border: 0.5px solid #ddd; margin: 15px 0;">
                ${branchDataHTML}
                ` : ''}

                <!-- Footer -->
                <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p style="font-size: 11px; color: #666; margin: 5px 0;">Generated on: ${new Date().toLocaleDateString('en-GB')}</p>
                    <p style="font-size: 11px; color: #666; margin: 5px 0;">Plateau State Internal Revenue Service</p>
                    <p style="font-size: 11px; color: #666; margin: 0;">For inquiries, contact: info@plateauigr.com</p>
                </div>
            </div>
        </div>
    `;
}

// Keep all other functions from the original file unchanged
// (printInvoice, getFacilityIdFromUrl, formatFacilityType, parseJsonSafely, formatCurrency, etc.)

// Load facility details
async function loadFacilityDetails(facilityId) {
    const reviewSummaryElement = document.getElementById('reviewSummary');
    if (!reviewSummaryElement) {
        console.error('Error: reviewSummary element not found in DOM');
        return;
    }

    try {
        const response = await fetch(`${HOST}?gettHospitalFacilities&enumeration_id=${facilityId}`);
        const data = await response.json();

        if (data.status === 1 && data.facilities && data.facilities.length > 0) {
            // console.log('Facility details loaded:', data.facilities[0]);
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