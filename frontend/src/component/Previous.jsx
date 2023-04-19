// GameResults.jsx
import React, { useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

function Previous ({ token }) {
  // Don't do anything unless we're logged in
  if (!token) {
    return null;
  }

  const { gameid } = useParams();
  const [quiz, setQuiz] = useState(null);

  const navigate = useNavigate();

  async function fetchQuiz () {
    const quizResponse = await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const quizData = await quizResponse.json();

    const fullQuiz = { ...quizData, id: gameid }
    setQuiz(fullQuiz);
  }

  useEffect(() => {
    fetchQuiz();
  }, [gameid, token]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const oldSessions = quiz.oldSessions.map((sessionId) => {
    return <Space direction="horizontal" key={sessionId}>
        {sessionId}
        <Button aria-label={`session ${sessionId} results button`} onClick={() => navigate(`/results/${sessionId}`)}>View Results</Button>
    </Space>
  });

  return <Space direction="vertical">
    {oldSessions}
  </Space>
}

export default Previous;
