// CONSTS
const apikey = "a6f23b329d82033ace7c026520aee9fc";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtubeApi = "AIzaSyDhUOfCo6F2WeMZhOURWpgUrPC-wTM_ZR8";

const apipaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,

  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApi}`,
};

// BOOTS UP THE APP
function init() {
  fetchTrandingMovies();
  fetchAndBuildAllSection();
}

function fetchTrandingMovies() {
  fetchAndBuildMoviesSection(apipaths.fetchTrending, "Trending Now")
    .then((list) => {
      const rendomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[rendomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}
function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner_sec");
  bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
  const div = document.createElement("div");
  div.innerHTML = `

  <h2 class="banner_title">${movie.title}</h2>
  <p class="banner_info">Trending in movies | Released - ${
    movie.release_date
  }</p>
  <p class="banner_overview">${
    movie.overview && movie.overview.length > 200
      ? movie.overview.slice(0, 200).trim() + "."
      : movie.overview
  }</p>
  <div class="action_buttons_cont">
    <button class="action_button"> <i class="fa-solid fa-play"></i>Play</button>
    <button class="action_button"><i class="fa-sharp fa-solid fa-circle-info"></i>More Info</button>
  </div>

  `;
  div.className = "banner_content container";
  bannerCont.append(div);
}

function fetchAndBuildAllSection() {
  fetch(apipaths.fetchAllCategories)
    .then((resp) => resp.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 3).forEach((category) => {
          fetchAndBuildMoviesSection(
            apipaths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      // console.table(categories);
    })
    .catch((err) => console.error(err));
}

function fetchAndBuildMoviesSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 6), categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);
  const moviesCont = document.getElementById("movies_cont");

  const moviesListHTML = list
    .map((item) => {
      return `
        <img class="movie_item" src="${imgPath}${item?.backdrop_path}" alt=${item?.title}" onclick="searchMovieTrailer('${item.title}')">

        
        `;
    })
    .join("");
  const moviesSectionHTML = `
      
            <h2 class="movie_sec_heading">${categoryName} <span class="explore_d">Explore All</span></h2>
            <div class="movies_row">
                ${moviesListHTML}
            </div>
       
      `;
  // console.log(moviesSectionHTML);
  const div = document.createElement("div");
  div.className = "movies_sec";
  div.innerHTML = moviesSectionHTML;

  //APPend html into movies container
  moviesCont.append(div);
}

function searchMovieTrailer(movieName) {
  if (!movieName) return;
  fetch(apipaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      // console.log(res.items[0]);
      const bestResult= res.items[0];
      const youtubeUrl= `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
      console.log(youtubeUrl);
      window.open(youtubeUrl,'_blank')
    })
    .catch((err) => console.error(err));
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    // header ui update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black_bg");
    else header.classList.remove("black_bg");
  });
});
