import React, { useState, useEffect } from "react";
import Row from "./Row";
import LocalRow from "./LocalRow";
import requests from "../requests";
import Banner from "./Banner";
import Nav from "./Nav";
import Footer from "./Footer";

function Home() {
  const [myList, setMyList] = useState([]);

  // Fungsi untuk memuat list
  const loadMyList = () => {
    const list = JSON.parse(localStorage.getItem("netflixCloneMyList")) || [];
    setMyList(list);
  };

  useEffect(() => {
    loadMyList();
    // Listen for storage events (if triggered manually from other components)
    window.addEventListener('storage', loadMyList);
    
    return () => {
      window.removeEventListener('storage', loadMyList);
    };
  }, []);

  return (
    <>
      <Nav />
      <Banner />
      
      {myList.length > 0 && (
        <LocalRow title="My List" movies={myList} isLargeRow={false} />
      )}

      <Row
        title="ORIGINALS"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
      />
      <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
      <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
      <Footer />
    </>
  );
}

export default Home;
