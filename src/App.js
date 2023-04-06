import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from './components/MovieList';
import Movie from './components/Movie';
import EditMovieForm from './components/EditMovieForm';
import MovieHeader from './components/MovieHeader';
import AddMovieForm from './components/AddMovieForm';

import FavoriteMovieList from './components/FavoriteMovieList';

import axios from 'axios';

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { push } = useHistory();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:9000/api/movies')
      .then(res => {
        setMovies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id) => {
    axios
      .delete(`http://localhost:9000/api/movies/${id}`)
      .then(res => {
        push("/movies");
        setMovies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const addToFavorites = (movie) => {
    setFavoriteMovies([...favoriteMovies], movie);

    if (!favoriteMovies.find((mov) => mov.id === movie.id)) {
      setFavoriteMovies([...favoriteMovies, movie]);
    } else {
      alert("Bu film daha önce favoriler içerisine eklendi!")
    }
  }

  return (
    <div className={darkMode && `dark bg-slate-900 h-screen`}>
      <nav className="bg-zinc-800 text-white px-6 py-3 dark: bg-gray-800">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>{" "}
        <button onClick={() => setDarkMode(!darkMode)}>Dark Mode On/Off</button>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList 
          favoriteMovies={favoriteMovies}
          darkMode={darkMode}
          />

          <Switch>
            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie addToFavorites={addToFavorites} deleteMovie={deleteMovie} />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};


export default App;

