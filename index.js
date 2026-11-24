
const searchBar = document.querySelector('#searchInput');
const searchForm = document.querySelector('#searchForm');
const resultsList = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');


let allMovies = [];

const PLACEHOLDER_POSTER = './assets/movie-placeholder.png';



async function loadMovies(searchTerm = 'marvel') {

  try {

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=1532d22e&s=${encodeURIComponent(searchTerm)}`
    );

    const data = await response.json();

    if (data.Response === 'False') {

      allMovies = [];
      displayMovies([]);

      resultsInfo.innerHTML = '<span>Showing: </span>No movies available';

      return;
    }

    allMovies = data.Search || [];

    const sortedMovies = sortMovies(
      allMovies,
      sortSelect.value
    );

    displayMovies(sortedMovies);

    resultsInfo.innerHTML = `<span>Showing: </span>${searchTerm}`;

  } catch (error) {

    console.error('Error loading movies:', error);

    resultsList.innerHTML = '<p>Unable to load movies. Please try again.</p>';

  }

}


function displayMovies(movies) {

  if (!movies || movies.length === 0) {

    resultsList.innerHTML = `
      <div class="no-results">
        <h2>No movies available</h2>
      </div>
    `;

    return;
  }

  resultsList.innerHTML = movies.map(movie => movieHTML(movie)).join('');

}


function sortMovies(movies, sortValue) {

  const sortedMovies = [...movies];

  switch (sortValue) {

    case 'a-z':
      return sortedMovies.sort((a, b) =>
        a.Title.localeCompare(b.Title)
      );

    case 'z-a':
      return sortedMovies.sort((a, b) =>
        b.Title.localeCompare(a.Title)
      );

    case 'newest':
      return sortedMovies.sort((a, b) =>
        Number(b.Year.slice(0, 4)) - Number(a.Year.slice(0, 4))
      );

    case 'oldest':
      return sortedMovies.sort((a, b) =>
        Number(a.Year.slice(0, 4)) - Number(b.Year.slice(0, 4))
      );

    default:
      return sortedMovies;

  }

}



function movieHTML(movie) {

  const poster = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : PLACEHOLDER_POSTER;

  return `
    <div class="movie-card">
      <img
        class="movie-card__img"
        src="${poster}"
        alt="${movie.Title} poster"
        onerror="this.onerror=null; this.src='${PLACEHOLDER_POSTER}';"
      />
      <h2 class="movie-card__title">${movie.Title}</h2>
      <p class="movie-card__year">${movie.Year}</p>
    </div>
  `;

}


searchForm.addEventListener('submit', (event) => {

  event.preventDefault();

  const searchTerm = searchBar.value.trim();

  if (searchTerm) {
    loadMovies(searchTerm);
  }

});


sortSelect.addEventListener('change', () => {

  const sortedMovies = sortMovies(
    allMovies,
    sortSelect.value
  );

  displayMovies(sortedMovies);

});


loadMovies();


