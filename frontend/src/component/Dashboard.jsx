import React from 'react';
import { Button, Card, Input, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

function Dashboard ({ token }) {
  console.log(token);

  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizName] = React.useState('');
  const navigate = useNavigate();

  async function fetchAllQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setQuizzes(data.quizzes);
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

  async function editGame (id) {
    // Implement the navigation or functionality to edit the game
    navigate(`/editgame/${id}`);
  }

  React.useEffect(() => {
    fetchAllQuizzes();
  }, [newGameShow]);

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
                extra={
                  <>
                    <Button onClick={() => editGame(quiz.id)}>Edit</Button>
                    <Button
                      onClick={() => deleteGame(quiz.id)}
                      style={{ marginLeft: '8px' }}
                    >
                      Delete
                    </Button>
                  </>
                }
              >
                <img src={quiz.thumbnail} alt="Thumbnail" style={{ maxWidth: '100%' }} />
                <p>Questions: {quiz.questions}</p>
                <p>ID: {quiz.id}</p>
              </Card>
            </Col>
          ))}
      </Row>

    </>
  );
}

export default Dashboard;
