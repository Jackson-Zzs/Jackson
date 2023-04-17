import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Welcome from './component/Welcome';
import Register from './component/Register';
import LogIn from './component/LogIn';
import Dashboard from './component/Dashboard';
import LogOut from './component/LogOut';
import EditGame from './component/EditGame';
import EditQuestion from './component/EditQuestion';
import GameResults from './component/GameResults';
import Previous from './component/Previous';
import Play from './component/Play';
import Game from './component/Game';

function Main () {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(token);

  // Load token
  useEffect(() => {
    const loadedToken = localStorage.getItem('token');

    setToken(loadedToken);

    if (loadedToken) {
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
        navigate('/dashboard');
      }
    } else if (!(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/');
    }
  }, [])

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  function manageToken (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  return (
    <>
      {token && <LogOut onLogout={logout} token={token} />}
      <hr />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LogIn onSuccess={manageToken} />} />
        <Route path="/register" element={<Register onSuccess={manageToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/editgame/:gameid" element={<EditGame token={token} />} />
        <Route path="/editquestion/game/:gameid/question/:questionid" element={<EditQuestion token={token} />} />
        <Route path="/results/:sessionid" element={<GameResults token={token} />} />
        <Route path="/previous/:gameid" element={<Previous token={token} />} />
        <Route path="/play/id/:sessionid" element={<Play />} />
        <Route path="/play" element={<Play />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

function App () {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
