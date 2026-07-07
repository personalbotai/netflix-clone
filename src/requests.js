export const API_KEY = "***";

const requests = {
  fetchTrending: `/trending/all/week?api_key=***}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=***}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=***}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=***}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=***}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=***}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=***}&with_genres=10749`,
  fetchSciFi: `/discover/movie?api_key=***}&with_genres=878`,
  fetchAnimation: `/discover/movie?api_key=***}&with_genres=16`,
  fetchMystery: `/discover/movie?api_key=***}&with_genres=9648`,
  fetchDrama: `/discover/movie?api_key=***}&with_genres=18`,
  fetchCrime: `/discover/movie?api_key=***}&with_genres=80`,
  fetchFantasy: `/discover/movie?api_key=***}&with_genres=14`,
  fetchDocumentaries: `/discover/movie?api_key=***}&with_genres=99`,
};

export default requests;
