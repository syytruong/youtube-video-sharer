import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

const MovieCard = ({ movie, user, handleVote }) => {
  return (
    <Card key={movie._id} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {movie.title}
        </Typography>
        <Typography color="text.secondary">
          Shared by: {movie.user.username}
        </Typography>
        <Typography color="text.secondary">
          {movie.description}
        </Typography>
      </CardContent>
      {user && (
        <CardActions>
          <Button
            size="small"
            onClick={() => handleVote(movie._id, 'upVotes')}
            startIcon={<ThumbUp />}
            sx={user.votedMovies?.[movie._id] === 'upVotes' ? { fontWeight: 'bold' } : {}}
          >
            {movie.upVotes}
          </Button>
          <Button
            size="small"
            onClick={() => handleVote(movie._id, 'downVotes')}
            startIcon={<ThumbDown />}
            sx={user.votedMovies?.[movie._id] === 'downVotes' ? { fontWeight: 'bold' } : {}}
          >
            {movie.downVotes}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default MovieCard;
