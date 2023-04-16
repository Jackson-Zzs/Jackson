import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Layout, Row, Col } from 'antd';
import gameBackground from './welcome.jpg';

const { Title } = Typography;
const { Content } = Layout;

function Welcome () {
  const navigate = useNavigate();

  function jumpToLogIn () {
    navigate('/login');
  }

  function jumpToRegister () {
    navigate('/register');
  }

  const welcomeLayoutStyle = {
    height: '100vh',
    backgroundImage: `url(${gameBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const welcomeContentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  return (
    <Layout style={welcomeLayoutStyle}>
      <Content style={welcomeContentStyle}>
        <Row justify="center">
          <Col>
            <Title>Welcome to Bigbrain</Title>
            <br />
            <Row justify="center">
              <Col>
                <Button type="primary" onClick={jumpToLogIn}>
                  Go LogIn
                </Button>
              </Col>
            </Row>
            <br />
            <Row justify="center">
              <Col>
                <Button type="primary" onClick={jumpToRegister}>
                  Go Register
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Welcome;
