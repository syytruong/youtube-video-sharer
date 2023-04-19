import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { MovieProvider } from './context/MovieContext';
import Header from './components/Header';
import MovieList from './components/MovieList';

function App() {
  return (
    <UserProvider>
      <MovieProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<MovieList />} />
          </Routes>
        </Router>
      </MovieProvider>
    </UserProvider>
  );
}

export default App;
