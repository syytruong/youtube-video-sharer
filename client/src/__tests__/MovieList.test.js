import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import MovieList from '../components/MovieList';

jest.mock('axios');

describe('MovieList', () => {
  const renderMovieList = (user, setUser) => {
    return render(
      <UserContext.Provider value={{ user, setUser }}>
        <MovieList />
      </UserContext.Provider>
    );
  };

  test('renders movie list and fetches movies', async () => {
    const moviesData = [
    {
        _id: '1',
        title: 'Funny Movie 1',
        url: 'https://www.youtube.com/watch?v=12345',
        upvote: 5,
        downvote: 3,
      },
      {
        _id: '2',
        title: 'Funny Movie 2',
        url: 'https://www.youtube.com/watch?v=67890',
        upvote: 8,
        downvote: 1,
      },
    ];

    axios.get.mockResolvedValueOnce({ data: moviesData });

    await act(async () => {
      renderMovieList(null, () => {});
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Funny Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Funny Movie 2')).toBeInTheDocument();
  });

  test('handles voting', async () => {
    const user = { username: 'testUser', token: 'testToken', votedMovies: {} };
    const setUser = jest.fn();

    const moviesData = [
      {
        _id: '1',
        title: 'Funny Movie 1',
        url: 'https://www.youtube.com/watch?v=12345',
        upvote: 5,
        downvote: 3,
      },
    ];

    axios.get.mockResolvedValueOnce({ data: moviesData });
    axios.get.mockResolvedValueOnce({ data: { votedMovies: {} } }); // Add this line
    axios.post.mockResolvedValueOnce({
      data: { votedMovies: { '1': 'upvote' } },
    });

    await act(async () => {
      renderMovieList(user, setUser);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText(/upvote/i));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith(
      '/api/movies/1/vote',
      { type: 'upvote' },
      { headers: { Authorization: 'Bearer testToken' } }
    );

    expect(setUser).toHaveBeenCalledWith({
      ...user,
      votedMovies: { '1': 'upvote' },
    });
  });
});
