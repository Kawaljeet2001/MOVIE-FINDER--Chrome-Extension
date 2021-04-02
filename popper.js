async function getdatafromapi(moviename) {
  try {
    var res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=d7dd816b5caceb61abc1a42d5913bb2a&language=en-US&query=${moviename}&page=1&include_adult=false`
    );

    var moviedata = await res.json();
    var MovieData = moviedata.results[0];

    var Movie_Cast;
    var Movie_Metadata;
    if (MovieData) {
      var Movie_Cast_raw = await fetch(
        "https://api.themoviedb.org/3/movie/" +
          String(MovieData.id) +
          "/credits?api_key=d7dd816b5caceb61abc1a42d5913bb2a&language=en-US"
      );
      Movie_Cast = await Movie_Cast_raw.json();

      var Movie_metadata_raw = await fetch(
        `https://api.themoviedb.org/3/movie/${MovieData.id}?api_key=d7dd816b5caceb61abc1a42d5913bb2a&language=en-US`
      );
      Movie_Metadata = await Movie_metadata_raw.json();
    }

    createMovieElements(MovieData, Movie_Cast.cast, Movie_Metadata);
    console.log(MovieData);
    console.log(Movie_Cast);
  } catch (err) {
    console.log(err);
  }
}

function createMovieElements(MovieData, Movie_Cast) {
  //title
  var MovieNameElement = document.getElementById("MovieName");
  MovieNameElement.innerHTML = MovieData.original_title;

  //movie-backdrop
  var MoviebackdropElement = document.getElementById("movie-backdrop");
  MoviebackdropElement.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/original${MovieData.backdrop_path}`
  );
  //description
  var MovieDescriptionElement = document.getElementById("movie-description");
  MovieDescriptionElement.innerHTML = MovieData.overview;

  //cast
  var CastList = [];
  for (var i = 0; i < 10; i++) {
    var castlistitem = `
    <li>${Movie_Cast[i].name}</li>`;

    CastList.push(castlistitem);
  }
  var div = document.createElement("div");
  div.innerHTML = CastList.join("");
  document.getElementById("cast-names-holder").appendChild(div);

  //metadata
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("getmoviebutton").addEventListener("click", () => {
    var moviename = document.getElementById("moviename-input").value;

    getdatafromapi(encodeURI(moviename));
  });
});

// Movie_metadata = await axios.get('https://api.themoviedb.org/3/movie/' + String(MovieDetails.data.results[0].id) + '?api_key=d7dd816b5caceb61abc1a42d5913bb2a&language=en-US')
//           Movie_Cast = await axios.get('https://api.themoviedb.org/3/movie/' + String(MovieDetails.data.results[0].id) + '/credits?api_key=d7dd816b5caceb61abc1a42d5913bb2a&language=en-US')
