import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import Nav from './Nav';
import Footer from './Footer';
import './SearchPage.css';
import { API_KEY } from '../requests';

const base_url = "https://image.tmdb.org/t/p/w500";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery().get("q");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchSearch() {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const req = await axios.get(`/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
        
        // Filter out results that don't have images
        const validResults = req.data.results.filter(
          item => item.poster_path || item.backdrop_path
        );
        
        setResults(validResults);
      } catch (error) {
        console.error("Error searching", error);
      }
      setLoading(false);
    }
    fetchSearch();
  }, [query]);

  const handleClick = (movie) => {
    const type = movie.media_type || "movie"; 
    navigate(`/detail/${type}/${movie.id}`, { state: { movie, type } });
  };

  return (
    <div className="search-page">
      <Nav />
      <div className="search-page__content">
        {query ? (
          <h2 className="search-page__header">
            Search results for: <strong>"{query}"</strong>
          </h2>
        ) : (
          <h2 className="search-page__header">Please enter a search term</h2>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem" }}>Loading...</div>
        ) : results.length > 0 ? (
          <div className="search-page__grid">
            {results.map((movie) => (
              <div 
                key={movie.id} 
                className="search__poster-container"
                onClick={() => handleClick(movie)}
              >
                <img
                  className="search__poster"
                  src={`${base_url}${movie.poster_path || movie.backdrop_path}`}
                  alt={movie.name || movie.title}
                  loading="lazy"
                />
                <div className="search__info">
                  <div className="search__title">
                    {movie.title || movie.name || movie.original_name}
                  </div>
                  <div className="search__rating">
                    ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          query && (
            <div className="search-page__no-results">
              Your search for "{query}" did not have any matches.
              <br/><br/>
              Try different keywords or check for spelling errors.
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
