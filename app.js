//the grid container variable
const flagContainer = document.querySelector(".flags-grid");

//global variables
let info = [];
let allData = `https://restcountries.com/v3.1/all`;

//display flags function
const fetchFlags = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  displayCountryCards(data);
};

fetchFlags(allData);

const displayCountryCards = (data) => {
  info = data.map((flag) => {
    return {
      name: flag.name.common,
      image: flag.flags.png,
      population: flag.population,
      region: flag.region,
      capital: flag.capital,
    };
  });

  let container = "";

  info.forEach((flag) => {
    container += `
    <div class="card">
    <div class="img-container">
      <img src="${flag.image}" alt="" />
    </div>
    <div class="info-container">
      <h2>${flag.name}</h2>
      <p><span>Population:</span> ${flag.population.toLocaleString()}</p>
      <p><span>Region:</span> ${flag.region}</p>
      <p><span>Capital:</span> ${flag.capital}</p>
    </div>
  </div>
    `;
  });

  flagContainer.innerHTML = container;
};

//filter button functions

const filterBtn = document.querySelector(".filter_button");
const options = document.querySelector(".options");
const countries = document.querySelectorAll(".country");
const title = document.querySelector(".replace");

filterBtn.addEventListener("click", () => {
  options.classList.toggle("show-options");

  countries.forEach((country) => {
    country.addEventListener("click", (e) => {
      const specificRegion = e.currentTarget.dataset.id;
      title.textContent = specificRegion;

      let container = "";

      info.forEach((flag) => {
        const { capital, image, name, population, region } = flag;

        if (specificRegion === region) {
          container += `<div class="card">
          <div class="img-container">
            <img src="${image}" alt="" />
          </div>
          <div class="info-container">
            <h2>${name}</h2>
            <p><span>Population:</span> ${population.toLocaleString()}</p>
            <p><span>Region:</span> ${region}</p>
            <p><span>Capital:</span> ${capital}</p>
          </div>
        </div>`;
        }
      });

      flagContainer.innerHTML = container;
    });
  });
});

//search function

// Store the value of the search bar in localStorage
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    localStorage.setItem("searchValue", searchBar.value);
    window.open("searchedFlag.html", "_self");
  }
});

//dark mode feature

const darkModeBtn = document.querySelector("#darkmodeBtn");
const body = document.querySelector(".body");
const header = document.querySelector(".header");

darkModeBtn.addEventListener("click", () => {
  header.classList.toggle("darkmode");
  body.classList.toggle("darkmode");
  localStorage.setItem(
    "darkModeEnabled",
    //returns true if the header contains darkmode class else return false if not enabled
    header.classList.contains("darkmode")
  );
});

const darkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";

if (darkModeEnabled) {
  header.classList.toggle("darkmode");
  body.classList.toggle("darkmode");
}
