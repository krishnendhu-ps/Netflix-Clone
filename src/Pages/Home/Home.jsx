import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import TitleCard from "../../Components/TitleCards/TitleCards";
import Footer from "../../Components/Footer/Footer";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import ReactPlayer from "react-player";
import axios from "../../axios";
import requests from "../../requests";

const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(null); 

  // Fetch hero data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(requests.fetchTrending);
        const movies = response.data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setHeroData(randomMovie);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  // Fetch video data
  const fetchVideo = async (movieId) => {
    try {
      const response = await axios.get(`/movie/${movieId}/videos?api_key=9242d6e4e67f181797dec911003e2860`);
      const trailer = response.data.results.find((video) => video.type === "Trailer");
      if (trailer) {
        setVideoKey(trailer.key);
      } else {
        alert("Trailer not available for this movie.");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!heroData) {
    return <div className="error">Error loading data. Please try again later.</div>;
  }

  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <img
          src={`https://image.tmdb.org/t/p/original${heroData.backdrop_path || "/default_hero.jpg"}`}
          alt={heroData.title || heroData.name || "Hero Banner"}
          className="banner-img"
        />
        <div className="hero-caption">
          <h1>{heroData.title || heroData.name || "Hero Title"}</h1>
          <p>{heroData.overview}</p>
          <div className="hero-btns">
            <button className="btn" onClick={() => fetchVideo(heroData.id)}>
              <img src={play_icon} alt="Play" />
              Play
            </button>
            <button className="btn dark-btn">
              <img src={info_icon} alt="More Info" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoKey && (
        <div className="video-modal">
          <div className="video-wrapper">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoKey}`}
              playing
              controls
              width="100%"
              height="100%"
            />
            <button className="close-btn" onClick={() => setVideoKey(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="more-cards">
        <TitleCard title="Top Rated Movies" fetchUrl={requests.fetchTopRated} isLargeRow />
        <TitleCard title="Only On Netflix" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
        <TitleCard title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} isLargeRow />
        <TitleCard title="Action Movies" fetchUrl={requests.fetchActionMovies} isLargeRow />
      </div>
      <Footer />
    </div>
  );
};


export default Home;