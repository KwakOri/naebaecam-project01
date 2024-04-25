// import { apiKey } from './api_key.js';

const movieArticle = document.querySelector(".content-box");
let filteringText = "";
let filteringMode = "";

const filterSearchBar = document.querySelector('#filter-search-bar');
const filterTextArea = document.querySelector('#filter-search-bar .text-area')

window.addEventListener('load', () => {
  filterTextArea.focus();
  filterTextArea.setSelectionRange(0,0);
})

window.addEventListener('keydown', (e) => {
  // if(e.code === 'Enter') {
  //   play();
  // }
  console.log("no!");
})



let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ]/;

const domain = "https://api.themoviedb.org/3";
const imageEndPoint = "https://image.tmdb.org/t/p/w500";
const api_key = apiKey;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: api_key,
  },
};

class Movie {
  constructor(id, title, originalTitle, overview, posterPath, voteAverage, releaseDate) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.posterPath = posterPath;
    this.voteAverage = voteAverage;
    this.releaseDate = releaseDate;
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
      movie.vote_average,
      movie.release_date);
    return currMovie;
  })
}

const getData = async (query) => {
  let response = await fetch(domain + query, options);
  try {
    response = response.json();
    return response;
  } catch {
    console.log("response is empty!");
  }
};

const getMovies = async (path) => {
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

const makeHeaderAticle = async() => {
  let movies = await getMovies("/movie/upcoming");
  movies.forEach(movie => {
    console.log(movie.releaseDate);
  })
}

makeHeaderAticle();

// 영화 카드를 담은 ul을 만들어 body에 추가.
const makeMovieArticle = async () => {
  let movies = await getMovies("/movie/popular");
  if(filteringText) {
    movies = movies.filter(movie => {
      // console.log(movie)
      // console.log(movie.title)
      // console.log(filteringText)
      const movieTitle = movie.title.toUpperCase();
      return movieTitle.includes(filteringText.toUpperCase());
    })
  }
  if(filteringMode === "higher-rating") {
  movies.sort((prev, next) => {
    return next.voteAverage - prev.voteAverage;
  })    
  } else if (filteringMode === "lower-rating") {
    movies.sort((prev, next) => {
      return prev.voteAverage - next.voteAverage;
    })
  } else if (filteringMode === "newer") {
    movies.sort((prev, next) => {
      return new Date(next.releaseDate) - new Date(prev.releaseDate);
    })
  } else if (filteringMode === "older") {
    movies.sort((prev, next) => {
      return new Date(prev.releaseDate) - new Date(next.releaseDate);
    })
  }
  const isContent = document.querySelector(".content-box ul");
  if(isContent) {
    movieArticle.removeChild(isContent);
  }
  const ul = document.createElement('ul');
  let moviesHTML = movies.map(movie => makeMovieCard(movie));
  
  
  moviesHTML.forEach((movie, i) => {
    if(i<4 && !filteringText && !filteringMode) {
      movie.classList.remove('movie-card');
      movie.classList.add('hot-movie-card');
      const ratingWidth = parseInt(movie.childNodes[1].childNodes[2].style.width);
      movie.childNodes[1].childNodes[2].style.width = `${ratingWidth * 2}px`;
    } 
    ul.appendChild(movie);
  });
  movieArticle.appendChild(ul);
}

// text를 p태그로 감싸 반환.
const makeParagraphNode = (text) => {
  const pTag = document.createElement('p');
  const content = document.createTextNode(text);
  pTag.appendChild(content);
  return pTag;
}

function makeMovieCard(movie) {
  const li = document.createElement('li');
  li.classList.add("movie-card");
  li.dataset._id = movie.id;
  const title = movie.title;
  const originalTitle = movie.originalTitle;
  const posterPath = movie.posterPath;
  const voteAverage = movie.voteAverage;
  const overview = movie.overview;
  const releaseDate = movie.releaseDate;
  // console.log(title, originalTitle, posterPath);

  const posterNode = document.createElement('div');
  posterNode.classList.add("movie-poster");
  posterNode.style.backgroundImage = `url(${imageEndPoint+posterPath})`;
  
  const titleNode = makeParagraphNode(title);
  titleNode.classList.add('movie-title');

  const infoNode = document.createElement('div');
  infoNode.classList.add('movie-info');

  li.appendChild(posterNode);
  
  infoNode.appendChild(titleNode);

  //만약 영화 제목이 오리지널 제목과 다르다면, 오리지널 제목 추가.
  if(movie.title !== movie.originalTitle) {
    const originalTitleNode = makeParagraphNode(originalTitle);
    originalTitleNode.classList.add("movie-original-title");
    infoNode.appendChild(originalTitleNode);
  }

  const overviewNode = makeParagraphNode(overview);
  overviewNode.classList.add("overview");

  const ratingScoreNode = document.createElement('div');
  ratingScoreNode.classList.add('rating-score');
  ratingScoreNode.style.width = `${Math.floor(voteAverage)*25}px`;

  const releaseDateNode = makeParagraphNode(releaseDate);
  releaseDateNode.classList.add('release-date');

  infoNode.appendChild(overviewNode);
  infoNode.appendChild(ratingScoreNode);
  infoNode.appendChild(releaseDateNode);
  

  li.appendChild(infoNode);
  return li;
}


const addBtnEvent = () => {
  const movieCards = document.querySelectorAll('.movie-card');
  const hotMovieCards = document.querySelectorAll('.hot-movie-card');
  movieCards.forEach(card => {
    card.addEventListener('click', ()=> {
      alert(card.dataset._id);
    });
  });

  hotMovieCards.forEach(card => {
    card.addEventListener('click', ()=> {
      alert(card.dataset._id);
    });
  });
  console.log(movieCards);
}

filterSearchBar.addEventListener('submit', (e) => {
  e.preventDefault();
  filteringText = filterTextArea.value;
  if(pattern_kor.test(filteringText)) {
    alert("정확한 단어를 입력해주세요!");
    filterTextArea.value = "";
    return;
  }
  play();
})

const filteringOptionBtns = document.querySelectorAll('.filtering-option');
filteringOptionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.classList.contains('on')) {
      filteringMode = "";
      btn.classList.remove("on");
    } else {
      filteringMode = btn.dataset.mode;
      filteringOptionBtns.forEach(btn => {
        btn.classList.remove('on');
      })
      btn.classList.add('on');
    }
    
    play();
  });
})

const play = async() =>  {
  await makeMovieArticle();
  addBtnEvent();
}

play();


// search-bar

