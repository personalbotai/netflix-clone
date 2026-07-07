import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import YouTube from "react-youtube";
import Nav from "./Nav";
import Footer from "./Footer";
import "./Detail.css";
import { API_KEY } from "../requests";

const base_url = "https://image.tmdb.org/t/p/original/";

function Detail() {
  const { id, type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [error, setError] = useState(false);

  // Gunakan data dari state navigasi jika ada, sebagai fallback
  const passedMovie = location.state?.movie;

  useEffect(() => {
    window.scrollTo(0, 0);
    setError(false);
    
    async function fetchDetail() {
      try {
        // Karena ada perbedaan properti media_type kadang tidak diset secara benar dari API search/multi
        // Kami pastikan param type adalah "movie" atau "tv" secara strict
        const fetchType = (type === "movie" || type === "tv") ? type : "movie";

        // Fetch full details
        const detailReq = await axios.get(`/${fetchType}/${id}?api_key=${API_KEY}&language=en-US`);
        setMovieDetails(detailReq.data);
        
        // Fetch cast/credits
        const credReq = await axios.get(`/${fetchType}/${id}/credits?api_key=${API_KEY}`);
        if(credReq.data && credReq.data.cast) {
           setCast(credReq.data.cast.slice(0, 10)); // Ambil 10 aktor utama
        }

        // Fetch videos (untuk trailer)
        const vidReq = await axios.get(`/${fetchType}/${id}/videos?api_key=${API_KEY}`);
        if(vidReq.data && vidReq.data.results) {
            const trailers = vidReq.data.results.filter(vid => vid.type === "Trailer" && vid.site === "YouTube");
            if(trailers.length > 0) {
              setTrailerUrl(trailers[0].key);
            } else if(vidReq.data.results.length > 0 && vidReq.data.results[0].site === "YouTube") {
              setTrailerUrl(vidReq.data.results[0].key);
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

  const movie = movieDetails || passedMovie;

  if (error && !passedMovie) {
     return (
       <div className="detail">
         <Nav />
         <div style={{paddingTop: '150px', textAlign: 'center', fontSize: '1.2rem'}}>
           Failed to load movie details. (The requested resource could not be found).
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

  return (
    <>
      <div className="detail">
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
          <img 
            src={`${base_url}${movie.poster_path || movie.backdrop_path}`} 
            alt={movie.title || movie.name} 
            className="detail__poster"
          />
          
          <div className="detail__info">
            <div className="detail__back" onClick={() => navigate(-1)}>
              &larr; Back
            </div>
            
            <h1 className="detail__title">{movie.title || movie.name || movie.original_name}</h1>
            
            <div className="detail__meta">
              <span className="detail__rating">★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} Rating</span>
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
                        <div style={{width: '100%', height: '120px', backgroundColor: '#333', borderRadius: '8px', marginBottom: '8px'}} />
                      )}
                      <div className="detail__actor-name">{actor.name}</div>
                      <div className="detail__actor-char">{actor.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail__trailer">
              <h3 className="detail__trailer-title">Official Trailer</h3>
              {trailerUrl ? (
                <div className="detail__trailer-video">
                  <YouTube videoId={trailerUrl} opts={opts} />
                </div>
              ) : (
                <p style={{color: '#a3a3a3'}}>No trailer available for this title on TMDB.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Detail;
