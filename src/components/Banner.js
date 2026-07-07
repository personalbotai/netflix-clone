import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import requests from "../requests";
import YouTube from "react-youtube";
import "./Banner.css";
import { API_KEY } from "../requests";

function Banner() {
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchNetflixOriginals);
        const randomMovie = request.data.results[Math.floor(Math.random() * request.data.results.length - 1)];
        setMovie(randomMovie);

        if (randomMovie && randomMovie.id) {
           const vidReq = await axios.get(`/tv/${randomMovie.id}/videos?api_key=***}`);
           if(vidReq.data && vidReq.data.results) {
               const ytVideos = vidReq.data.results.filter(vid => vid.site === "YouTube");
               if (ytVideos.length > 0) {
                 const trailer = ytVideos.find(vid => vid.type === "Trailer") || ytVideos[0];
                 setTrailerUrl(trailer.key);
               }
           }
        }
      } catch (error) {
        console.error("Error fetching banner", error);
      }
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handlePlay = () => {
    if (movie) {
      navigate(`/detail/tv/${movie.id}`, { state: { movie, type: 'tv' } });
    }
  };

  const toggleMyList = () => {
    if (!movie) return;
    const list = JSON.parse(localStorage.getItem("netflixCloneMyList")) || [];
    const exists = list.some(item => String(item.id) === String(movie.id));
    
    if (exists) {
      const newList = list.filter(item => String(item.id) !== String(movie.id));
      localStorage.setItem("netflixCloneMyList", JSON.stringify(newList));
      alert(`${movie.name || movie.title} removed from My List`);
      window.dispatchEvent(new Event('storage')); // Trigger update
    } else {
      const movieToSave = { ...movie, media_type: "tv" };
      list.unshift(movieToSave);
      localStorage.setItem("netflixCloneMyList", JSON.stringify(list));
      alert(`${movie.name || movie.title} added to My List`);
      window.dispatchEvent(new Event('storage')); // Trigger update
    }
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { 
      autoplay: 1,
      mute: 1, // Wajib mute agar browser mengizinkan autoplay
      controls: 0,
      loop: 1,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      playlist: trailerUrl // Wajib untuk looping di Youtube Iframe API
    },
  };

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: !trailerUrl ? `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")` : "none",
        backgroundPosition: "center center",
      }}
    >
      {/* Background Video */}
      {trailerUrl && (
        <div className="banner__video">
          <YouTube videoId={trailerUrl} opts={opts} />
        </div>
      )}

      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="banner__buttons">
          <button className="banner__button primary" onClick={handlePlay}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Play
          </button>
          <button className="banner__button" onClick={toggleMyList}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            My List
          </button>
        </div>

        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
