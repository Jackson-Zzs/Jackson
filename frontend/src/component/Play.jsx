import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Form, Input, Button } from 'antd';

const { Title } = Typography;

function Play () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');

  async function joinSession () {
    const response = await fetch(`http://localhost:5005/play/join/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    sessionStorage.setItem('player', data.playerId);

    return true;
  }

  async function gotoGame () {
    const joined = await joinSession();

    if (!joined) {
      // TODO: Error somehow
      return;
    }

    navigate(`/game/${gameId}`);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
    <Title>Play Game</Title>
    <br />
    <Form>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input a name!' }]}
      >
        <Input value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Item>
      <Form.Item
        label="Game ID"
        name="gameid"
        rules={[{ required: true, message: 'Please input a session id!' }]}
      >
        <Input type="number" value={gameId} onChange={e => setGameId(e.target.value)}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled={!gameId || !username} onClick={gotoGame}>
          Join
        </Button>
      </Form.Item>
    </Form>
  </div>
  )
}

export default Play;
