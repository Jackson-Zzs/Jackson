import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './component/Welcome';
import Register from './component/Register';
import LogIn from './component/LogIn';
import Dashboard from './component/Dashboard';
import LogOut from './component/LogOut';
import EditGame from './component/EditGame';
import EditQuestion from './component/EditQuestion';

function Main () {
  const storedToken = localStorage.getItem('token') || '';
  const [token, setToken] = React.useState(storedToken);
  const navigate = useNavigate();
  // console.log(token);

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
        <Route
          path="/register"
          element={<Register onSuccess={manageToken} />}
        />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/editgame/:gameid" element={<EditGame token={token} />} />
        <Route
          path="/editquestion/game/:gameid/question/:questionid"
          element={<EditQuestion token={token} />}
        />
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
