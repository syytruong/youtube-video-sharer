import { useState, useContext, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { AppBar, Toolbar, Typography, Button, TextField, Box } from '@mui/material';
import { Home } from '@mui/icons-material';
import ShareMoviePopup from './ShareMoviePopup';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
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
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShare = () => {
    console.log(youtubeUrl);
    setYoutubeUrl('');
    setShowPopup(false);
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
            <>
              <Typography variant="subtitle1">Welcome {user.username}</Typography>
              <Button color="inherit" onClick={handleShareMovie} sx={{ fontSize: '1rem' }}>
                Share a movie
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ fontSize: '1rem' }}>
                Logout
              </Button>
            </>
          ) : (
            <Box component="form" onSubmit={handleLoginRegister} sx={{ display: 'flex !important', alignItems: 'center'}}>
              <TextField
                label="Email"
                value={username}
                size="small"
                onChange={(e) => setUsername(e.target.value)}
                sx={{ fontSize: '0.8rem', marginRight: 1, flex: 1 }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ fontSize: '0.8rem', marginRight: 1, flex: 1 }}
              />
              <Button variant="outlined" color="inherit" type="submit" sx={{ fontSize: '1rem', flex: 1 }}>
                Login/Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <ShareMoviePopup open={showPopup} onClose={handleClosePopup} onShare={handleShare} youtubeUrl={youtubeUrl} setYoutubeUrl={setYoutubeUrl} />
    </Fragment>
  );
};

export default Header;
