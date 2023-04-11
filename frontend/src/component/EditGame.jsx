// EditGame.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, message } from 'antd';

function EditGame ({ token }) {
  const { gameid } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function fetchQuiz () {
      const response = await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setQuiz(data);
      setImageUrl(data.thumbnail);
    }

    fetchQuiz();
  }, [gameid, token]);

  async function updateQuiz () {
    await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...quiz,
        thumbnail: imageUrl,
      }),
    });

    message.success('Quiz updated successfully!');
  }

  async function deleteQuiz () {
    await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    message.success('Quiz deleted successfully!');
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Game: {quiz.name}</h1>
      <Input
        value={quiz.name}
        onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
      />
      <br />
      <br />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageUrl && (
        <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%' }} />
      )}
      <br />
      <br />
      <Button onClick={updateQuiz}>Update Quiz</Button>
      <Button onClick={deleteQuiz} style={{ marginLeft: '8px' }}>
        Delete Quiz
      </Button>
    </div>
  );
}

export default EditGame;
