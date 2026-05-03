import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectDetailPage from './components/ProjectDetailPage';
import Gallery from './components/Gallery';
import ResumePage from './components/ResumePage';
import Experience from './components/Experience';
import Education from './components/Education';
import Toolbox from './components/Toolbox';
import ProjectsPage from './components/ProjectsPage';
import PeopleWorked from './components/PeopleWorked';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [portfolioResponse, projectsResponse] = await Promise.all([
          fetch('http://localhost:5001/api/portfolio'),
          fetch('http://localhost:5001/api/github/projects')
        ]);

        const data = await portfolioResponse.json();
        const projectsData = await projectsResponse.json();
        const githubProjects = projectsData?.projects || [];

        setPortfolioData({
          ...data,
          projects: githubProjects.length > 0 ? githubProjects : data.projects
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero data={portfolioData?.personal} />
              <Education data={portfolioData?.education} />
              <Experience data={portfolioData?.experience} />
              <Toolbox data={portfolioData?.toolbox} />
              <Achievements data={portfolioData?.achievements} />
              <PeopleWorked data={portfolioData?.testimonials} />
              <Contact data={portfolioData?.personal} />
            </>
          } />
          <Route path="/projects" element={<ProjectsPage data={portfolioData?.projects} />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage data={portfolioData?.projects} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<Contact data={portfolioData?.personal} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
