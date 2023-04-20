import React from 'react';
import { render as rtlRender, fireEvent, screen, within } from '@testing-library/react';
import ShareMoviePopup from '../components/ShareMoviePopup';

function render(ui, { onClose, onShare, ...renderOptions } = {}) {
  const handleClose = onClose || jest.fn();
  const handleShare = onShare || jest.fn();
  const Wrapper = ({ children }) => (
    <ShareMoviePopup open={true} onClose={handleClose} onShare={handleShare}>
      {children}
    </ShareMoviePopup>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe('ShareMoviePopup', () => {
  test('renders the dialog with the correct title', () => {
    render(<div />);
    const title = screen.getByText('Share a youtube movie');
    expect(title).toBeInTheDocument();
  });

  test('calls onShare when the Share button is clicked', () => {
    const handleShare = jest.fn();
    render(<div />, { onShare: handleShare });

    const shareButton = screen.getByRole('button', { name: /share/i });

    fireEvent.change(screen.getByLabelText('Youtube Url'), {
      target: { value: 'https://www.youtube.com/watch?v=test' },
    });

    fireEvent.click(shareButton);

    expect(handleShare).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test');
  });

  test('clears the input field after sharing', () => {
    render(<div />);

    const shareButton = screen.getByRole('button', { name: /share/i });

    const youtubeUrlInput = screen.getByLabelText('Youtube Url');
    fireEvent.change(youtubeUrlInput, {
      target: { value: 'https://www.youtube.com/watch?v=test' },
    });

    fireEvent.click(shareButton);

    expect(youtubeUrlInput.value).toBe('');
  });
});
