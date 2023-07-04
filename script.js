/** Variáveis */
let body = document.querySelector("body");
let header = document.querySelector("header");
let headerTitle = document.querySelector(".header__title");
let headerContainer = document.querySelector(".header__container-logo img");
let moviesContainer = document.querySelector(".movies-container");

const moviesDiv = document.querySelector(".movies");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
let btnTheme = document.querySelector(".btn-theme");
const input = document.querySelector(".input");

const highlightDiv = document.querySelector(".highlight");
const hlVideo = document.querySelector(".highlight__video");
const hlVideoLink = document.querySelector(".highlight__video-link");
const hlTitle = document.querySelector(".highlight__title");
const hlRating = document.querySelector(".highlight__rating");
const hlGenres = document.querySelector(".highlight__genres");
const hlLaunch = document.querySelector(".highlight__launch");
const hlDescription = document.querySelector(".highlight__description");

let results;
let moviePage = 0;

const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal__body");
const modalClose = document.querySelector(".modal__close");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalAverage = document.querySelector(".modal__average");
const modalDescription = document.querySelector(".modal__description");
let modalGenres = document.querySelector(".modal__genres");
let spanModal;

/** Variáveis */

init();

function init() {
  getMovies();
  getMovieOfTheDay();
  getVideo();
}

/** FUNÇÕES -> CONSUMINDO END POINTS (início) */

async function getMovies() {
  try {
    const response = await axios.get(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
    );
    results = response.data.results;
    renderMovies(results);
  } catch (error) {
    console.log(error.response);
  }
}

async function getModal(id) {
  try {
    const response = await axios.get(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
    );
    results = response.data;
    return results;
  } catch (error) {
    console.log(error.response);
  }
}

async function getMovieOfTheDay() {
  try {
    const response = await axios.get(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
    );
    results = response.data;
    renderMovieOfTheDay(results);
  } catch (error) {
    console.log(error.response);
  }
}

async function getVideo() {
  try {
    const response = await axios.get(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
    );
    results = response.data.results[0];
    renderVideo(results);
  } catch (error) {
    console.log(error.response);
  }
}

/** FUNÇÕES -> CONSUMINDO END POINTS (fim) *

/** FUNÇÕES -> RENDERIZANDO LISTA DE FILMES E MODAL (início) */

function renderMovies(results) {
  moviesDiv.innerHTML = "";

  results.slice(moviePage, moviePage + 6).forEach((result) => {
    createMovieElements(result);
  });
}

function createMovieElements(result) {
  const movie = document.createElement("div");
  movie.classList.add("movie");
  moviesDiv.appendChild(movie);

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie__info");
  movie.appendChild(movieInfo);

  const titleSpan = document.createElement("span");
  const ratingSpan = document.createElement("span");

  titleSpan.classList.add("movie__title");
  ratingSpan.classList.add("movie__rating");

  movieInfo.appendChild(titleSpan);
  movieInfo.appendChild(ratingSpan);

  const imgMovie = document.createElement("img");
  ratingSpan.appendChild(imgMovie);

  titleSpan.textContent = result["title"];
  ratingSpan.textContent = result["vote_average"];
  movie.style.backgroundImage = "url('" + result["poster_path"] + "')";

  // abre modal
  movie.addEventListener("click", async (event) => {
    modal.classList.remove("hidden");

    const movieResult = await getModal(result["id"]);
    modalTitle.textContent = `${movieResult.title}`;
    modalAverage.textContent = `${movieResult.vote_average.toFixed(1)}`; // arredondar
    modalDescription.textContent = `${movieResult.overview}`;
    modalImg.style.backgroundImage = "url('" + movieResult.backdrop_path + "')";
    modalImg.style.backgroundSize = `cover`;
    modalGenres = movieResult.genres.map((genre) => {
      return createSpan(genre);
    });
  });
}

function createSpan(genre) {
  spanModal = document.createElement("span");
  spanModal.classList.add("modal__genre");
  modalGenres.appendChild(spanModal);
  return (spanModal.textContent = genre.name);
}

/* fecha modal */
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  modal.classList.add("hidden");
});

/** FUNÇÕES -> RENDERIZANDO LISTA DE FILMES E MODAL (fim) */

/** FUNÇÕES -> FUNCIONALIDADE INPUT E BOTÕES DA PAGINAÇÃO (início) */

btnNext.addEventListener("click", () => {
  moviePage > 16 ? (moviePage = 0) : (moviePage += 6);
  getMovies();
});

btnPrev.addEventListener("click", () => {
  moviePage === 0 ? (moviePage = 18) : (moviePage -= 6);
  getMovies();
});

input.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    if (event.target.value.trim() === "") {
      location.reload();
    } else {
      input.value = "";
    }
  }
});

input.addEventListener("input", (event) => {
  const inputFilme = event.target.value.toLowerCase();
  let mostrarFilmes = [];

  if (event.target.value !== "") {
    for (const result of results) {
      const finalResult = result.title.toLowerCase();
      if (finalResult.includes(inputFilme)) {
        mostrarFilmes.push(result);
        renderMovies(mostrarFilmes);
      }
    }
  }
});
/** FUNÇÕES -> FUNCIONALIDADE INPUT E BOTÕES DA PAGINAÇÃO (fim) */

/** FUNÇÕES -> FUNCIONALIDADE FILME DO DIA (início) */

function renderVideo(resultsVideo) {
  const id = resultsVideo.key;
  const idVideo = `https://www.youtube.com/watch?v=${id}`;
  hlVideoLink.href = `${idVideo}`;
}

function renderMovieOfTheDay(resultsMovieOfTheDay) {
  const launch = new Date(
    resultsMovieOfTheDay["release_date"]
  ).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  hlVideo.style.backgroundImage =
    "url('" + resultsMovieOfTheDay["backdrop_path"] + "')";
  hlVideo.style.backgroundSize = `cover`;
  hlTitle.textContent = `${resultsMovieOfTheDay["title"]}`;
  hlRating.textContent = `${resultsMovieOfTheDay["vote_average"].toFixed(1)}`;
  hlDescription.textContent = `${resultsMovieOfTheDay["overview"]}`;
  hlLaunch.textContent = `${launch}`;
  hlGenres.textContent = resultsMovieOfTheDay.genres
    .map((genre) => {
      return genre.name;
    })
    .join(", ");
}
/** FUNÇÕES -> FUNCIONALIDADE FILME DO DIA (fim) */

/** FUNÇÕES -> FUNCIONALIDADE MUDANÇA DE TEMA (início) */

function changeTheme() {
  let buttonTheme = "./assets/light-mode.svg";
  let buttonNext = "./assets/arrow-right-dark.svg";
  let buttonPrev = "./assets/arrow-left-dark.svg";

  let bgColor = "#FFFFFF";
  let bgDivs = "#EDEDED";
  let textColor = "#1B2028";
  let bgInput = "#FFFFFF";
  let logo = "./assets/logo-dark.png";
  let modalImg = "./assets/close-dark.svg";

  if (btnTheme.src.includes("light-mode.svg")) {
    bgColor = "#1B2028";
    bgInput = "#665F5F";
    bgDivs = "#2D3440";
    textColor = "#FFFFFF";
    buttonTheme = "./assets/dark-mode.svg";
    buttonNext = "./assets/arrow-right-light.svg";
    buttonPrev = "./assets/arrow-left-light.svg";
    logo = "./assets/logo.svg";
    modalImg = "./assets/close.svg";
  }

  btnNext.src = `${buttonNext}`;
  btnPrev.src = `${buttonPrev}`;
  headerContainer.src = `${logo}`;
  modalClose.src = `${modalImg}`;

  body.style.setProperty("background-color", bgColor);
  input.style.setProperty("color", textColor);
  input.style.setProperty("background-color", bgInput);
  header.style.setProperty("background-color", bgColor);
  headerTitle.style.setProperty("color", textColor);

  moviesContainer.style.setProperty("background-color", bgDivs);
  highlightDiv.style.setProperty("background-color", bgDivs);
  hlTitle.style.setProperty("color", textColor);
  hlDescription.style.setProperty("color", textColor);
  hlGenres.style.setProperty("color", textColor);
  hlLaunch.style.setProperty("color", textColor);
  modalBody.style.setProperty("background-color", bgDivs);
  modalTitle.style.setProperty("color", textColor);
  modalDescription.style.setProperty("color", textColor);

  return (btnTheme.src = `${buttonTheme}`);
}

btnTheme.addEventListener("click", () => {
  changeTheme();
});
