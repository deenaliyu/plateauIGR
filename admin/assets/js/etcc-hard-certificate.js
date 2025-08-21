const urlParamshard = new URLSearchParams(window.location.search);
const theid2 = urlParamshard.get('theid');

function getTheYear(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  return year;
}

async function getEtccDetailsHard() {
    try {
        const response = await fetch(`${HOST}/?getETCC&type=ref&id=${theid2}`);
        const etccDetail = await response.json();

        $("#loader").css("display", "none");

        if (etccDetail.status !== 1 || !etccDetail.message || !etccDetail.message[0]) {
            console.error("Invalid response data");
            return;
        }

        let theEtcDetail = etccDetail.message[0];

        // Helper functions
        const getValue = (value, isMoney = false, defaultValue = 'N/A') => {
            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }
            if (isMoney) {
                return `₦ ${parseFloat(value).toLocaleString()}`;
            }
            return value;
        };

        const getExpiryYear = (dateString) => {
            if (!dateString) return new Date().getFullYear() + 1;
            try {
                const date = new Date(dateString);
                // Certificate expires at the end of the following year
                return date.getFullYear() + 1;
            } catch {
                return new Date().getFullYear() + 1;
            }
        };

        // Generate assessment rows with all columns
        let assessmentRows = '';
        let yearsCount = 0;
        for (let i = 1; i <= 3; i++) {
            const year = theEtcDetail[`year${i}`];
            if (!year) continue;

            yearsCount++;
            assessmentRows += `
                <tr>
                    <td class="text-sm">${getValue(year)}</td>
                    <td class="text-sm">${getValue(theEtcDetail[`income${i}`], true)}</td>
                    <td class="text-sm">${getValue(theEtcDetail[`taxable_income_${i}`], true)}</td>
                    <td class="text-sm">${getValue(theEtcDetail[`tax_paid_${i}`], true)}</td>
                    <td class="text-sm">${getValue(theEtcDetail[`receipt_no_${i}`])}</td>
                </tr>
            `;
        }

        // Generate the HTML with all columns
        $("#receiptHardCopy").html(`
            <div class="px-6" style="height: 260px; margin-left: 150px">
                <div class="flex justify-end mt-5">
                    <div>
                        <div>
                            <p class="text-sm text-center">Certificate Number</p>
                            <div class="border border-2 p-2" style="border: 2px solid #000 !important">
                                <p class="text-xs" style="color: brown">${getValue(theEtcDetail.etcc_no)}</p>
                            </div>
                        </div>

                        <div class="flex justify-center mt-[100px]">
                            <div id="qrContainer" class="w-[100px] h-[100px]"></div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="px-6 mt-4">
                <table>
                    <tr>
                        <th class="fontBold text-black pr-4">Name:</th>
                        <td>${getValue(theEtcDetail.fullname)}</td>
                    </tr>
                    <tr>
                        <th class="fontBold text-black pr-4">Email:</th>
                        <td>${getValue(theEtcDetail.email)}</td>
                    </tr>
                    <tr>
                        <th class="fontBold text-black pr-4">Address:</th>
                        <td>${getValue(theEtcDetail.address)}</td>
                    </tr>
                    <tr>
                        <th class="fontBold text-black pr-4">TIN:</th>
                        <td>${getValue(theEtcDetail.applicant_tin)}</td>
                    </tr>
                    <tr>
                        <th class="fontBold text-black pr-4">Sector:</th>
                        <td>${getValue(theEtcDetail.private_or_public)}</td>
                    </tr>
                </table>
            </div>
    
            <p class="px-6">This is to certify that Taxpayer with Tax Identification Number <span
                class="text-lg fontBold text-black">${getValue(theEtcDetail.applicant_tin)}</span> has settled his/her tax
                assessment for the following ${yearsCount} year(s) for the specified source of income.</p>
    
            <div class="px-6 mt-4">
                <p class="fontBold text-xl text-black mb-2">Details of Assessment</p>
    
                <table class="table table-borderless table-sm">
                    <thead>
                        <tr>
                            <td class="text-sm">Year</td>
                            <td class="text-sm">Total Income</td>
                            <td class="text-sm">Taxable Income</td>
                            <td class="text-sm">Tax Paid</td>
                            <td class="text-sm">Receipt No.</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${assessmentRows}
                    </tbody>
                </table>
    
                <table>
                    <tr>
                        <th class="text-black fontBold pr-4">Source of Income:</th>
                        <td>${getValue(theEtcDetail.sector)}</td>
                    </tr>
                    <tr>
                        <th class="text-black fontBold pr-4">Expiry Date:</th>
                        <td>31 December 2025</td>
                    </tr>
                </table>
            </div>
    
            <div class="flex justify-around items-center px-6 mt-5">
                <div class="sig1 w-4/12">
                    <div class="border-b-2"></div>
                    <p class="fontBold text-black text-center mt-1">Official date and stamp</p>
                </div>
    
                <div class="sig2 w-4/12">
                    <div class="border-b-2"></div>
                    <p class="fontBold text-black text-center mt-1">Official date and stamp</p>
                </div>
            </div>
    
            <p class="text-center">${yearsCount} year(s) copies of Official receipts MUST be attached to this certificate to
                make it valid</p>
    
            <hr class="my-3 md:mx-10 mx-4">
            <p class="text-center text-xs fontBold">NB: ANY CORRECTION OR ALTERATION MAKE THIS CERTIFICATE INVALID</p>
        `);

        // Generate QR code
        const qrCodeContainer = document.getElementById("qrContainer");
        if (qrCodeContainer) {
            new QRCode(qrCodeContainer, {
                text: `https://plateauigr.com/dashboard/etcc-preview.html?theid=${theEtcDetail.refe}`,
                colorDark: '#000000',
                colorLight: '#ffffff',
                version: 10,
            });
        }
    } catch (error) {
        console.error("Error in getEtccDetailsHard:", error);
        $("#loader").css("display", "none");
        // Optionally show error message to user
    }
}


getEtccDetailsHard()

function printInvoiceHard(thecard) {
    var originalContent = document.body.innerHTML;
  
    document.querySelector("#receiptHardCopy").classList.remove('hidden')
  
    var printContent = document.getElementById(thecard).innerHTML;
  
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  
  }