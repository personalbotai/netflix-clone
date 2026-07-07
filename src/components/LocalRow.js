import React from "react";
import "./Row.css";
import { useNavigate } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

function LocalRow({ title, movies, isLargeRow }) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  const handleClick = (movie) => {
    const type = movie.media_type || (isLargeRow ? "tv" : "movie");
    navigate(`/detail/${type}/${movie.id}`, { state: { movie, type } });
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => {
          const imgPath = movie.poster_path;
          if (!imgPath) return null;

          return (
            <div
              key={movie.id}
              className={`row__poster-container ${isLargeRow && "row__posterLarge-container"}`}
              onClick={() => handleClick(movie)}
            >
              <img
                className="row__poster"
                src={`${base_url}${imgPath}`}
                alt={movie.name || movie.title}
                loading="lazy"
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
          );
        })}
      </div>
    </div>
  );
}

export default LocalRow;
