import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import DiagramPage from "./pages/DiagramPage";
import ChartsPage from "./pages/ChartsPage";

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="h-[calc(100vh-88px)] sm:h-[calc(100vh-72px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diagram" element={<DiagramPage />} />
              <Route path="/charts" element={<ChartsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;
