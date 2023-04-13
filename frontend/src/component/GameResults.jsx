// GameResults.jsx
import React, { useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { useParams } from 'react-router-dom';

function GameResults ({ token }) {
  // Don't do anything unless we're logged in
  if (!token) {
    return null;
  }

  const { sessionid } = useParams();
  const [session, setSession] = useState(null);
  const [results, setResults] = useState(null);

  async function fetchResults () {
    if (!session) {
      return;
    }

    const response = await fetch(`http://localhost:5005/admin/session/${sessionid}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setResults(data);
  }

  async function fetchSession () {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionid}/status`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setSession(data);
  }

  useEffect(fetchSession, [sessionid, token]);
  useEffect(fetchResults, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  if (session.results.active) {
    return (
    <div>
      <Space direction='horizontal'>
        <Button type='primary'>
          Advance
        </Button>

        <Button danger type='primary'>
          Stop
        </Button>
      </Space>
    </div>);
  } else {
    console.log(results);

    return (
    <div>
        NOT ACTIVE
    </div>
    );
  }
}

export default GameResults;
