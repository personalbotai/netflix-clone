import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../axios";
import "./Row.css";
import { useNavigate } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow, isGridMode = false }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();

  const fetchMovies = async (pageNumber) => {
    setLoading(true);
    try {
      const urlSeparator = fetchUrl.includes("?") ? "&" : "?";
      const request = await axios.get(`${fetchUrl}${urlSeparator}page=${pageNumber}`);
      
      if (request.data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => {
          const newMovies = request.data.results.filter(
            (newMovie) => !prevMovies.some((prev) => prev.id === newMovie.id)
          );
          return [...prevMovies, ...newMovies];
        });
      }
    } catch (error) {
      console.error("Error fetching more movies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset state jika URL berubah (misal ganti kategori filter)
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [fetchUrl]);

  useEffect(() => {
    fetchMovies(page);
    // eslint-disable-next-line
  }, [page, fetchUrl]);

  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }, {
        root: null,
        rootMargin: '0px',
        // Jika mode grid, deteksi mendekati akhir elemen lebih cepat agar infinite scroll lebih mulus
        threshold: isGridMode ? 0.1 : 0.5 
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isGridMode]
  );

  const handleClick = (movie) => {
    const type = movie.media_type || (isLargeRow ? "tv" : "movie");
    navigate(`/detail/${type}/${movie.id}`, { state: { movie, type } });
  };

  if (loading && movies.length === 0) {
    return (
      <div className="skeleton-row">
        <div className="skeleton-title"></div>
        <div className={`skeleton-posters ${isGridMode ? "grid-mode" : ""}`}>
          {Array(isGridMode ? 12 : 8).fill(0).map((_, i) => (
            <div key={i} className="skeleton-poster-container">
               <div className={`skeleton-poster ${isLargeRow ? 'large' : ''}`}></div>
               <div className="skeleton-text"></div>
               <div className="skeleton-text" style={{width: '40%'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className={`row__posters ${isGridMode ? "grid-mode" : ""}`}>
        {movies.map((movie, index) => {
          const imgPath = movie.poster_path;
          if (!imgPath) return null;

          if (movies.length === index + 1) {
            return (
              <div
                ref={lastMovieElementRef}
                key={`${movie.id}-${index}`}
                className={`row__poster-container ${isLargeRow && !isGridMode && "row__posterLarge-container"}`}
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
          } else {
            return (
              <div
                key={`${movie.id}-${index}`}
                className={`row__poster-container ${isLargeRow && !isGridMode && "row__posterLarge-container"}`}
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
          }
        })}
        {/* Indikator Loading Tambahan untuk Grid Mode (Infinite Scroll bawah) atau Skeleton Horizontal biasa */}
        {loading && hasMore && (
           isGridMode ? (
             <div className="grid-loading-spinner">Loading more movies...</div>
           ) : (
             <div className="skeleton-poster-container">
                 <div className={`skeleton-poster ${isLargeRow ? 'large' : ''}`}></div>
                 <div className="skeleton-text"></div>
                 <div className="skeleton-text" style={{width: '40%'}}></div>
             </div>
           )
        )}
      </div>
    </div>
  );
}

export default Row;
