
const searchBar = document.querySelector('#searchInput');
const searchForm = document.querySelector('#searchForm');
const resultsList = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');


let allMovies = [];

const PLACEHOLDER_POSTER = './assets/movie-placeholder.png';


async function loadMovies() {

  try {

    const response = await fetch(
      'https://www.omdbapi.com/?apikey=1532d22e&s=marvel'
    );

    const data = await response.json();

    if (data.Response === 'False') {
      allMovies = [];
      displayMovies([]);
      return;
    }

    allMovies = data.Search || [];

    displayMovies(allMovies);

  } catch (error) {

    console.error('Error loading movies:', error);

    resultsList.innerHTML = '<p>Unable to load movies. Please try again.</p>';

  }
}


function displayMovies(movies) {

  if (!movies || movies.length === 0) {

    resultsList.innerHTML = `
      <div class="no-results">
        <h2>No movies found</h2>
        <p>Try searching for another movie.</p>
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

});


searchBar.addEventListener('input', (event) => {

  const searchTerm = event.target.value.toLowerCase();

  const filteredMovies = allMovies.filter(movie =>
    movie.Title.toLowerCase().includes(searchTerm)
  );

  const sortedMovies = sortMovies(
    filteredMovies,
    sortSelect.value
  );

  displayMovies(sortedMovies);

  resultsInfo.innerHTML = `
    <span>Showing: </span>${searchTerm || 'Marvel'}
  `;

});


sortSelect.addEventListener('change', () => {

  const searchTerm = searchBar.value.toLowerCase();

  const filteredMovies = allMovies.filter(movie =>
    movie.Title.toLowerCase().includes(searchTerm)
  );

  const sortedMovies = sortMovies(
    filteredMovies,
    sortSelect.value
  );

  displayMovies(sortedMovies);

});


loadMovies();

