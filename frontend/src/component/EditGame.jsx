// EditGame.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, message, Modal, Form } from 'antd';

function EditGame ({ token }) {
  const { gameid } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
  const [questionForm] = Form.useForm();
  const navigate = useNavigate();

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

  async function addQuestion () {
    const questionData = questionForm.getFieldsValue();
    const options = [
      { text: questionData.option1, correct: false },
      { text: questionData.option2, correct: false },
      { text: questionData.option3, correct: false },
      { text: questionData.option4, correct: false },
      { text: questionData.option5, correct: false },
      { text: questionData.option6, correct: false },
    ].filter((option) => option.text);

    if (options.length < 2) {
      message.error('Please provide at least two options!');
      return;
    }

    const newQuestion = {
      id: Math.floor(Math.random() * 1000000),
      question: questionData.question,
      options,
      type: 'single choice',
      time: 10,
      points: 1,
      url: '',
    };

    const updatedQuestions = [...quiz.questions, newQuestion];

    await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...quiz,
        questions: updatedQuestions,
      }),
    });

    setQuiz({ ...quiz, questions: updatedQuestions });
    setAddQuestionModalVisible(false);
    questionForm.resetFields();
    message.success('Question added successfully!');
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
      <div>
      Update Image
      {imageUrl && (
        <img src={imageUrl} alt="preview" style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
      )}
      </div>
      <br />
      <br />
      <h2>Questions</h2>
      {quiz.questions && quiz.questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <p>
            {index + 1}. {question.question}
          </p>
          <p>
            {question.url && (
              <>
                Related Link:{' '}
                <a
                  href={
                    question.url.startsWith('http://') || question.url.startsWith('https://')
                      ? question.url
                      : 'http://' + question.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {question.url}
                </a>
              </>
            )}
          </p>

          <ul>
            {question.options.map((option, i) => (
              <li key={i}>{option.text}</li>
            ))}
          </ul>
          <Button
            onClick={() => {
              console.log(question);
              navigate(`/editquestion/game/${gameid}/question/${question.id}`);
            }}
          >
            Edit Question
          </Button>
          <Button
            onClick={async () => {
              const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
              await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
                method: 'PUT',
                headers: {
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...quiz,
                  questions: updatedQuestions,
                }),
              });

              setQuiz({ ...quiz, questions: updatedQuestions });
              message.success('Question deleted successfully!');
            }}
            style={{ marginLeft: '8px' }}
          >
            Delete
          </Button>
        </div>
      ))}

      <Button
        onClick={() => {
          setAddQuestionModalVisible(true);
        }}
        style={{ marginLeft: '20px' }}
      >
        Add Questions
      </Button>
      <br /><br />
      <Button onClick={updateQuiz}>Update Quiz</Button>
      <Button onClick={() => navigate('/dashboard')} style={{ marginLeft: '10px' }}>Back to Dashboard</Button>
      <Modal
        title="Add Question"
        open={addQuestionModalVisible}
        onCancel={() => setAddQuestionModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddQuestionModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={addQuestion}>
            Add Question
          </Button>,
        ]}
      >
        <Form form={questionForm}>
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Please input the question!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Option 1"
            name="option1"
            rules={[{ required: true, message: 'Please input the first option!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Option 2"
            name="option2"
            rules={[{ required: true, message: 'Please input the second option!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Option 3" name="option3">
            <Input />
          </Form.Item>
          <Form.Item label="Option 4" name="option4">
            <Input />
          </Form.Item>
          <Form.Item label="Option 5" name="option5">
            <Input />
          </Form.Item>
          <Form.Item label="Option 6" name="option6">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditGame;
