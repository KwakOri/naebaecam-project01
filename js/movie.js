import { apiKey } from "./api_key.js";
const api_key = apiKey;
const domain = "https://api.themoviedb.org/3";
const imageEndPoint = "https://image.tmdb.org/t/p/w500";
const movieArticle = document.querySelector(".content-box");
let filteringText = "";
let sortingMode = "";
let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ]/;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: api_key,
  },
};

class Movie {
  constructor(
    id,
    title,
    originalTitle,
    overview,
    posterPath,
    voteAverage,
    releaseDate
  ) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.posterPath = posterPath;
    this.voteAverage = voteAverage;
    this.releaseDate = releaseDate;
  }
}



const getData = async (query) => {
  let response = await fetch(domain + query, options);
  try {
    response = response.json();
    console.log();
    return response;
  } catch {
    console.log("response is empty!");
  }
};
const getMoviesFromJSON = (json) => {
  return json.results.map((movie) => {
    const currMovie = new Movie(
      movie.id,
      movie.title,
      movie.original_title,
      movie.overview,
      movie.poster_path,
      movie.vote_average,
      movie.release_date
    );
    return currMovie;
  });
};
const getMovies = async (path) => {
  let data = await getData(path);
  data = getMoviesFromJSON(data);
  console.log("Success!");
  return data;
};
const filteringMovies = (filteringText, movies) => {
  if (filteringText) {
    return movies.filter((movie) => {
      const movieTitle = movie.title.toUpperCase();
      return movieTitle.includes(filteringText.toUpperCase());
    });
  } else {
    return movies;
  }
};
const sortingMovies = (sortingMode, movies) => {
  if (sortingMode) {
    switch (sortingMode) {
      case "higher-rating":
        return movies.sort((prev, next) => {
          return next.voteAverage - prev.voteAverage;
        });
      case "lower-rating":
        return movies.sort((prev, next) => {
          return prev.voteAverage - next.voteAverage;
        });
      case "newer":
        return movies.sort((prev, next) => {
          return new Date(next.releaseDate) - new Date(prev.releaseDate);
        });
      case "older":
        return movies.sort((prev, next) => {
          return new Date(prev.releaseDate) - new Date(next.releaseDate);
        });
    }
  } else {
    return movies;
  }
};
const deleteExistCards = () => {
  const isContent = document.querySelector(".content-box ul");
  if (isContent) {
    movieArticle.removeChild(isContent);
  }
};
const appendMovieCards = (movies) => {
  const ul = document.createElement("ul");
  let moviesCards = movies.map((movie) => makeMovieCard(movie));

  moviesCards.forEach((movieCard, i) => {

    if (i < 4 && !filteringText && !sortingMode) {
      movieCard.classList.remove("movie-card");
      movieCard.classList.add("hot-movie-card");

      //movie 카드에서 ratingScore노드 찾는 방법 연구.
      const ratingWidth = parseInt(
        movieCard.childNodes[1].childNodes[2].style.width
      );
      movieCard.childNodes[1].childNodes[2].style.width = `${ratingWidth * 2}px`;
    }
    ul.appendChild(movieCard);
  });
  movieArticle.appendChild(ul);
};
const makeParagraphNode = (text) => {
  const pTag = document.createElement("p");
  const content = document.createTextNode(text);
  pTag.appendChild(content);
  return pTag;
};
const makeLiTagNode = (id) => {
  const li = document.createElement("li");
  li.classList.add("movie-card");
  li.dataset._id = id;
  return li;
};
const makePosterNode = (posterPath) => {
  const posterNode = document.createElement("div");
  posterNode.classList.add("movie-poster");
  posterNode.style.backgroundImage = `url(${imageEndPoint + posterPath})`;
  return posterNode;
};
const makeInfoNode = (
  titleNode,
  originalTitleNode,
  overviewNode,
  ratingScoreNode,
  releaseDateNode
) => {
  const infoNode = document.createElement("div");
  infoNode.classList.add("movie-info");

  if (!originalTitleNode) {
    infoNode.append(titleNode, overviewNode, ratingScoreNode, releaseDateNode);
  } else {
    infoNode.append(
      titleNode,
      originalTitleNode,
      overviewNode,
      ratingScoreNode,
      releaseDateNode
    );
  }
  return infoNode;
};
const makeRatingScoreNode = (voteAverage) => {
  const ratingScoreNode = document.createElement("div");
  ratingScoreNode.classList.add("rating-score");
  ratingScoreNode.style.width = `${Math.floor(voteAverage) * 25}px`;
  return ratingScoreNode;
};
const makeNormalNode = (content, className) => {
  const node = makeParagraphNode(content);
  node.classList.add(className);
  return node;
};
const makeMovieCard = (movie) => {
  const {
    id,
    title,
    originalTitle,
    overview,
    posterPath,
    voteAverage,
    releaseDate,
  } = movie;
  
  let originalTitleNode;
  if (movie.title !== movie.originalTitle) {
    originalTitleNode = makeNormalNode(originalTitle, "movie-original-title");
  }

  const infoNode = makeInfoNode(
    makeNormalNode(title, "movie-title"),
    originalTitleNode,
    makeNormalNode(overview, "overview"),
    makeRatingScoreNode(voteAverage),
    makeNormalNode(releaseDate, "release-date")
  );

  const li = makeLiTagNode(id);
  li.appendChild(makePosterNode(posterPath));
  li.appendChild(infoNode);

  return li;
};

const makeMovieArticle = async () => {
  deleteExistCards();
  let movies = await getMovies("/movie/popular");
  movies = filteringMovies(filteringText, movies);
  movies = sortingMovies(sortingMode, movies);
  appendMovieCards(movies);
};

/* 
----------------------------------- 
-----------------------------------
-----------------------------------
-----------------------------------
*/

const filterSearchBar = document.querySelector("#filter-search-bar");
const filterTextArea = document.querySelector("#filter-search-bar .text-area");

window.addEventListener("load", () => {
  filterTextArea.focus();
  filterTextArea.setSelectionRange(0, 0);
});

const addBtnEvent = () => {
  const movieCards = document.querySelectorAll(".movie-card");
  const hotMovieCards = document.querySelectorAll(".hot-movie-card");
  movieCards.forEach((card) => {
    card.addEventListener("click", () => {
      alert(card.dataset._id);
    });
  });

  hotMovieCards.forEach((card) => {
    card.addEventListener("click", () => {
      alert(card.dataset._id);
    });
  });
};

filterSearchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  filteringText = filterTextArea.value;
  if (pattern_kor.test(filteringText)) {
    alert("정확한 단어를 입력해주세요!");
    filterTextArea.value = "";
    return;
  }
  play();
});

const sortingOptionBtns = document.querySelectorAll(".filtering-option");
sortingOptionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("on")) {
      sortingMode = "";
      btn.classList.remove("on");
    } else {
      sortingMode = btn.dataset.mode;
      sortingOptionBtns.forEach((btn) => {
        btn.classList.remove("on");
      });
      btn.classList.add("on");
    }
    play();
  });
});

const play = async () => {
  await makeMovieArticle();
  addBtnEvent();
};

play();

// search-bar
