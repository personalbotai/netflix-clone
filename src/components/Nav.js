import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";

function Nav() {
  const [show, handleShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    };
    window.addEventListener("scroll", handleScroll);

    // Click outside to close search
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (searchTerm === "") {
          setSearchActive(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleSearch = () => {
    setSearchActive(true);
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 className="nav__logo">FlixUI</h2>
      </Link>
      
      <div className="nav__right">
        <form 
          ref={searchRef}
          className={`nav__search ${searchActive ? "active" : ""}`} 
          onSubmit={handleSearch}
        >
          <div className="nav__searchIcon" onClick={toggleSearch}>
            {/* Search Icon SVG */}
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            className="nav__search-input" 
            placeholder="Titles, people, genres" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={searchActive}
          />
        </form>
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="Avatar"
        />
      </div>
    </div>
  );
}

export default Nav;
