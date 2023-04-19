import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Checkbox, Radio, Button, Table } from 'antd';

function Game () {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);

  const [ended, setEnded] = useState(false);
  const [results, setResults] = useState(null);

  const [answered, setAnswered] = useState(false);

  const [answerIds, setAnswerIds] = useState([]);

  const [timeleft, setTimeleft] = useState(0);

  const playerId = sessionStorage.getItem('player');
  if (!playerId) {
    navigate('/play');

    return <div/>;
  }

  async function getStatus () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok && data.error.includes('active')) {
      setStarted(true);
      setEnded(true);
      return;
    }

    setStarted(data.started);
  }

  async function getQuestion () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/question`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok && data.error.includes('active')) {
      setEnded(true);
      return;
    }

    if (!question || data.question.id !== question.id) {
      setAnswerIds([]);
      setAnswered(false);
      setQuestion(data.question);
    }
  }

  async function getAnswers () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'GET',
    });

    const data = await response.json();
    if (!response.ok && data.error.includes('not been completed')) {
      setAnswers(null);
      return;
    }

    setAnswers(data.answerIds);
  }

  async function getResults () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/results`, {
      method: 'GET',
    });

    const data = await response.json();
    setResults(data);
  }

  async function submitAnswers () {
    setAnswered(true);

    await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds
      }),
    });
  }

  async function poll () {
    if (!started) {
      await getStatus();
    } else if (!ended) {
      await Promise.all([getQuestion(), getAnswers()]);

      if (question) {
        const questionStarted = Date.parse(question.isoTimeLastQuestionStarted);

        const timeLeftMS = questionStarted + question.time * 1000 - (new Date()).getTime();

        setTimeleft(Math.floor(timeLeftMS / 1000));
      }
    } else {
      await getResults();
    }
  }

  // Setup polling
  useEffect(() => {
    if (results) {
      return;
    }

    poll();
    const interval = setInterval(poll, 100);
    return () => clearInterval(interval);
  }, [playerId, started, ended, question, answers, results]);

  if (!started) {
    return <div>Waiting for game to start...</div>;
  }

  if (ended) {
    if (!results) {
      return <div>Loading results...</div>;
    }

    const tableData = results.map((q, index) => {
      return {
        key: index,
        num: index,
        correct: q.correct.toString()
      }
    })

    const columns = [
      {
        title: 'Question Number',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: 'Correct',
        dataIndex: 'correct',
        key: 'correct'
      }
    ]

    return <>
      <p aria-label="points explanation">Points are calculated as <code>min(maxPoints, maxPoints * (maxTime / timeTaken - 1) / 9)</code></p>
      <Table aria-label="question performance" dataSource={tableData} columns={columns} />
    </>;
  }

  if (!question) {
    return <div>Loading question...</div>;
  }

  const disallowAnswers = answered || !!answers;
  const multipleChoice = question.type.includes('multiple');

  const answerValue = answers || answerIds;

  const options = question.options.map((text, i) => {
    return { label: text, value: i };
  });

  let answerGroup;
  if (multipleChoice) {
    answerGroup = <Form.Item>
                    <Checkbox.Group options={options} value={answerValue} onChange={setAnswerIds} disabled={disallowAnswers} />
                  </Form.Item>;
  } else {
    const radioVal = answerValue.length === 0 ? null : answerValue[0];
    answerGroup = <Form.Item>
                    <Radio.Group options={options} value={radioVal} onChange={({ target: { value } }) => setAnswerIds([value])} disabled={disallowAnswers} />
                  </Form.Item>;
  }

  const timeleftText = answers ? 'Answer:' : `${timeleft} seconds left`;

  const getYoutubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }

  const getEmbed = () => {
    if (question.url) {
      const youtubeID = getYoutubeID(question.url);
      if (youtubeID) {
        return <iframe
        aria-label="question video"
        src={`http://www.youtube.com/embed/${youtubeID}`}
        sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
        title='Youtube Player'
        />
      } else {
        return <img aria-label="question image" src={question.url}/>
      }
    }

    return null;
  }

  return (
    <div>
      {getEmbed()}
      <br/>
      <p aria-label="question text">{question.question}</p>
      <br/>
      <p aria-label="time left">{timeleftText}</p>
      <Form>
        {answerGroup}
        <Form.Item>
          <Button aria-label="submit button" onClick={submitAnswers} disabled={disallowAnswers}>Submit</Button>
        </Form.Item>
      </Form>
  </div>
  )
}

export default Game;
