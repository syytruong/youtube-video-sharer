import { useState, useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { MovieContext } from '../context/MovieContext';
import { AppBar, Toolbar, Typography, Button, TextField, Box, CircularProgress } from '@mui/material';
import { Home } from '@mui/icons-material';
import ShareMoviePopup from './ShareMoviePopup';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setMovies } = useContext(MovieContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    setUsername(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleLoginRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username || !password) {
        throw new Error('Please enter username and password')
      }

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

      setUser({ username, token: response.data.token, votedMovies: response.data.votedMovies });
      localStorage.setItem('user', JSON.stringify({ username, token: response.data.token, votedMovies: response.data.votedMovies }));
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login/Register failed:', error);
    }finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleShareMovie = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShare = async (youtubeUrl) => {
    try {
      const description = 'This is the default description';
      const title = 'Movie Title';
      const newMovie = await axios.post('/api/movies/create', { youtubeUrl, description, title }, { headers: { Authorization: `Bearer ${user.token}` } });
      setMovies((prevMovies) => [...prevMovies, newMovie.data]);
      setShowPopup(false);
    } catch (error) {
      console.error('Movie creation failed:', error);
    }
  };

  return (
    <Fragment>
      <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 'none', borderBottom: '2px solid black' }}>
        <Toolbar>
          <Home sx={{ fontSize: '3rem', marginRight: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '2.5rem' }}>
            Funny Movies
          </Typography>
          {user ? (
            <Fragment>
              <Typography variant="subtitle1">Welcome {user.username}</Typography>
              <Button color="inherit" onClick={handleShareMovie} sx={{ fontSize: '1rem' }}>
                Share a movie
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ fontSize: '1rem' }}>
                Logout
              </Button>
            </Fragment>
          ) : (
            <Box component="form" onSubmit={handleLoginRegister} sx={{ display: 'flex !important', alignItems: 'center'}}>
              <TextField
                label="Email"
                value={username}
                size="small"
                onChange={handleEmailChange}
                sx={{ fontSize: '0.8rem', marginRight: 1, flex: 1 }}
                error={!!emailError}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ fontSize: '0.8rem', marginRight: 1, flex: 1 }}
              />
              <Button variant="outlined" color="inherit" type="submit" disabled={loading || emailError || !password} sx={{ fontSize: '1rem', flex: 1 }}>
                <Box sx={{ width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? <CircularProgress size={20} /> : 'Login/Register'}
                </Box>
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <ShareMoviePopup open={showPopup} onClose={handleClosePopup} onShare={handleShare}/>
    </Fragment>
  );
};

export default Header;
