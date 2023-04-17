// GameResults.jsx
import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { useParams } from 'react-router-dom';

import {
  CategoryScale,
  Chart,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function GameResults ({ token }) {
  // Don't do anything unless we're logged in
  if (!token) {
    return null;
  }

  const { sessionid } = useParams();
  const [session, setSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);

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

  async function fetchQuiz () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    const sessionIdNum = parseInt(sessionid);
    const candidates = data.quizzes.filter(testQuiz => testQuiz.active === sessionIdNum || testQuiz.oldSessions.includes(sessionIdNum));

    if (candidates.length <= 0) {
      setQuiz(null);
      return;
    }

    const quizResponse = await fetch(`http://localhost:5005/admin/quiz/${candidates[0].id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const quizData = await quizResponse.json();

    const fullQuiz = { ...quizData, id: candidates[0].id }
    setQuiz(fullQuiz);
  }

  const getScore = (maxPoints, maxTime, timeTaken) => {
    // First 10% = max points, then exponential-ish decay until 0 at timeTaken
    return Math.min(maxPoints, maxPoints * (maxTime / timeTaken - 1) / 9);
  }

  const calculateScores = () => {
    /*
      Sorted by score
      percentage per question
      average time per question
    */

    const numQuestions = quiz.questions.length;

    const userScores = new Map();
    const numCorrect = new Array(numQuestions).fill(0);
    const totalTime = new Array(numQuestions).fill(0);
    const numAnswers = new Array(numQuestions).fill(0);

    results.results.forEach((user) => {
      let totalScore = 0;

      user.answers.forEach((answer, index) => {
        const startTime = Date.parse(answer.questionStartedAt);
        const answerTime = Date.parse(answer.answeredAt);

        const timeTaken = answerTime - startTime;

        totalTime[index] += timeTaken;

        if (answer.correct) {
          const curQuestion = quiz.questions[index];
          totalScore += getScore(curQuestion.points, curQuestion.time * 1000, timeTaken);

          numCorrect[index]++;
        }

        numAnswers[index]++;
      });

      userScores.set(user.name, totalScore);
    });

    const percentages = numCorrect.map((num, index) => {
      if (numAnswers[index] === 0) {
        return 1.0;
      }

      return num / numAnswers[index];
    });
    const averageTime = totalTime.map((time, index) => {
      if (numAnswers[index] === 0) {
        return 0.0;
      }

      return time / (numAnswers[index] * 1000);
    });

    return {
      userScores,
      percentages,
      averageTime,
    };
  }

  async function fetchResults () {
    // Leave if results aren't valid
    if (!session || session.results.active) {
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

  async function advanceSession () {
    await fetch(`http://localhost:5005/admin/quiz/${quiz.id}/advance`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    fetchSession();
  }

  async function endSession () {
    await fetch(`http://localhost:5005/admin/quiz/${quiz.id}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    fetchSession();
  }

  useEffect(() => {
    fetchSession();
    fetchQuiz();
  }, [sessionid, token]);
  useEffect(fetchResults, [session]);

  if (!session || !quiz) {
    return <div>Loading...</div>;
  }

  if (session.results.active) {
    return (
    <div>
      <Space direction='horizontal' onClick={advanceSession}>
        <Button type='primary'>
          Advance ({session.results.position})
        </Button>

        <Button danger type='primary' onClick={endSession}>
          Stop
        </Button>
      </Space>
    </div>);
  } else {
    if (!results) {
      return <div>Loading results...</div>;
    }

    const scoreData = calculateScores();
    console.log(scoreData);

    const options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: `Game results - ${quiz.name}`,
        },
      },
      scales: {
        perc: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0.0,
          max: 1.0,
        },
        time: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          min: 0.0,
        },
      },
    };

    const labels = Array.from({ length: scoreData.percentages.length }, (_, i) => `Question ${i + 1}`);

    const data = {
      labels,
      datasets: [
        {
          label: 'Percentages',
          data: scoreData.percentages,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'perc',
        },
        {
          label: 'Average Time',
          data: scoreData.averageTime,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'time',
        }
      ]
    };

    const userScores = Array.from(scoreData.userScores, ([username, score]) => ({ username, score }))
      .sort(({ username, score }) => score);

    const topUsers = userScores.slice(0, 5);

    const tableData = topUsers.map(({ username, score }, index) => {
      return {
        key: index,
        username,
        score
      }
    })

    const columns = [
      {
        title: 'Name',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
      }
    ]

    return (
    <div>
        Points are calculated as <code>min(maxPoints, maxPoints * (maxTime / timeTaken - 1) / 9)</code>
        <Bar options={options} data={data} />
        <Table dataSource={tableData} columns={columns} />
    </div>
    );
  }
}

export default GameResults;
