async function getdatafromapi(moviename) {
  try {
    var res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key={YOUR-API-KEY}&language=en-US&query=${moviename}&page=1&include_adult=false`
    );

    var moviedata = await res.json();
    var MovieData = moviedata.results[0];

    var Movie_Cast;
    var Movie_Metadata;
    if (MovieData) {
      var Movie_Cast_raw = await fetch(
        "https://api.themoviedb.org/3/movie/" +
          String(MovieData.id) +
          "/credits?api_key={YOUR-API-KEY}&language=en-US"
      );
      Movie_Cast = await Movie_Cast_raw.json();

      var Movie_metadata_raw = await fetch(
        `https://api.themoviedb.org/3/movie/${MovieData.id}?api_key={YOUR-API-KEY}&language=en-US`
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

function pricetostring(mon) {
  var money = 0;
  if (mon >= 1000000000) {
    money = mon / 1000000000;
    money = money.toFixed(2);

    return String(money) + " billion";
  } else if (mon >= 1000000) {
    money = mon / 1000000;
    money = money.toFixed(0);

    return String(money) + " million";
  } else {
    money = mon / 1000;
    money = money.toFixed(0);

    return String(money) + " thousand";
  }
}

function createMovieElements(MovieData, Movie_Cast, Movie_Metadata) {
  //title
  var MovieNameElement = document.getElementById("MovieName");
  MovieNameElement.innerHTML = MovieData.original_title;

  //movie-backdrop
  var MoviebackdropElement = document.getElementById("movie-backdrop");
  MoviebackdropElement.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/original${MovieData.backdrop_path}`
  );

  document.getElementById("movie-backdrop").style.display = "block";
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
  var div = document.createElement("ul");
  div.classList.add("cast-names-holder");
  div.innerHTML = CastList.join("");
  document.getElementById("moviecastnames").appendChild(div);
  document
    .getElementById("moviecastnames")
    .style.setProperty("display", "flex");
  //metadata
  document.getElementById("movie-budget").innerHTML =
    "Budget: $" + pricetostring(Movie_Metadata.budget);

  document.getElementById("movie-boxoffice").innerHTML =
    "Box Office: $" + pricetostring(Movie_Metadata.revenue);

  document.getElementById("Release-date").innerHTML =
    "Release Date: " + MovieData.release_date;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("getmoviebutton").addEventListener("click", () => {
    var moviename = document.getElementById("moviename-input").value;
    getdatafromapi(encodeURI(moviename));
  });
});
