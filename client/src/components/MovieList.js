import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Container, Typography } from '@mui/material';
import MovieCard from './MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');

        console.log("MOVIES:", response.data)
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
      await axios.post(`/api/movies/${movieId}/vote`, { type }, { headers: { 'Authorization': `Bearer ${user.token}` } });
      // Update the movie list with the new vote counts
      setMovies(movies.map(movie => movie._id === movieId ? { ...movie, [type]: movie[type] + 1 } : movie));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 10 }}>
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} user={user} handleVote={handleVote} />
      ))}
    </Container>
  );
};

export default MovieList;
