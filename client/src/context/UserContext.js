import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(initialUser ? { ...initialUser, votedMovies: {} } : null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
