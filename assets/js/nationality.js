document.addEventListener("DOMContentLoaded", async () => {
  const baseUrl = "https://www.universal-tutorial.com/api";
  const authTokenUrl = `${baseUrl}/getaccesstoken`;
  const countriesUrl = `${baseUrl}/countries/`;
  const statesUrl = `${baseUrl}/states/`;
  const citiesUrl = `${baseUrl}/cities/`;

  const headers = {
    Accept: "application/json",
    "api-token": "qWNFe5zUU7d167GKRy-8Nwepm_yoXp_k8e34I8izZM1s_ElCXh5IOdixnWRFzY4LMf4", // Replace with your API token
    "user-email": "aliyukamilu002@gmail.com"    // Replace with your registered email
  };

  let accessToken = "";

  // Fetch Access Token
  async function getAccessToken() {
    const response = await fetch(authTokenUrl, { headers });
    if (!response.ok) {
      console.error("Failed to get access token");
      return;
    }
    const data = await response.json();
    accessToken = data.auth_token;
  }

  // Fetch Countries
  async function getCountries() {
    const response = await fetch(countriesUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.json();
  }

  // Fetch States by Country
  async function getStates(country) {
    const response = await fetch(`${statesUrl}${country}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.json();
  }

  // Fetch Cities by State
  async function getCities(state) {
    const response = await fetch(`${citiesUrl}${state}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.json();
  }

  // Populate dropdown options
  function populateDropdown(dropdown, data, key = "country_name") {
    dropdown.innerHTML = `<option value="" disabled selected>Select</option>`;
    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item[key];
      option.textContent = item[key];
      dropdown.appendChild(option);
    });
  }

  // Initialize
  async function initialize() {
    await getAccessToken();

    const nationalitySelect = document.getElementById('nationality');
    const stateSelect = document.getElementById("selectthestate");
    const lgaSelect = document.getElementById("selectthelga");

    // Fetch and populate countries
    const countries = await getCountries();
    populateDropdown(nationalitySelect, countries);

    // Event listener for country selection
    nationalitySelect.addEventListener("change", async () => {
      const selectedCountry = nationalitySelect.value;
      const states = await getStates(selectedCountry);
      populateDropdown(stateSelect, states, "state_name");

      // Clear LGA dropdown
      lgaSelect.innerHTML = `<option value="" disabled selected>Select</option>`;
    });

    // Event listener for state selection
    stateSelect.addEventListener("change", async () => {
      const selectedState = stateSelect.value;
      const cities = await getCities(selectedState);
      populateDropdown(lgaSelect, cities, "city_name");
    });
  }

  initialize();
});
