import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { Home } from '@mui/icons-material';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginRegister = async (e) => {
    e.preventDefault();

    try {
      let response;

      // Check if the user exists
      try {
        response = await axios.post('/api/users/login', { username, password });
      } catch (error) {
        // If the user doesn't exist, register and log in
        if (error.response.status === 404) {
          response = await axios.post('/api/users/register', { username, password });
        } else {
          throw error;
        }
      }

      setUser({ username, token: response.data.token });
      localStorage.setItem('user', JSON.stringify({ username, token: response.data.token }));
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login/Register failed:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleShareMovie = () => {
    navigate('/share');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Home sx={{ marginRight: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Funny Movies
        </Typography>
        {user ? (
          <>
            <Typography variant="subtitle1">Welcome {user.username}</Typography>
            <Button color="inherit" onClick={handleShareMovie}>
              Share a movie
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <form onSubmit={handleLoginRegister}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginRight: 1 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginRight: 1 }}
            />
            <Button variant="outlined" color="inherit" type="submit">
              Login/Register
            </Button>
          </form>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
