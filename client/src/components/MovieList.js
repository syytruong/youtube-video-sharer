import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Container } from '@mui/material';
import MovieCard from './MovieCard';
import { MovieContext } from '../context/MovieContext';

const MovieList = () => {
  const { movies, setMovies } = useContext(MovieContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleVote = async (movieId, type) => {
    if (!user) return;

    try {
      const response = await axios.post(`/api/movies/${movieId}/vote`, { type }, { headers: { 'Authorization': `Bearer ${user.token}` } });

      setMovies(movies.map(movie => movie._id === movieId ? { ...movie, [type]: movie[type] + 1 } : movie));
      setUser({ ...user, votedMovies: response.data.votedMovies });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  console.log(user)

  return (
    <Container maxWidth="md" sx={{ marginTop: 10 }}>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          user={user}
          handleVote={handleVote}
          dataTestId={`movie-${movie._id}`}
        />
      ))}
    </Container>
  );
};

export default MovieList;
