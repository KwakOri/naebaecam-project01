const domain = "https://api.themoviedb.org/3";
// let query = "/discover/movie";


const getData = async (query) => {
  const _url = domain+query+api_key;
  console.log(_url);
  const response = await fetch(_url);
  const jsonData = await response.json();
  return jsonData;
}


const searchMovies = async (query) => {
  let data = await getData(query);
  console.log(data.results.filter((item) => {
    return item.original_language === 'ko';
  }));
}

searchMovies("/discover/movie");