import React from 'react';
import { Input, Button, Form, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

function Register ({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  function jumpToLogIn () {
    navigate('/login');
  }

  async function register () {
    if (!email || !password || !name) {
      alert('email or password or name should not be empty');
    } else if (email || password || name) {
      const response = await fetch('http://localhost:5005/admin/auth/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });
      const data = await response.json();
      onSuccess(data.token);
      navigate('/login');
      console.log(data);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Register" style={{ width: 300 }}>
        <Form>
          <Form.Item label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={register}>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={jumpToLogIn}>
              Go Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
