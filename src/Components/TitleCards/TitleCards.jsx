import React, { useEffect, useState } from "react";
import axios from "../../axios"; // Ensure axios is correctly configured
import "./TitleCards.css";
import ReactPlayer from "react-player"; // Make sure to import ReactPlayer

const base_url = "https://image.tmdb.org/t/p/original/";

function TitleCard({ fetchUrl, title, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videoKey, setVideoKey] = useState(null); // Store the video key for the trailer
  const [showModal, setShowModal] = useState(false); // Control video modal visibility

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Fetch video trailer for the movie
  const fetchVideo = async (movieId) => {
    try {
      const response = await axios.get(/movie/${movieId}/videos?api_key=9242d6e4e67f181797dec911003e2860);
      const trailer = response.data.results.find((video) => video.type === "Trailer");
      if (trailer) {
        setVideoKey(trailer.key); // Set the video key to be used in ReactPlayer
        setShowModal(true); // Show the video modal
      } else {
        alert("Trailer not available for this movie.");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const handlePosterClick = (movieId) => {
    fetchVideo(movieId); // Fetch video when poster is clicked
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error loading movies. Please try again later.</div>;
  }

  return (
    <div className="title-card">
      <h2>{title}</h2>
      <div className="title-card-posters">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <img
              key={movie.id}
              className={title-card-poster ${isLargeRow ? "title-card-posterLarge" : ""}}
              src={${base_url}${isLargeRow ? movie.poster_path || "/default_poster.jpg" : movie.backdrop_path || "/default_backdrop.jpg"}}
              alt={movie.name || movie.title || "No Title"}
              loading="lazy"
              onClick={() => handlePosterClick(movie.id)} // Trigger fetchVideo on poster click
            />
          ))
        ) : (
          <p>No movies available.</p>
        )}
      </div>

      {/* Video Modal */}
      {showModal && videoKey && (
        <div className="video-modal">
          <div className="video-wrapper">
            <ReactPlayer
              url={https://www.youtube.com/watch?v=${videoKey}}
              playing
              controls
              width="100%"
              height="100%"
            />
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TitleCard;