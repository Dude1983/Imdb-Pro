const SEARCH_URL = 'http://localhost:3000/search/';
const MOVIE_URL = 'http://localhost:3000/movie/';

const app = new Vue({
  el: '#app',
  data: {
    search_term: '',
    movies: [],
    movieResults: [],
    showTable: false
  },
  methods: {
    searchMovies(search_term) {
      this.movieResults = [];
      this.search_term = search_term
      const url = `${SEARCH_URL}${search_term}`
      fetch(url)
      .then(response => response.json())
      .then(json => {
        this.movies = json
        this.showTable = true
        this.search_term = ''
      })
    },
    getMovie(imdbID) {
      const url = `${MOVIE_URL}${imdbID}`
      fetch(url)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.movieResults.push(json)
          this.showTable = false
        })
    }
  }
});
