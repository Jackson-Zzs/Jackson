import React from 'react';
import { Button, Card, Dropdown, Input, Row, Col, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

function Dashboard ({ token }) {
  // console.log(token);

  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');
  const [toModalStart, setToModalStart] = React.useState(new Set());
  const [toModalEnd, setToModalEnd] = React.useState(new Set());

  // const [questions, setQuestions] = React.useState([])
  const navigate = useNavigate();
  const fileInputRef = React.createRef();

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const quizzesWithQuestionsCount = await Promise.all(
      data.quizzes.map(async (quiz) => {
        const questionsResponse = await fetch(
          `http://localhost:5005/admin/quiz/${quiz.id}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const questionsData = await questionsResponse.json();
        return { ...quiz, questionsCount: questionsData.questions.length };
      })
    );
    setQuizzes(quizzesWithQuestionsCount);
  }

  const findQuiz = (id) => {
    const filtered = quizzes.filter(quiz => quiz.id === id);

    if (filtered.length <= 0) {
      return null;
    }

    return filtered[0];
  }

  async function createNewGame () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      }),
    });
    await fetchAllQuizzes();
  }

  async function deleteGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    await fetchAllQuizzes();
  }

  async function updateQuizWithJson (quizId, jsonData) {
    // Replace the URL with your backend update URL
    await fetch(`http://localhost:5005/admin/quiz/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonData),
    });
    // Refresh the quizzes after updating
    await fetchAllQuizzes();
  }

  async function handleFileUpload (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          const quizId = fileInputRef.current.dataset.quizId;
          // Validate the data structure here
          await updateQuizWithJson(quizId, jsonData);
        } catch (error) {
          console.error('Error reading JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  async function editGame (id) {
    // Implement the navigation or functionality to edit the game
    navigate(`/editgame/${id}`);
  }

  async function startGame (id) {
    await fetch(`http://localhost:5005/admin/quiz/${id}/start`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchAllQuizzes();

    setToModalStart(new Set([...toModalStart, id]));
  }

  async function endGame (quiz) {
    await fetch(`http://localhost:5005/admin/quiz/${quiz.id}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchAllQuizzes();

    setToModalEnd(new Set([...toModalEnd, quiz.active]));
  }

  React.useEffect(() => {
    fetchAllQuizzes();
  }, [newGameShow, token]);

  function handleFileUploadClick (e, quizId) {
    e.preventDefault();
    fileInputRef.current.dataset.quizId = quizId;
    fileInputRef.current.click();
  }

  // console.log(quizzes);
  const copyToClipboard = async (text) => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
  }

  const handleActionClick = (key, quiz) => {
    switch (key) {
      case 'edit': {
        editGame(quiz.id);
        break;
      }
      case 'copy-link': {
        copyToClipboard(`${window.location.origin}/play/id/${quiz.active}`)
        break;
      }
      case 'goto-results': {
        navigate(`/results/${quiz.active}`);
        break;
      }
      case 'view-old-sessions': {
        navigate(`/previous/${quiz.id}`);
        break;
      }
      case 'delete': {
        deleteGame(quiz.id);
        break;
      }
    }
  }

  const generateGameActions = (quiz) => {
    const actions = [
      // {
      //   key: 'edit',
      //   label: 'Edit Game'
      // },
      {
        key: 'view-old-sessions',
        label: 'View Old Sessions'
      },
      // {
      //   key: 'Delete',
      //   label: 'Delete',
      //   danger: true
      // }
    ];

    if (quiz.active !== null) {
      actions.splice(2, 0, {
        key: 'copy-link',
        label: 'Copy Link'
      });

      actions.splice(3, 0, {
        key: 'goto-results',
        label: 'Controls and Results'
      });
    }

    return actions;
  }

  const startModals = [...toModalStart].map((quizId) => {
    const quiz = findQuiz(quizId);

    const onClose = () => {
      toModalStart.delete(quizId);
      setToModalStart(new Set(toModalStart));
    }

    return (
      <Modal key={quizId}
        title={`${quiz.name} session created at: ${quiz.active}`}
        open={toModalStart.has(quizId)}
        onOk={onClose}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
      </Modal>
    );
  });

  const endModals = [...toModalEnd].map((sessionId) => {
    const onClose = () => {
      toModalEnd.delete(sessionId);
      setToModalEnd(new Set(toModalEnd));
    }

    return (
      <Modal key={sessionId}
        title={`${sessionId} ended`}
        open={toModalEnd.has(sessionId)}
        okText={'Yes'}
        onOk={() => {
          onClose();

          navigate(`/results/${sessionId}`);
        }}
        cancelText={'No'}
        onCancel={onClose}
      >
        Would you like to view the results?
      </Modal>
    );
  });

  return (
    <>
      <h1>Welcome to Dashboard</h1>
      <hr />
      <Button
        onClick={() => setNewGameShow(!newGameShow)}
        style={{ backgroundColor: '#1677ff', color: 'white' }}
        >
        {newGameShow ? 'Wanna Hide Creating' : 'Wanna Create'} New Game
      </Button>
      {newGameShow && (
        <>
          <br />
          <br />
          Please enter the new game name
          <br />
          <Input
            placeholder="Name"
            value={newQuizName}
            onChange={(e) => setNewQuizName(e.target.value)}
            style={{ width: '300px' }}
          />
          <br />
          <br />
          <Button
            onClick={createNewGame}
            style={{ backgroundColor: '#1677ff', color: 'white' }}
            >Create new game</Button>
        </>
      )}
      <br />
      <hr />
      <br />
      <Row gutter={[16, 16]}>
        {quizzes &&
          quizzes.map((quiz) => (
            <Col key={quiz.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={quiz.name}
              >
                <img src={quiz.thumbnail} alt="Please update Thumbnail" style={{ maxWidth: '100%' }} />
                <p>Questions Number: {quiz.questionsCount}</p>
                <p>ID: {quiz.id}</p>
                {
                  <>
                    <Button
                      onClick={() => editGame(quiz.id)}
                      style={{ backgroundColor: '#E9F6EF', color: 'black' }}
                    >
                      Edit Game
                    </Button>
                    <Button
                      onClick={() => deleteGame(quiz.id)}
                      style={{ marginLeft: '20px' }}
                      danger
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={(e) => handleFileUploadClick(e, quiz.id)}
                      style={{ backgroundColor: '#E9F6EF', color: 'black' }}
                    >
                      Edit Game with JSON file
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".json"
                      onChange={handleFileUpload}
                    />
                  </>
                }
                {
                  <Space direction="horizontal">
                    <Dropdown.Button
                      onClick={() =>
                        quiz.active === null ? startGame(quiz.id) : endGame(quiz)
                      }
                      type="primary"
                      menu={{
                        items: generateGameActions(quiz),
                        onClick: (e) => handleActionClick(e.key, quiz),
                      }}
                    >
                      {quiz.active === null ? 'Start Game' : 'End Game'}
                    </Dropdown.Button>
                  </Space>
                }
              </Card>
            </Col>
          ))}
      </Row>
      {startModals}
      {endModals}
    </>
  );
}

export default Dashboard;
