import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../../App';
import { UserContext } from '../../context/UserContext';

jest.mock('axios');

const mockUser = {
  _id: 'testUserId',
  username: 'testUsername',
  email: 'test@test.com',
  token: 'testToken',
};

describe('App integration tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          title: 'Funny Movie 1',
          youtubeUrl: 'https://www.youtube.com/embed/abc123',
          description: 'This is the default description',
        },
        {
          _id: '2',
          title: 'Funny Movie 2',
          youtubeUrl: 'https://www.youtube.com/embed/def456',
          description: 'This is the default description',
        },
      ],
    });
  });

  afterEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
  });

  it('Movies displays it on the page', async () => {
    render(
      <UserContext.Provider value={{ user: mockUser, setUser: () => {} }}>
        <App />
      </UserContext.Provider>
    );
  
    // Log in
    fireEvent.click(screen.getByText(/login\/register/i));
    userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    userEvent.type(screen.getByLabelText(/password/i), 'test_password');
    fireEvent.click(screen.getByText(/login\/register/i));
  
    // Wait for the movies to be displayed
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(/movie-/)).toHaveLength(2);
    });
  });
});
