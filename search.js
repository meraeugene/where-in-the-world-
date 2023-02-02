//global variables
let info = [];
const searchFlagContainer = document.querySelector(".searched_flag_container");
const errorContainer = document.querySelector(".error");
const loader = document.querySelector(".loading-main-container");
// Retrieve the value of the search bar in new-page.html
const searchValue = localStorage.getItem("searchValue");

//backbtn function
const backBtn = document.querySelector("#backBtn");

backBtn.addEventListener("click", () => {
  window.open("index.html", "_self");
});

const fetchSpecificFlag = async (query) => {
  // show the loader
  loader.classList.remove("loader-hidden");

  // your existing code here

  const url = `https://restcountries.com/v3.1/name/${query}?fullText=true`;
  const response = await fetch(url);
  const data = await response.json();

  // check if data length is greater than 0
  if (data.length > 0) {
    // display flag information

    info = data.map((flag) => {
      //convert mo anay ang object to array gamit ang object.values mo tapos i map mo para makwa mo ang specific currencies or object that u want

      let currencies = "N/A";
      if (typeof flag.currencies !== "undefined") {
        currencies = Object.values(flag.currencies).map(
          (currency) => currency.name
        );
      }
      // check if the nativeName property is defined before trying to access it.
      let nativeNames = "N/A";
      if (typeof flag.name.nativeName !== "undefined") {
        nativeNames = Object.values(flag.name.nativeName).map(
          (native) => native.common
        );
      }

      // check if the languages property is defined before trying to access it.
      let languages = "N/A";
      if (typeof flag.languages !== "undefined") {
        languages = Object.values(flag.languages);
        //arrange to alphabetical order with undefined values
        languages.sort((a, b) =>
          a !== undefined &&
          b !== undefined &&
          a.name !== undefined &&
          b.name !== undefined
            ? a.name.localeCompare(b.name)
            : a === undefined
            ? 1
            : -1
        );
      }

      // check if the elements in the flag.borders array are defined before trying to access them.
      const borderCountries = [];
      for (let i = 0; i < 3; i++) {
        if (typeof flag.borders !== "undefined" && flag.borders[i]) {
          borderCountries.push(flag.borders[i]);
        } else {
          borderCountries.push("N/A");
        }
      }

      return {
        name: flag.name.common,
        native_name: nativeNames,
        population: flag.population,
        region: flag.region,
        subregion: flag.subregion,
        capital: flag.capital,
        currencies: currencies,
        top_level_domain: flag.tld.shift(),
        languages: languages,
        first_border_country: borderCountries[0],
        second_border_country: borderCountries[1],
        third_border_country: borderCountries[2],
        image: flag.flags.svg,
      };
    });

    let container = "";

    info.forEach((flag) => {
      container += ` <div class="flex-container">
      <div class="flag_img">
        <img src="${flag.image}" alt="" />
      </div>
      <div class="flag_info">
        <div class="flag_title">
          <h1>${flag.name}</h1>
        </div>
        <div class="flag_desc">
          <div class="left_desc">
            <p><span class="bold ">Native Name:</span> ${flag.native_name.slice(
              0,
              2
            )}</p>
            <p><span class="bold">Population:</span> ${flag.population.toLocaleString()}</p>
            <p><span class="bold">Region:</span> ${flag.region}</p>
            <p><span class="bold">Sub Region:</span> ${flag.subregion}</p>
            <p><span class="bold">Capital:</span> ${flag.capital}</p>
          </div>
          <div class="right_desc">
            <p><span class="bold">Top Level Domain:</span> ${
              flag.top_level_domain
            }</p>
            <p><span class="bold">Currencies:</span> ${flag.currencies}</p>
            <p><span class="bold languages">Languages:</span> ${
              flag.languages
            }</p>
          </div>
        </div>
        <div class="border_countries">
          <span class="bold">Border Countries:</span>
          <p>${flag.first_border_country}</p>
          <p>${flag.second_border_country}</p>
          <p>${flag.third_border_country}</p>
        </div>
      </div>
    </div>`;
    });

    searchFlagContainer.innerHTML = container;
  } else {
    //searching text feature
    let text = "Searching... ";
    let i = 0;

    const typing = () => {
      if (i < text.length) {
        errorContainer.innerHTML += `<span class="error-text">${text.charAt(
          i
        )}</span>`;
        i++;
        setTimeout(typing, 30);
      }
    };

    typing();

    //query shows
    let j = 0;
    let queryText = ` "${query}"`;

    const typingQuery = () => {
      if (j < queryText.length) {
        errorContainer.innerHTML += `<span class="error-text">${queryText.charAt(
          j
        )}</span>`;
        j++;
        setTimeout(typingQuery, 30);
      }
    };

    setTimeout(() => {
      typingQuery();
    }, text.length * 100);

    //error message feature
    setTimeout(() => {
      let k = 0;
      const message =
        "Sorry, we couldn't find any results for your search. Please try again with a different keyword or check your spelling and try again.";
      const interval = setInterval(() => {
        if (k === 0) {
          errorContainer.innerHTML = "";
        }
        errorContainer.innerHTML += `<span class="error-text">${message[k]}</span>`;
        k++;
        if (k === message.length) {
          clearInterval(interval);
        }
      }, 30);
    }, 3000);
  }

  if (data.length > 0) {
    // hide the loader
    loader.classList.add("loader-hidden");

    // display flag information
    // ...
  } else {
    // hide the loader
    loader.classList.add("loader-hidden");

    // display error message
    // ...
  }
};

fetchSpecificFlag(searchValue);

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

//return home page
const title = document.querySelector(".title");

title.addEventListener("click", () => {
  window.open("index.html", "_self");
});

// automatic date
const date = document.querySelector("#date");
date.innerHTML = new Date().getFullYear();
