import React, { useState, useEffect } from "react";
import axios from "../axios";
import "./Row.css";
import { useNavigate } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    // Navigasi ke halaman detail dengan membawa data film
    const type = movie.media_type || (isLargeRow ? "tv" : "movie");
    navigate(`/detail/${type}/${movie.id}`, { state: { movie, type } });
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <div 
                key={movie.id} 
                className={`row__poster-container ${isLargeRow && "row__posterLarge-container"}`}
                onClick={() => handleClick(movie)}
              >
                <img
                  className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                  src={`${base_url}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name || movie.title}
                />
                <div className="row__poster-info">
                  <div className="row__poster-title">
                    {movie.title || movie.name || movie.original_name}
                  </div>
                  <div className="row__poster-rating">
                    ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Row;
