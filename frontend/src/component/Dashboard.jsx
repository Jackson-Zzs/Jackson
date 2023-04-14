import React from 'react';
import { Button, Card, Input, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

function Dashboard ({ token }) {
  // console.log(token);

  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');
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

  React.useEffect(() => {
    fetchAllQuizzes();
  }, [newGameShow, token]);

  function handleFileUploadClick (e, quizId) {
    e.preventDefault();
    fileInputRef.current.dataset.quizId = quizId;
    fileInputRef.current.click();
  }

  // console.log(quizzes);
  return (
    <>
      <h1>Dashboard</h1>
      <hr />
      <Button onClick={() => setNewGameShow(!newGameShow)}>
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
          <Button onClick={createNewGame}>Create new game</Button>
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
                    <Button onClick={() => editGame(quiz.id)}>Edit Game</Button>
                    <Button
                      onClick={() => deleteGame(quiz.id)}
                      style={{ marginLeft: '20px' }}
                    >
                      Delete
                    </Button>
                    <Button onClick={(e) => handleFileUploadClick(e, quiz.id)}>Edit Game with JSON file</Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".json"
                      onChange={handleFileUpload}
                    />
                  </>
                }
              </Card>
            </Col>
          ))}
      </Row>

    </>
  );
}

export default Dashboard;
