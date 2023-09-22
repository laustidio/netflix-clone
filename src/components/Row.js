import "./styles/Row.css";
import axios from "../api/axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import DetailsScreen from "./modal/DetailsScreen";

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const base_url = "https://image.tmdb.org/t/p/original/";
  const urlDetails = "https://api.themoviedb.org/3";
  const [trailerId, setTrailerId] = useState({
    key: "",
    banner: "",
  });
  const [trailerDetails, setTrailerDetails] = useState(null);
  const api_key = process.env.REACT_APP_API_KEY;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
    }

    fetchData();
  }, [fetchUrl]);

  async function fetchDataDetails(idMovie) {
    const responseDetailsMovie = await axios.get(
      `${urlDetails}/movie/${idMovie}`,
      {
        params: {
          api_key: api_key,
          append_to_response: "videos,images",
        },
      }
    );
    renderornot(responseDetailsMovie.data);
  }

  const renderornot = (data) => {
    setTrailerDetails(data);
    if (data.videos !== undefined && data.videos.results.length > 0) {
      const trailer = data.videos.results.find((vid) => {
        return vid.name === "Official Trailer";
      });
      const key = trailer ? trailer.key : data.videos.results[0].key;
      setTrailerId({ key: key });
    } else {
      setTrailerId({ banner: "" });
    }
  };

  return (
    <div className={`_row`}>
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <img
                onClick={() => {
                  handleShow(true);
                  fetchDataDetails(movie.id);
                }}
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                key={movie.id}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={`${movie.name}`}
              />
            )
        )}
      </div>
      <div>
        {show && (
          <>
            <Modal
              show={show}
              onHide={handleClose}
              size="md"
              className="detailsScreen"
            >
              <DetailsScreen
                closeDetails={handleClose}
                trailerId={trailerId}
                trailerDetails={trailerDetails}
              />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}

export default Row;
