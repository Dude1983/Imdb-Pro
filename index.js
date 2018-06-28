const express = require('express')
const cors = require('cors');
const scraper = require('./scraper');

const app = express()
app.use(cors());


app.get('/', (req,res) => {
  res.json({
    message: "It works"
  });
});

app.get('/search/:title', (req, res) => {
  scraper
    .searchMovies(req.params.title)
    .then(movies => {
      res.json(movies);
    });
});


app.get('/movie/:imdbId', (req, res) => {
  scraper
    .getMovie(req.params.imdbId)
    .then(movie => {
      res.json(movie);
    });
});

app.use( (req, res, next) => {
  const error = new Error(404);
  res.status(404);
  next(error)
})

app.use( (error, req, res) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
