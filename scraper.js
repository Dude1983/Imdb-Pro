const cheerio = require('cheerio')
const fetch = require('node-fetch')

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';


function searchMovies(searchTerm) {
  return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function(i, element) {
        const $element = $(element);
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');

        const imdbID = $title.attr('href').match(/title\/(.*)\//)[1];

        const movie = {
          image: $image.attr('src'),
          title: $title.text(),
          imdbID
        };
        movies.push(movie);
      });
      return movies;
    });
}

function getMovie(imdbId) {
  return fetch(`${movieUrl}${imdbId}`)
    .then(res => res.text())
    .then(body => {
      const $ = cheerio.load(body);
      const $title = $('.title_wrapper h1');

      const title = $title.first().contents().filter(function() {
        return this.type === 'text';
      }).text().trim();
      const rating = $('meta[itemProp="contentRating"]').attr('content');
      const runTime = $('time[itemProp="duration"]').first().contents().filter(function() {
        return this.type === 'text';
      }).text().trim();

      const genres = [];
      $('span[itemProp="genre"]').each(function(i, element) {
        const genre = $(element).text();
        genres.push(genre);
      });

      const datePublished = $('meta[itemProp="datePublished"]').attr('content');
      const imdbRating = $('span[itemProp="ratingValue"]').text();
      const poster = $('div.poster a img').attr('src');
      const summary = $('div.summary_text').text().trim();

      function getItems(itemArray) {
        return function(i, element) {
          const item = $(element).text().trim();
          itemArray.push(item);
        };
      }

      const directors = [];
      $('span[itemProp="director"]').each(getItems(directors));

      const writers = [];
      $('.credit_summary_item span[itemProp="creator"]').each(getItems(writers));

      const stars = [];
      $('.credit_summary_item span[itemProp="actors"]').each(getItems(stars));

      const storyLine = $('#titleStoryLine div[itemProp="description"] p').text().trim();

      const companies = [];
      $('span[itemType="http://schema.org/Organization"]').each(getItems(companies));

      const trailer = $('a[itemProp="trailer"]').attr('href');

      const movie = {
        imdbId,
        title,
        rating,
        runTime,
        genres,
        datePublished,
        imdbRating,
        poster,
        summary,
        directors,
        writers,
        stars,
        storyLine,
        companies,
        trailer: `https://www.imdb.com${trailer}`
      };

      return movie;
    });
}

module.exports = {
  searchMovies,
  getMovie
};
