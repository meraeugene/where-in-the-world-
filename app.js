const flagContainer = document.querySelector(".flags-grid");
const navigationContainer = document.createElement("div");
navigationContainer.classList.add("navigation-container");

//global variables
let info = [];
let currentPage = 1;
const itemsPerPage = 20;

//display flags function
const fetchFlags = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  displayCountryCards(data);
};

const displayCountryCards = (data) => {
  info = [...data];

  // sort the info array based on the common name of the country
  info.sort((a, b) => a.name.common.localeCompare(b.name.common));

  const totalPages = Math.ceil(info.length / itemsPerPage);
  let displayedPages = totalPages > 5 ? 5 : totalPages;

  let container = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  for (let i = startIndex; i < endIndex && i < info.length; i++) {
    const flag = info[i];
    container += `
    <div class="card">
      <div class="img-container">
        <img src="${flag.flags.svg}" alt="" />
      </div>
      <div class="info-container">
        <h2>${flag.name.common}</h2>
        <p><span>Population:</span> ${flag.population.toLocaleString()}</p>
        <p><span>Region:</span> ${flag.region}</p>
        <p><span>Capital:</span> ${flag.capital}</p>
      </div>
    </div>
    `;
  }

  flagContainer.innerHTML = container;

  // Add click event listener to each flag
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      localStorage.setItem("searchValue", info[startIndex + index].name.common);
      window.open("searchedFlag.html", "_self");
    });
  });

  // Remove all child elements of the navigation container
  while (navigationContainer.firstChild) {
    navigationContainer.removeChild(navigationContainer.firstChild);
  }

  // add previous and next buttons
  const prevButton = document.createElement("button");
  prevButton.classList.add("btn-prev");
  prevButton.innerText = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage--;
    displayCountryCards(info);
    window.scrollTo({
      top: 0,
    });
  });

  flagContainer.appendChild(prevButton);

  navigationContainer.appendChild(prevButton);

  const pageNumbers = document.createElement("div");
  pageNumbers.classList.add("page-numbers");

  let start = currentPage - 2;
  if (currentPage > totalPages - 4) {
    start = totalPages - 4;
  }
  if (start < 1) {
    start = 1;
  }

  let end = start + 4;
  if (end > totalPages) {
    end = totalPages;
  }

  for (let i = start; i <= end; i++) {
    const pageNumber = document.createElement("button");
    pageNumber.innerText = i;
    pageNumber.classList.add("page-number");
    pageNumber.disabled = i === currentPage;
    pageNumber.addEventListener("click", () => {
      currentPage = i;
      displayCountryCards(info);
      window.scrollTo({
        top: 0,
      });
    });
    pageNumbers.appendChild(pageNumber);
  }

  flagContainer.appendChild(pageNumbers);

  navigationContainer.appendChild(pageNumbers);

  const nextButton = document.createElement("button");
  nextButton.classList.add("btn-next");
  nextButton.innerText = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage++;
    displayCountryCards(info);
    window.scrollTo({
      top: 0,
    });
  });
  flagContainer.appendChild(nextButton);

  navigationContainer.appendChild(nextButton);

  flagContainer.after(navigationContainer);
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
      let specificRegion = e.currentTarget.dataset.id;
      title.textContent = specificRegion;

      if (specificRegion === "All") {
        document.location.reload();
      } else {
        navigationContainer.innerHTML = "";
      }

      // filter the info array based on the selected region
      const filteredInfo = info.filter(
        (flag) => flag.region === specificRegion
      );

      let container = "";

      filteredInfo.forEach((flag) => {
        container += `<div class="card">
            <div class="img-container">
              <img src="${flag.flags.svg}" alt="" />
            </div>
            <div class="info-container">
              <h2>${flag.name.common}</h2>
              <p><span>Population:</span> ${flag.population.toLocaleString()}</p>
              <p><span>Region:</span> ${flag.region}</p>
              <p><span>Capital:</span> ${flag.capital}</p>
            </div>
          </div>`;
      });
      flagContainer.innerHTML = container;
    });
  });
});

fetchFlags("https://restcountries.com/v3.1/all");

//<-----------------SEARCH FUNCTIONS------------>
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");

searchBar.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    localStorage.setItem("searchValue", searchBar.value.trim());
    window.open("searchedFlag.html", "_self");
  }

  if (searchBar.value.length > 2) {
    fetch(`https://restcountries.com/v3.1/name/${searchBar.value.trim()}`)
      .then((response) => response.json())
      .then((data) => {
        searchResults.innerHTML = "";
        data.forEach((result) => {
          const name = result.name.common;
          searchResults.innerHTML += `<div class="flex-flag">
            <div>
            <img src="${result.flags.svg}" alt="" width="50px">
            </div>
          </ion-icon> ${name} </div>`;
        });

        searchResults.style.display = "block";

        // Add click event listeners to each search result
        const searchResultItems = searchResults.querySelectorAll(".flex-flag");
        searchResultItems.forEach((item) => {
          item.addEventListener("click", function (e) {
            searchBar.value = e.target.textContent;
            searchResults.style.display = "none";
            localStorage.setItem("searchValue", searchBar.value.trim());
            window.open("searchedFlag.html", "_self");
          });
        });
      });
  } else {
    searchResultsList.innerHTML = "";
    searchResults.style.display = "none";
  }
});

//<-----------------DARK MODE FUNCTIONS------------>
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
