/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import MovieList from '../../components/MovieList';

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
        youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
        upvote: 0,
        downvote: 0,
      },
      {
        _id: '2',
        title: 'Funny Movie 2',
        youtubeUrl: 'https://www.youtube.com/watch?v=def456',
        upvote: 0,
        downvote: 0,
      },
    ];

    axios.get.mockResolvedValueOnce({ data: moviesData });

    renderMovieList(null, () => {});

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });  

    expect(await screen.findByTestId('movie-1')).toBeInTheDocument();
    expect(await screen.findByTestId('movie-2')).toBeInTheDocument();
  });

  test('handles voting', async () => {
    const user = { username: 'testUser', token: 'testToken', votedMovies: {} };
    const setUser = jest.fn();
  
    const moviesData = [
      {
        _id: '1',
        title: 'Funny Movie 1',
        youtubeUrl: 'https://www.youtube.com/watch?v=12345',
        upvote: 5,
        downvote: 3,
      },
    ];
  
    axios.get.mockResolvedValueOnce({ data: moviesData });
    axios.get.mockResolvedValueOnce({ data: { votedMovies: {} } });
    axios.post.mockResolvedValueOnce({
      data: { votedMovies: { '1': 'upVotes' } },
    });
  
    renderMovieList(user, setUser);

    const upvoteButton = await screen.findByTestId('upvote-button-1');

    await act(async () => {
      fireEvent.click(upvoteButton);
    });

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(setUser).toHaveBeenCalledWith({
      ...user,
      votedMovies: { '1': 'upVotes' },
    });
  
    expect(axios.post).toHaveBeenCalledWith(
      '/api/movies/1/vote',
      { type: 'upVotes' },
      { headers: { Authorization: 'Bearer testToken' } }
    );
  
    expect(setUser).toHaveBeenCalledWith({
      ...user,
      votedMovies: { '1': 'upVotes' },
    });
  });  
});
