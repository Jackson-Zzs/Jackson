import React from 'react';
import { Input, Button, Form, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

function LogIn ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  function jumpToRegister () {
    navigate('/register');
  }

  async function login () {
    if (!email || !password) {
      alert('email and password should not be empty');
    } else {
      const response = await fetch('http://localhost:5005/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.token);
        onSuccess(data.token);
        console.log(data);
        navigate('/dashboard');
      } else {
        alert('Please enter the right email and password');
      }
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Log In" style={{ width: 300 }}>
        <Form>
          <Form.Item label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={login}>
              Log In
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={jumpToRegister}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LogIn;
