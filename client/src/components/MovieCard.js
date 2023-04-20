import { Fragment } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

const MovieCard = ({ movie, user, handleVote }) => {
  return (
    <Card key={movie._id} sx={{ marginBottom: 2 }}>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <iframe
            width="100%"
            height="315"
            src={movie.youtubeUrl.replace('watch?v=', 'embed/')}
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {movie.title}
            </Typography>
            <Typography color="text.secondary" sx={{ display: 'inline' }}>
              Shared by: {movie.user?.username || 'Deleted user'}
            </Typography>
            {user && (
              <Fragment>
                {user.votedMovies?.[movie._id] !== 'downVotes' && (
                  <Button
                    size="small"
                    onClick={() => handleVote(movie._id, 'upVotes')}
                    startIcon={user.votedMovies?.[movie._id] ? <ThumbUp /> : <ThumbUpOffAltIcon />}
                    sx={user.votedMovies?.[movie._id] === 'upVotes' ? { fontWeight: 'bold', ml: 1 } : { ml: 1 }}
                    disabled={user.votedMovies?.[movie._id] === 'upVotes'}
                  />
                )}
                {user.votedMovies?.[movie._id] !== 'upVotes' && (
                  <Button
                    size="small"
                    onClick={() => handleVote(movie._id, 'downVotes')}
                    startIcon={user.votedMovies?.[movie._id] ? <ThumbDown /> : <ThumbDownOffAltIcon />}
                    sx={user.votedMovies?.[movie._id] === 'downVotes' ? { fontWeight: 'bold' } : {}}
                    disabled={user.votedMovies?.[movie._id] === 'downVotes'}
                  />
                )}
              </Fragment>
            )}

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {movie.upVotes} <ThumbUp fontSize="small" /> {movie.downVotes}{' '}
              <ThumbDown fontSize="small" />
            </Typography>
            <Typography color="text.secondary">
              Description:
              <br />
              {movie.description}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MovieCard;
