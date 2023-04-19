// EditQuestion.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, message, Form, Checkbox, Select, InputNumber } from 'antd';

const { Option } = Select;

function EditQuestion ({ token }) {
  const { gameid, questionid } = useParams();
  const [question, setQuestion] = useState(null);
  const [questionForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestion () {
      const response = await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const foundQuestion = data.questions.find((q) => q.id === parseInt(questionid));
      setQuestion(foundQuestion);
    }
    fetchQuestion();
  }, [gameid, questionid, token]);

  async function updateQuestion () {
    const updatedQuestionData = questionForm.getFieldsValue();

    // handle the options

    const options = updatedQuestionData.options.map((option) => ({
      text: option.text,
      correct: option.correct,
    }));

    // Replace old options with new options
    updatedQuestionData.options = options;

    // Fetch the current game data
    const gameResponse = await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const gameData = await gameResponse.json();

    // Find the question to update and replace it with the updated data
    const questionIndex = gameData.questions.findIndex((q) => q.id === parseInt(questionid));
    gameData.questions[questionIndex] = {
      id: question.id,
      ...updatedQuestionData,
    };

    // Update the game with the modified questions
    await fetch(`http://localhost:5005/admin/quiz/${gameid}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questions: gameData.questions,
        name: gameData.name,
        thumbnail: gameData.thumbnail,
      }),
    });

    message.success('Question updated successfully!');
    navigate(`/editgame/${gameid}`);
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  const correctIndex = question.options.findIndex((option) => option.correct);

  const handleCheckboxChange = (e, index) => {
    const questionType = questionForm.getFieldValue('type');
    if (questionType === 'single') {
      const newOptions = questionForm.getFieldValue('options').map((option, i) => {
        if (i === index) {
          return { ...option, correct: true };
        } else {
          return { ...option, correct: false };
        }
      });
      questionForm.setFieldsValue({ options: newOptions, correctIndex: index });
    } else {
      const newOptions = questionForm.getFieldValue('options').map((option, i) => {
        if (i === index) {
          return { ...option, correct: e.target.checked };
        } else {
          return option;
        }
      });
      questionForm.setFieldsValue({ options: newOptions });
    }
  };

  const handleTypeChange = (value) => {
    if (value === 'single') {
      const options = questionForm.getFieldValue('options');
      const newOptions = options.map((option, index) => {
        return { ...option, correct: index === 0 }; // set the first option as the correct answer
      });
      questionForm.setFieldsValue({ options: newOptions, correctIndex: 0 });
    }
  };

  return (
    <div>
        <h1>Edit Question</h1>
        <Form
            form={questionForm}
            initialValues={{
              question: question.question,
              type: question.type,
              time: question.time,
              points: question.points,
              url: question.url,
              options: question.options.map((option) => ({ text: option.text })),
              correctIndex,
            }}
        >
        <Form.Item
          label="Question"
          name="question"
          rules={[{ required: true, message: 'Please input the question!' }]}
        >
          <Input name="question" aria-label="question"/>
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select the question type!' }]}
        >
          <Select name="type" aria-label="type" onChange={handleTypeChange}>
            <Option value="single">Single Choice</Option>
            <Option value="multiple">Multiple Choice</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Time Limit (seconds)"
          name="time"
          rules={[{ required: true, message: 'Please input the time limit!' }]}
        >
          <InputNumber name="time" aria-label="time limit" min={1} />
        </Form.Item>

        <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: 'Please input the points for this question!' }]}
        >
            <InputNumber name="points" aria-label="points" min={1} />
        </Form.Item>

        <Form.Item label="URL (optional)" name="url">
            <Input name="url" aria-label="url"/>
        </Form.Item>
        <h2>Answers</h2>
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: '16px' }}>
                  <Form.Item
                    {...field}
                    label={`Option ${index + 1}`}
                    name={[field.name, 'text']}
                    fieldKey={[field.fieldKey, 'text']}
                    rules={[
                      { required: true, message: `Please input option ${index + 1}!` },
                    ]}
                  >
                    <Input name={[field.name, 'text']} aria-label={`question ${index + 1}`}/>
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'correct']}
                    valuePropName="checked"
                    initialValue={question.options[index].correct}
                    noStyle
                  >
                    <Checkbox onChange={(e) => handleCheckboxChange(e, index)} aria-label={`correct option ${index + 1}`}>
                    {/* <Checkbox> */}
                      Correct Option
                    </Checkbox>
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>

        <Button type="primary" onClick={updateQuestion} aria-label="update button">
            Update Question
        </Button>
        </Form>
    </div>
  );
}

export default EditQuestion;
