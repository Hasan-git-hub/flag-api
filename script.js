const api =
  "https://restcountries.com/v3.1/all?fields=name,flags,region,population,capital,languages,currencies";

const cards = document.querySelector(".cards");
const search = document.querySelector("#search");
const btn = document.querySelector("#btn");

let allCountries = [];
let visibleCount = 20;

async function getProducts() {
  try {
    const res = await fetch(api);
    const data = await res.json();
    allCountries = data;
    render();
  } catch (err) {
    console.error(err);
  }
}

function render(filtered = allCountries, reset = true) {
  if (reset) cards.innerHTML = "";
  const slice = filtered.slice(0, visibleCount);
  slice.forEach(createCard);

  if (visibleCount >= filtered.length) {
    moreBtn.style.display = "none";
  } else {
    moreBtn.style.display = "block";
  }
}

function createCard({ flags, name, region, population }) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img class="card-img" src="${flags.png}" alt="${name.common}">
    <h2 class="card-name">${name.common}</h2>
    <div class="region">Region: ${region}</div>
    <div class="population">Population: ${population.toLocaleString()}</div>
  `;
  cards.appendChild(card);
}

cards.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const country = allCountries.find(
    (c) => c.name.common === card.querySelector(".card-name").textContent
  );

  const modal = document.createElement("div");
  modal.className = "modal";

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name + " (" + c.symbol + ")")
        .join(", ")
    : "N/A";
  const capital = country.capital ? country.capital.join(", ") : "N/A";

  modal.innerHTML = `
    <div class="modal-content">
      <img src="${country.flags.png}" alt="${country.name.common}">
      <h2>${country.name.common}</h2>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Languages:</strong> ${languages}</p>
      <p><strong>Currencies:</strong> ${currencies}</p>
      <button class="close">Close</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close").onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
});

search.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase().trim();
  const filtered = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(value)
  );
  visibleCount = 14;
  render(filtered);
});
const moreBtn = document.createElement("button");
moreBtn.textContent = "More";
moreBtn.className = "more-btn";
cards.after(moreBtn);

const regionSelect = document.querySelector("#regionSelect");

regionSelect.addEventListener("change", () => {
  const value = regionSelect.value;

  let filtered = value === "all" ? allCountries : allCountries.filter(
    (country) => country.region === value
  );

  visibleCount = 20;
  render(filtered);
});


moreBtn.addEventListener("click", () => {
  visibleCount += 14;
  const filtered = search.value
    ? allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(search.value.toLowerCase())
      )
    : allCountries;
  render(filtered, false);
});

getProducts();
