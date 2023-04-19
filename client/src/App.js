import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import MovieList from './components/MovieList';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MovieList />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
