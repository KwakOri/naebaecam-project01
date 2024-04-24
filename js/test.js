const domain = "https://api.themoviedb.org/3";
const api_key = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzk1YWRkYWRhOGQ5MTU4MTU2OGU3YTA2MjY3YjU2MSIsInN1YiI6IjY2MjdjOTZlMTc2YTk0MDE3ZjgyMGU1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dSyjnXv3sfFr6hvttIaZplHn38xwjk7C79qxDZIPA3s";

class Movie {
  constructor(id, title, originalTitle, overview, posterPath, voteAverage) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.posterPath = posterPath;
    this.voteAverage = voteAverage;
  }
}

const getMoviesFromJSON = (json) => {
  json.results.map(movie => {
    const currMovie =  new Movie(
      movie.id,
      movie.title,
      movie.original_title,
      movie.overview,
      movie.poster_path,
      movie.vote_average);
    return currMovie;
  })
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: api_key,
  },
};

const getData = async (query) => {
  let response = await fetch(domain + query, options);
  try {
    response = response.json();
    return response;
  } catch {
    console.log("response is empty!");
  }
  
};

const getPopularMovies = async () => {
    let path = "/movie/popular";
    let data = await getData(path);
    data = getMoviesFromJSON(data);
    console.log(data);
    console.log("Success!");
}

const searchMovies = async (query) => {
  const path = "/search/movie?query="
  
  let data = await getData(path+query);

  if (data) {
    console.log(data);
    console.log("data ok");
    console.log(path+query);
  } else {
    console.log("response doesn't exist");
  }
}

// getPopularMovies();
searchMovies("극한");
