import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Detail from "./components/Detail";
import StaticPage from "./components/StaticPage";
import SearchPage from "./components/SearchPage";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:type/:id" element={<Detail />} />
          <Route path="/search" element={<SearchPage />} />
          {/* Catch-all route for footer links */}
          <Route path="/:staticRoute" element={<StaticPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
