import { useState } from 'react';
import { TextField, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

const SharePopup = ({ open, onClose, onShare }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleShare = () => {
    onShare(youtubeUrl);
    setYoutubeUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Share a youtube movie</DialogTitle>
      <DialogContent>
        <TextField
          label="Youtube Url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          fullWidth
          autoFocus
          sx={{ marginTop: '16px' }}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handleShare}>
          Share
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;
