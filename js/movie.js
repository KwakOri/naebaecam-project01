const domain = "https://api.themoviedb.org/3";
const imageEndPoint = "https://image.tmdb.org/t/p/w500";
const api_key = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzk1YWRkYWRhOGQ5MTU4MTU2OGU3YTA2MjY3YjU2MSIsInN1YiI6IjY2MjdjOTZlMTc2YTk0MDE3ZjgyMGU1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dSyjnXv3sfFr6hvttIaZplHn38xwjk7C79qxDZIPA3s";

const movieArticle = document.querySelector(".content-box");

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
  return json.results.map(movie => {
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
    console.log("Success!");
    return data;
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

// 영화 카드를 담은 ul을 만들어 body에 추가.
const makeMovieArticle = async () => {
  const movies = await getPopularMovies();
  const ul = document.createElement('ul');
  let moviesHTML = movies.map(movie => makeMovieCard(movie));
  moviesHTML.forEach(movie => {
    ul.appendChild(movie);
  });
  console.log(ul);
  movieArticle.appendChild(ul);
}

// text를 p태그로 감싸 반환.
const makeParagraphNode = (text) => {
  const pTag = document.createElement('p');
  const content = document.createTextNode(text);
  pTag.appendChild(content);
  return pTag;
}

const makeMovieCard = (movie) => {
  const li = document.createElement('li');
  li.classList.add("movie-card");
  li.dataset._id = movie.id;
  const title = movie.title;
  const originalTitle = movie.originalTitle;
  const posterPath = movie.posterPath;
  // console.log(title, originalTitle, posterPath);

  const posterNode = document.createElement('div');
  posterNode.classList.add("movie-poster");
  posterNode.style.backgroundImage = `url(${imageEndPoint+posterPath})`;
  

  const titleNode = makeParagraphNode(movie.title);
  titleNode.classList.add('movie-title');


  li.appendChild(posterNode);
  li.appendChild(titleNode);

  //만약 영화 제목이 오리지널 제목과 다르다면, 오리지널 제목 추가.
  if(movie.title !== movie.originalTitle) {
    const originalTitleNode = makeParagraphNode(movie.originalTitle);
    originalTitleNode.classList.add("movie-original-title");
    li.appendChild(originalTitleNode);
  }
  
  return li;
}

makeMovieArticle();