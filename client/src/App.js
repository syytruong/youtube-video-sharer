import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import ShareMovie from './components/ShareMovie';
import MovieList from './components/MovieList';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={MovieList} />
          <Route path="/share" component={ShareMovie} />
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
