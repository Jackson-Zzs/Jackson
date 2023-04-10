import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Register from './component/Register';
import LogIn from './component/LogIn';
import Dashboard from './component/Dashboard';

function Nav ({ onLogout }) {
  return (
    <>
      <button onClick={onLogout}>Logout</button>
      <hr />
    </>
  );
}

function Main () {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  console.log(token);

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
      {token && <Nav onLogout={logout} />}
      <Routes>
        <Route path="/" element={<div>111</div>} />
        <Route path="/login" element={<LogIn onSuccess={manageToken} />} />
        <Route path="/register" element={<Register onSuccess={manageToken} />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
