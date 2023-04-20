/* eslint-disable testing-library/no-unnecessary-act */
import { render, fireEvent, screen, act } from '@testing-library/react';
import MovieCard from '../../components/MovieCard';

const movie = {
  _id: '1',
  title: 'Funny Movie 1',
  youtubeUrl: 'https://www.youtube.com/watch?v=12345',
  upVotes: 5,
  downVotes: 3,
};

const user = {
  username: 'testUser',
  token: 'testToken',
  votedMovies: {},
};

const handleVote = jest.fn();

describe('MovieCard', () => {
  test('renders the movie card correctly', () => {
    render(<MovieCard movie={movie} user={user} handleVote={handleVote} dataTestId="movie-card" />);

    expect(screen.getByTestId('movie-card')).toBeInTheDocument();
    expect(screen.getByText('Funny Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Shared by: Deleted user')).toBeInTheDocument();
    expect(screen.getByTestId('upvote-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('down-button-1')).toBeInTheDocument();
  });

  test('handles button clicks', async () => {
    render(<MovieCard movie={movie} user={user} handleVote={handleVote} dataTestId="movie-card" />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('upvote-button-1'));
    });
    expect(handleVote).toHaveBeenCalledTimes(1);
    expect(handleVote).toHaveBeenCalledWith('1', 'upVotes');
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('down-button-1'));
    });
    expect(handleVote).toHaveBeenCalledTimes(2);
    expect(handleVote).toHaveBeenCalledWith('1', 'downVotes');
  });
});
