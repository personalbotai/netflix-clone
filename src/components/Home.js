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
    // Smooth scroll sedikit agar banner terlewat dan filter menempel di atas
    window.scrollTo({
      top: window.innerHeight * 0.5,
      behavior: 'smooth'
    });
  };

  // Logika Render Baris berdasarkan Kategori Aktif
  const renderRows = () => {
    if (activeCategory === "all") {
      return (
        <>
          {myList.length > 0 && (
            <LocalRow title="My List" movies={myList} isLargeRow={false} />
          )}
          <Row title="ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
          <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
          <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
          <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
          <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
          <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
          <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
          <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
        </>
      );
    }

    const selectedCategory = categories.find(cat => cat.id === activeCategory);
    
    return (
      <div style={{ paddingTop: '20px', minHeight: '60vh' }}>
        <Row 
          key={selectedCategory.id} // Kunci re-render
          title={`Top ${selectedCategory.name}`} 
          fetchUrl={selectedCategory.url} 
          isLargeRow={selectedCategory.isLarge} 
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
