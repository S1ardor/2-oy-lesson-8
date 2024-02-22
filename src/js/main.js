// movies resut
const elMoviesReult = document.querySelector(".js-movies-result");
const elTemplate = document.querySelector(".js-template").content;
const moviesShorten = movies.slice(0, 50);

const runtimeToMin = (runtime) => {
  const hour = Math.floor(Number(runtime / 60));
  const minuts = Number(runtime % 60);
  return `${hour} hur ${minuts} min`;
};

const moviesRender = (array, node) => {
  const docFrag = document.createDocumentFragment();
  node.innerHTML = "";

  array.forEach((movie) => {
    const moviesClone = elTemplate.cloneNode(true);

    moviesClone.querySelector(".js-movies-img").src = movie.img_url;
    moviesClone.querySelector(".js-movies-img").alt = movie.img_alt;
    moviesClone.querySelector(".js-movies-title").textContent =
      movie.title.toString().split(" ").length > 2
        ? movie.title.toString().split(" ").slice(0, 2).join(" ")
        : movie.title;
    moviesClone.querySelector(".js-movies-rating").textContent =
      movie.imdb_rating;
    moviesClone.querySelector(".js-movies-year").textContent = movie.movie_year;
    moviesClone.querySelector(".js-movies-runtime").textContent = runtimeToMin(
      movie.runtime
    );
    moviesClone.querySelector(".js-movies-categories").textContent =
      movie.categories.toString().slice(0, 19).replaceAll(",", ", ");
    moviesClone.querySelector(".js-modal-btn").dataset.imdbId = movie.imdb_id;

    docFrag.appendChild(moviesClone);
  });
  node.appendChild(docFrag);
};
moviesRender(moviesShorten, elMoviesReult);

// search function
const elForm = document.querySelector(".js-movies-form");
const elInput = elForm.querySelector(".js-movies-input");
const elNotSearch = document.querySelector(".js-movies-not-search");
elForm.addEventListener("input", (evt) => {
  evt.preventDefault();
  const inputValue = elInput.value.trim();
  const regExp = new RegExp(inputValue, "gi");
  const moviesFilter = movies.filter((item) => {
    return String(item.title).match(regExp);
  });
  if (moviesFilter.length > 0) {
    moviesRender(moviesFilter, elMoviesReult);
    // console.log(moviesFilter);
    elNotSearch.classList.add("hidden");
  } else {
    moviesRender(moviesFilter, elMoviesReult);
    elNotSearch.classList.remove("hidden");
  }
  if (inputValue === "") {
    moviesRender(moviesShorten, elMoviesReult);
  }
  highlightSearchResult(inputValue);
});
function highlightSearchResult(searchTerm) {
  const movieElements = document.querySelectorAll(".js-movies-result");
  movieElements.forEach((movieElement) => {
    const titleElement = movieElement.querySelector(".js-movies-title");
    const title = titleElement.textContent;
    const highlightedTitle = title.replace(
      new RegExp(searchTerm, "gi"),
      (match) => `<span style="background-color: red">${match}</span>`
    );
    titleElement.innerHTML = highlightedTitle;
  });
}

// movies Category
const elFunctionalfn = document.querySelector(".js-movies-functional-form");
const elMoviesCategory = elFunctionalfn.querySelector(".js-movies-categoriy");
const elMinYear = document.querySelector(".js-min-year");
const elMaxYear = document.querySelector(".js-max-year");

const categoriIncludesfn = (category) => {
  const contryCategory = [];
  category.forEach((categorie) => {
    let categoryLoops = categorie.categories;
    categoryLoops.forEach((categorie) => {
      if (!contryCategory.includes(categorie)) {
        contryCategory.push(categorie);
      }
    });
  });
  return contryCategory;
};

// Cotegory render
function categoriRenderfn() {
  let renderCotegory = categoriIncludesfn(movies);
  const cotegoriDocFrg = document.createDocumentFragment();
  renderCotegory.forEach((item) => {
    const newOption = document.createElement("option");
    newOption.textContent = item;
    newOption.value = item;
    cotegoriDocFrg.appendChild(newOption);
  });
  elMoviesCategory.appendChild(cotegoriDocFrg);
}

elFunctionalfn.addEventListener("submit", (evt) => {
  evt.preventDefault();
  // Max Min Year
  elFunctionalfn.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const minYearValue = parseInt(elMinYear.value);
    const maxYearValue = parseInt(elMaxYear.value);

    const formData = new FormData(evt.target);
    const categoriValue = formData.get("categori");

    let filteredMovies = moviesShorten.filter((movie) => {
      // Filter min and max year
      const movieYear = parseInt(movie.movie_year);
      if (movieYear < minYearValue || movieYear > maxYearValue) {
        return false;
      }
      if (categoriValue !== "all") {
        return movie.categories.includes(categoriValue);
      }
      return true;
    });

    moviesRender(filteredMovies, elMoviesReult);
  });
});
categoriRenderfn();

// modal
const modal = document.querySelector(".js-modal");
const elMoviesVideos = modal.querySelector(".js-moda-video");
const elMoviesTitle = modal.querySelector(".js-modal-title");
const elMoviesRuntime = modal.querySelector(".js-modal-runtime");
const elMoviesYear = modal.querySelector(".js-modal-year");
const elMoviesHover = modal.querySelector(".js-modal-hour");
const elModalCatigory = modal.querySelector(".js-modal-catigory");
const elModalSummary = modal.querySelector(".js-modal-summary");
const elModalLink = document.querySelector(".js-movies-link");

const moviesModalRender = (findMovies) => {
  elMoviesVideos.src = findMovies.iframe_link;
  elMoviesTitle.textContent = findMovies.title;
  elMoviesRuntime.textContent = findMovies.imdb_rating;
  elMoviesYear.textContent = findMovies.movie_year;
  elMoviesHover.textContent = findMovies.runtime;
  elModalCatigory.textContent = findMovies.categories;
  elModalSummary.textContent = findMovies.summary;
  elModalLink.href = findMovies.imdb_link;
};

elMoviesReult.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (evt.target.matches(".js-modal-btn")) {
    const idbId = evt.target.dataset.imdbId;
    modal.classList.remove("hidden");
    movies.find((item) => {
      if (item.imdb_id === idbId) {
        moviesModalRender(item);
      }
    });
  }
});

// modal hidden btn
const elModalContronHidden = document.querySelector(".js-modal-control");
elModalContronHidden.addEventListener("click", (evt) => {
  evt.preventDefault();
  modal.classList.add("hidden");
});

// search marck:
// const handleKey = (evt) => {
//   if (evt.target.value.length) {
//     // const filterMovies = movies.filter((item) =>
//     //   item.title
//     //     .toString()
//     //     .toLowerCase()
//     //     .includes(evt.target.value.toLowerCase())
//     // );
//     document.querySelectorAll(".js-movie-li").forEach((item) => {
//       let movieTitle = item.querySelector(".js-movies-title");
//       const regex = new RegExp(evt.target.value, "gi");
//       console.log(movieTitle.textContent.match(regex));
//       if (movieTitle.textContent.match(regex)) {
//         console.log(movieTitle);
//       } else {
//         console.log("Xato");
//       }
//     });
//   }
// };
// search.addEventListener("change", handleKey);
