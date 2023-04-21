import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserContext } from '../../context/UserContext';
import { MovieContext } from '../../context/MovieContext';
import axios from 'axios';
import MovieList from '../../components/MovieList';

jest.mock('axios');

const moviesData = [
  {
    _id: '1',
    title: 'Funny Movie 1',
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
    upVotes: 0,
    downVotes: 0,
  },
  {
    _id: '2',
    title: 'Funny Movie 2',
    youtubeUrl: 'https://www.youtube.com/watch?v=def456',
    upVotes: 0,
    downVotes: 0,
  },
];

describe('MovieList', () => {
  const renderMovieList = (user, setUser, setMovies) => {
    return render(
      <UserContext.Provider value={{ user, setUser }}>
        <MovieContext.Provider value={{ movies: moviesData, setMovies }}>
          <MovieList />
        </MovieContext.Provider>
      </UserContext.Provider>
    );
  };

  test('renders movie list and fetches movies', async () => {
    axios.get.mockResolvedValueOnce({ data: moviesData });

    renderMovieList(null, () => {}, () => {});

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByTestId('movie-1')).toBeInTheDocument();
    expect(await screen.findByTestId('movie-2')).toBeInTheDocument();
  });

  test('handles voting', async () => {
    const user = { username: 'testUser', token: 'testToken', votedMovies: {} };
    const setUser = jest.fn();
    const setMovies = jest.fn();
  
    axios.get.mockResolvedValueOnce({ data: moviesData });
    axios.post.mockResolvedValueOnce({
      data: { votedMovies: { '1': 'upVotes' } },
    });
  
    renderMovieList(user, setUser, setMovies);
  
    const upvoteButton = await screen.findByTestId('upvote-button-1');
  
    fireEvent.click(upvoteButton);
  
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
    expect(axios.post).toHaveBeenCalledWith(
      '/api/movies/1/vote',
      { type: 'upVotes' },
      { headers: { Authorization: 'Bearer testToken' } }
    );
  
    await waitFor(() => expect(setUser).toHaveBeenCalledWith({
      ...user,
      votedMovies: { '1': 'upVotes' },
    }));
  });
});

