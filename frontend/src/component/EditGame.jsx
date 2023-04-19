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
      <Input aria-label="quiz name"
        value={quiz.name}
        onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
      />
      <br />
      <h4>Update Thumbnail</h4>
      <input aria-label="quiz thumbnail" type="file" accept="image/*" onChange={handleImageChange} />
      <div>
      {imageUrl && (
        <img src={imageUrl} alt="preview" style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
      )}
      </div>
      <br />
      <br />
      <h2>Questions</h2>
      {quiz.questions && quiz.questions.map((question, index) => (
        <div key={index} aria-label={`question ${index + 1}`} style={{ marginBottom: '16px' }}>
          <p aria-label={`text ${index + 1}`}>
            {index + 1}. {question.question}
          </p>
          <p>
            {question.url && (
              <>
                Related Link:{' '}
                <a aria-label={`url ${index + 1}`}
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

          <ul aria-label={`question ${index + 1} options`}>
            {question.options.map((option, i) => (
              <li aria-label={`question ${index + 1} option ${i + 1}`} key={i}>{option.text}</li>
            ))}
          </ul>
          <Button aria-label={`edit question ${index + 1} button`}
            onClick={() => {
              console.log(question);
              navigate(`/editquestion/game/${gameid}/question/${question.id}`);
            }}
            style={{ backgroundColor: '#E9F6EF', color: 'black' }}
          >
            Edit Question
          </Button>
          <Button aria-label={`delete question ${index + 1} button`}
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
            danger
          >
            Delete Question
          </Button>
        </div>
      ))}

      <Button aria-label="add question button"
        onClick={() => {
          setAddQuestionModalVisible(true);
        }}
        style={{ backgroundColor: '#1677ff', color: 'white' }}
      >
        Add Question
      </Button>
      <br /><br />
      <Button aria-label="update quiz button"
        onClick={updateQuiz}
        style={{ backgroundColor: '#1677ff', color: 'white' }}
        >Update Quiz</Button>
      <Button aria-label="dashboard button"
        onClick={() => navigate('/dashboard')}
        style={{ marginLeft: '10px', backgroundColor: '#1677ff', color: 'white' }}
        >Back to Dashboard</Button>
      <Modal
        title="Add Question"
        open={addQuestionModalVisible}
        onCancel={() => setAddQuestionModalVisible(false)}
        footer={[
          <Button aria-label="cancel editing question button" key="cancel" onClick={() => setAddQuestionModalVisible(false)}>
            Cancel
          </Button>,
          <Button aria-label="submit question button" key="submit" type="primary" onClick={addQuestion}>
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
            <Input name="question" aria-label="question"/>
          </Form.Item>
          <Form.Item
            label="Option 1"
            name="option1"
            rules={[{ required: true, message: 'Please input the first option!' }]}
          >
            <Input name="option1" aria-label="option1"/>
          </Form.Item>
          <Form.Item
            label="Option 2"
            name="option2"
            rules={[{ required: true, message: 'Please input the second option!' }]}
          >
            <Input name="option2" aria-label="option2"/>
          </Form.Item>
          <Form.Item label="Option 3" name="option3">
            <Input name="option3" aria-label="option3"/>
          </Form.Item>
          <Form.Item label="Option 4" name="option4">
            <Input name="option4" aria-label="option4"/>
          </Form.Item>
          <Form.Item label="Option 5" name="option5">
            <Input name="option5" aria-label="option5"/>
          </Form.Item>
          <Form.Item label="Option 6" name="option6">
            <Input name="option6" aria-label="option6"/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditGame;
