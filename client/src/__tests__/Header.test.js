import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { MovieContext } from '../context/MovieContext';
import Header from '../components/Header';

jest.mock('axios');

describe('Header', () => {
  const renderHeader = (user, setUser, setMovies) => {
    return render(
      <BrowserRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <MovieContext.Provider value={{ setMovies }}>
            <Header />
          </MovieContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders the app title', () => {
    renderHeader(null, () => {}, () => {});

    expect(screen.getByText('Funny Movies')).toBeInTheDocument();
  });

  it('shows login/register form when the user is not logged in', () => {
    renderHeader(null, () => {}, () => {});

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login/Register')).toBeInTheDocument();
  });

  it('shows username, share a movie and logout buttons when the user is logged in', () => {
    const user = { username: 'testUser', token: 'testToken' };

    renderHeader(user, () => {}, () => {});

    expect(screen.getByText('Welcome testUser')).toBeInTheDocument();
    expect(screen.getByText('Share a movie')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('logs in the user when the user exists', async () => {
    const setUser = jest.fn();
    const setMovies = jest.fn();
    renderHeader(null, setUser, setMovies);
  
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  
    // Mock a successful login response
    axios.post.mockResolvedValueOnce({ data: { token: 'test_token' } });
  
    fireEvent.submit(screen.getByRole('button', { name: /login\/register/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/login', { username: 'test@test.com', password: 'password' });
    });
  
    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith({ username: 'test@test.com', token: 'test_token' });
    });
  });  

  it('registers and logs in the user when the user does not exist', async () => {
    const setUser = jest.fn();
    renderHeader(null, setUser, () => {});

    axios.post.mockRejectedValueOnce({ response: { status: 404 } });
    axios.post.mockResolvedValueOnce({ data: { token: 'newUserToken' } });

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'newUserPassword' },
    });
    fireEvent.click(screen.getByText('Login/Register'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
    expect(axios.post).toHaveBeenNthCalledWith(1, '/api/users/login', {
      username: 'newuser@example.com',
      password: 'newUserPassword',
    });
    expect(axios.post).toHaveBeenNthCalledWith(2, '/api/users/register', {
      username: 'newuser@example.com',
      password: 'newUserPassword',
    });
    expect(setUser).toHaveBeenCalledWith({
      username: 'newuser@example.com',
      token: 'newUserToken',
    });
  });
});

