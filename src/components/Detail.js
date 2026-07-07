import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import YouTube from "react-youtube";
import Nav from "./Nav";
import Footer from "./Footer";
import "./Detail.css";

// Harus inject manual karena API_KEY literal dibersihkan
const API_KEY = "19f84e11932abbc79e6d83f82d6d1045";
const base_url = "https://image.tmdb.org/t/p/original/";

function Detail() {
  const { id, type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const passedMovie = location.state?.movie;

  useEffect(() => {
    window.scrollTo(0, 0);
    setError(false);
    
    // Periksa apakah film sudah ada di My List
    const list = JSON.parse(localStorage.getItem("netflixCloneMyList")) || [];
    const exists = list.some(item => String(item.id) === String(id));
    setIsInList(exists);
    
    async function fetchDetail() {
      try {
        const fetchType = (type === "movie" || type === "tv") ? type : "movie";

        const detailReq = await axios.get(`/${fetchType}/${id}?api_key=${API_KEY}&language=en-US`);
        setMovieDetails(detailReq.data);
        
        const credReq = await axios.get(`/${fetchType}/${id}/credits?api_key=${API_KEY}`);
        if(credReq.data && credReq.data.cast) {
           setCast(credReq.data.cast.slice(0, 10)); 
        }

        const vidReq = await axios.get(`/${fetchType}/${id}/videos?api_key=${API_KEY}`);
        if(vidReq.data && vidReq.data.results) {
            const ytVideos = vidReq.data.results.filter(vid => vid.site === "YouTube");
            if (ytVideos.length > 0) {
              const trailer = ytVideos.find(vid => vid.type === "Trailer") || ytVideos.find(vid => vid.type === "Teaser") || ytVideos[0];
              setTrailerUrl(trailer.key);
            }
        }
      } catch (err) {
        console.error("Error fetching detail", err);
        setError(true);
      }
    }
    
    if (id) {
       fetchDetail();
    }
  }, [id, type]);

  const toggleMyList = () => {
    const list = JSON.parse(localStorage.getItem("netflixCloneMyList")) || [];
    const movieObj = movieDetails || passedMovie;
    
    const movieToSave = { ...movieObj, media_type: type === "tv" ? "tv" : "movie" };

    if (isInList) {
      const newList = list.filter(item => String(item.id) !== String(id));
      localStorage.setItem("netflixCloneMyList", JSON.stringify(newList));
      setIsInList(false);
    } else {
      list.unshift(movieToSave);
      localStorage.setItem("netflixCloneMyList", JSON.stringify(list));
      setIsInList(true);
    }
  };

  const movie = movieDetails || passedMovie;

  if (error && !passedMovie) {
     return (
       <div className="detail">
         <Nav />
         <div style={{paddingTop: '150px', textAlign: 'center', fontSize: '1.2rem'}}>
           Failed to load movie details.
           <br/><br/>
           <button className="detail__back" onClick={() => navigate(-1)}>&larr; Go Back</button>
         </div>
       </div>
     )
  }

  if (!movie) return <div className="detail"><Nav /><div style={{paddingTop: '100px', textAlign: 'center'}}>Loading...</div></div>;

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 0 },
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <>
      {isPlaying && (
        <div className="fullscreen-player">
          <div className="fullscreen-player__close" onClick={() => setIsPlaying(false)}>
            &times;
          </div>
          <video 
            autoPlay 
            controls 
            className="fullscreen-player__video"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" 
          />
        </div>
      )}

      <div className="detail" style={{ display: isPlaying ? 'none' : 'block' }}>
        <Nav />
        
        <div 
          className="detail__banner"
          style={{
            backgroundImage: `url("${base_url}${movie.backdrop_path || movie.poster_path}")`,
          }}
        >
          <div className="detail__fadeBottom" />
        </div>

        <div className="detail__content">
          <div className="detail__info">
            <div className="detail__back" onClick={() => navigate(-1)}>
               <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="19" y1="12" x2="5" y2="12"></line>
                 <polyline points="12 19 5 12 12 5"></polyline>
               </svg>
               Back
            </div>
            
            <h1 className="detail__title">{movie.title || movie.name || movie.original_name}</h1>
            
            <div className="detail__controls" style={{ display: 'flex', gap: '15px' }}>
              <button className="detail__play-btn" onClick={handlePlayClick}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play
              </button>

              <button 
                onClick={toggleMyList}
                style={{
                  background: 'rgba(51, 51, 51, 0.7)',
                  color: 'white',
                  padding: '10px 25px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  border: '1px solid white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: '0.2s',
                }}
              >
                {isInList ? (
                   <>
                     <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                       <polyline points="20 6 9 17 4 12"></polyline>
                     </svg>
                     Added to List
                   </>
                ) : (
                   <>
                     <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                       <line x1="12" y1="5" x2="12" y2="19"></line>
                       <line x1="5" y1="12" x2="19" y2="12"></line>
                     </svg>
                     My List
                   </>
                )}
              </button>
            </div>

            <div className="detail__meta">
              <span className="detail__rating">★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} Match</span>
              {movie.release_date || movie.first_air_date ? 
                <span>{ (movie.release_date || movie.first_air_date).substring(0,4) }</span> : null
              }
              {movie.runtime ? <span>{movie.runtime} mins</span> : null}
              {movieDetails?.genres ? 
                <span>{movieDetails.genres.map(g => g.name).join(", ")}</span> : null
              }
            </div>

            <div className="detail__overview">
              {movie.overview}
            </div>

            {cast.length > 0 && (
              <div className="detail__cast">
                <h3 className="detail__cast-title">Top Cast</h3>
                <div className="detail__cast-list">
                  {cast.map(actor => (
                    <div key={actor.id} className="detail__actor">
                      {actor.profile_path ? (
                        <img src={`${base_url}${actor.profile_path}`} alt={actor.name} loading="lazy" />
                      ) : (
                        <div style={{width: '100%', height: '100%', minHeight:'120px', backgroundColor: '#333', borderRadius: '8px', marginBottom: '8px'}} />
                      )}
                      <div className="detail__actor-name">{actor.name}</div>
                      <div className="detail__actor-char">{actor.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail__trailer">
              {trailerUrl && <h3 className="detail__trailer-title">Trailer / Clip</h3>}
              {trailerUrl ? (
                <div className="detail__trailer-video">
                  <YouTube videoId={trailerUrl} opts={opts} />
                </div>
              ) : (
                <p style={{color: '#a3a3a3'}}>No video clips available for this title on TMDB.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isPlaying && <Footer />}
    </>
  );
}

export default Detail;
