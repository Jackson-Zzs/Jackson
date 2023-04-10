import React from 'react';

function Dashboard ({ token }) {
  const [newGameShow, setNewGameShow] = React.useState(false);
  const [quizzes, setQuizzes] = React.useState([]);
  const [newQuizName, setNewQuizGame] = React.useState('');

  React.useEffect(async () => {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer: ${token}`,
      }
    })
    const data = await response.json();
    setQuizzes(data.quizzes);
  }, [])

  async function createNewGame () {
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
      body: JSON.stringify({
        name: newQuizName,
      })
    });
  }
  console.log(quizzes);
  return <>
    Dashboard game list....
    {quizzes.map(quiz => (
      <>
        <b>{quiz.name}</b><br />
      </>
    ))}
    <br /><hr /><br />
    <button onClick={() => setNewGameShow(!newGameShow)}>
      {newGameShow ? 'Hide' : 'Show'}Create new Game
    </button>
    {newGameShow && (
      <>
        <br />
        Form here for new games! <br />
        Name: <input value={newQuizName} onChange={(e) => setNewQuizGame(e.target.value)}/><br />
        <button onClick={createNewGame}>Create new game</button>
      </>
    )}
  </>;
}
export default Dashboard;
