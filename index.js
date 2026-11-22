
const searchBar = document.querySelector('#searchInput');
const searchForm = document.querySelector('#searchForm');
const resultsList = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');
let allMovies = [];

async function loadMovies() {
  const response = await fetch(
    'https://www.omdbapi.com/?apikey=1532d22e&s=marvel'
  );

  const data = await response.json();

  allMovies = data.Search || [];

  displayMovies(allMovies);
}

function displayMovies(movies) {
  resultsList.innerHTML = movies.map(movie => movieHTML(movie)).join('');
}


function movieHTML(movie) {

  let poster = movie.Poster;

  
  if (movie.imdbID === 'tt3438640') {
    poster = 'https://image.tmdb.org/t/p/w500/y0QYZPWgeGKOvyrzi6Oz3aJPxJa.jpg';
  }

  
  if (poster === 'N/A' || !poster) {
    poster = '';
  }

  return `
    <div class="movie-card">
      <img
        class="movie-card__img"
        src="${poster}"
        alt="${movie.Title} poster"
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

  displayMovies(filteredMovies);

  resultsInfo.innerHTML = `<span>Showing: </span>${searchTerm || 'Marvel'}`;
});

loadMovies();


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

sortSelect.addEventListener('change', () => {
  const sortedMovies = sortMovies(
    allMovies.filter(movie =>
      movie.Title.toLowerCase().includes(searchBar.value.toLowerCase())
    ),
    sortSelect.value
  );

  displayMovies(sortedMovies);
});

loadMovies();
