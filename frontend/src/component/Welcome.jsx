import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';

const { Title } = Typography;

function Welcome () {
  const navigate = useNavigate();

  function jumpToLogIn () {
    navigate('/login');
  }

  function jumpToRegister () {
    navigate('/register');
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
    <Title>Welcome to Bigbrain</Title>
    <br />
    <Space>
      <Button type="primary" onClick={jumpToLogIn}>
        Go LogIn
      </Button>
      <Button type="primary" onClick={jumpToRegister}>
        Go Register
      </Button>
    </Space>
  </div>
  )
}

export default Welcome;
