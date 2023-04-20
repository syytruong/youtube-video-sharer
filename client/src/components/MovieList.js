import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Container } from '@mui/material';
import MovieCard from './MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user && user.token) {
        try {
          const response = await axios.get('/api/users/single', {
            headers: { 'Authorization': `Bearer ${user.token}` },
          });
          setUser({ ...user, votedMovies: response.data.votedMovies });
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }
    };
    fetchCurrentUser();
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
