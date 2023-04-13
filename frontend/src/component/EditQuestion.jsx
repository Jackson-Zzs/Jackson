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

    // 处理原始数据用的
    const options = updatedQuestionData.options.map((option, index) => ({
      text: option.text,
      correct: index === updatedQuestionData.correctIndex
    }));
    // const correctIndex = updatedQuestionData.correctIndex;

    // 到这里结束

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
              correctIndex: question.correctIndex,
            }}
        >
        <Form.Item
          label="Question"
          name="question"
          rules={[{ required: true, message: 'Please input the question!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select the question type!' }]}
        >
          <Select>
            <Option value="single">Single Choice</Option>
            <Option value="multiple">Multiple Choice</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Time Limit (seconds)"
          name="time"
          rules={[{ required: true, message: 'Please input the time limit!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: 'Please input the points for this question!' }]}
        >
            <InputNumber min={1} />
        </Form.Item>

        <Form.Item label="URL (optional)" name="url">
            <Input />
        </Form.Item>
        <h2>Answers</h2>
        <Form.List
          name="options"
          initialValue={question.options.map((option) => ({ text: option }))}
        >
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
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={`correct-${index}`}
                    initialValue={index === question.correctIndex}
                    valuePropName="checked"
                    noStyle
                    rules={[
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            throw new Error('Please choose a correct option!');
                          }
                        },
                      },
                    ]}
                    >

                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          questionForm.setFieldsValue({ correctIndex: index });
                        }
                      }}
                      checked={index === questionForm.getFieldValue('correctIndex')}
                    >
                      Correct
                    </Checkbox>
                  </Form.Item>
                </div>
              ))}
            </>
          )}
        </Form.List>

        <Button type="primary" onClick={updateQuestion}>
            Update Question
        </Button>
        </Form>
    </div>
  );
}

export default EditQuestion;
