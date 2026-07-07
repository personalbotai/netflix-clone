import React, { useState, useEffect } from "react";
import Row from "./Row";
import LocalRow from "./LocalRow";
import requests from "../requests";
import Banner from "./Banner";
import Nav from "./Nav";
import Footer from "./Footer";
import "./Home.css";

const categories = [
  { id: "all", name: "All", url: null, isLarge: false },
  { id: "originals", name: "Originals", url: requests.fetchNetflixOriginals, isLarge: true },
  { id: "trending", name: "Trending", url: requests.fetchTrending, isLarge: false },
  { id: "top_rated", name: "Top Rated", url: requests.fetchTopRated, isLarge: false },
  { id: "action", name: "Action", url: requests.fetchActionMovies, isLarge: false },
  { id: "comedy", name: "Comedy", url: requests.fetchComedyMovies, isLarge: false },
  { id: "horror", name: "Horror", url: requests.fetchHorrorMovies, isLarge: false },
  { id: "romance", name: "Romance", url: requests.fetchRomanceMovies, isLarge: false },
  { id: "scifi", name: "Sci-Fi", url: requests.fetchSciFi, isLarge: false },
  { id: "animation", name: "Animation", url: requests.fetchAnimation, isLarge: false },
  { id: "mystery", name: "Mystery", url: requests.fetchMystery, isLarge: false },
  { id: "drama", name: "Drama", url: requests.fetchDrama, isLarge: false },
  { id: "crime", name: "Crime", url: requests.fetchCrime, isLarge: false },
  { id: "fantasy", name: "Fantasy", url: requests.fetchFantasy, isLarge: false },
  { id: "documentary", name: "Documentaries", url: requests.fetchDocumentaries, isLarge: false },
];

function Home() {
  const [myList, setMyList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const loadMyList = () => {
    const list = JSON.parse(localStorage.getItem("netflixCloneMyList")) || [];
    setMyList(list);
  };

  useEffect(() => {
    loadMyList();
    window.addEventListener('storage', loadMyList);
    
    return () => {
      window.removeEventListener('storage', loadMyList);
    };
  }, []);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    window.scrollTo({
      top: window.innerHeight * 0.5,
      behavior: 'smooth'
    });
  };

  const renderRows = () => {
    if (activeCategory === "all") {
      return (
        <>
          {myList.length > 0 && (
            <LocalRow title="My List" movies={myList} isLargeRow={false} />
          )}
          {categories.map((cat) => {
             if (cat.id === "all") return null;
             return (
               <Row 
                 key={cat.id} 
                 title={cat.name === "Originals" ? "ORIGINALS" : cat.name} 
                 fetchUrl={cat.url} 
                 isLargeRow={cat.isLarge} 
                 isGridMode={false}
               />
             )
          })}
        </>
      );
    }

    const selectedCategory = categories.find(cat => cat.id === activeCategory);
    
    return (
      <div style={{ paddingTop: '20px', minHeight: '60vh', paddingBottom: '50px' }}>
        <Row 
          key={selectedCategory.id}
          title={`${selectedCategory.name} Movies`} 
          fetchUrl={selectedCategory.url} 
          isLargeRow={selectedCategory.isLarge} 
          isGridMode={true} /* Menerapkan format Grid 2 Baris / Multi-baris ke bawah */
        />
      </div>
    );
  };

  return (
    <>
      <Nav />
      <Banner />
      
      <div className="category-filter">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <div className="home-content">
        {renderRows()}
      </div>

      <Footer />
    </>
  );
}

export default Home;
