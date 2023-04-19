import './utils/matchMedia';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoutesApp, globalLocation } from './App';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

const mockFetch = () => {
  const quizzes = [];

  const fetchJson = (input, init) => {
    const parsedBody = (init && init.body) ? JSON.parse(init.body) : {};

    switch (input) {
      case 'http://localhost:5005/admin/auth/register':
      case 'http://localhost:5005/admin/auth/login':
      {
        return [
          {
            token: 'REAL_TOKEN'
          },
          true
        ];
      }
      case 'http://localhost:5005/admin/quiz':
      {
        return [
          {
            quizzes
          },
          true
        ];
      }
      case 'http://localhost:5005/admin/quiz/new':
      {
        console.log('Adding new quiz ', parsedBody.name);

        const newQuiz = {
          name: parsedBody.name,
          id: quizzes.length,
          createdAt: '2020-10-31T14:45:21.077Z',
          thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
          owner: 'test@test',
          active: null,
          oldSessions: [
            4545546
          ],
          questions: [
          ]
        }

        quizzes.push(newQuiz);

        return [{}, true];
      }
      default:
      {
        const quizReg = /http:\/\/localhost:5005\/admin\/quiz\/(?<id>\d*)/;
        const quizMatch = input.match(quizReg);
        if (quizMatch.groups) {
          if (init.method === 'DELETE') {
            quizzes.delete(parseInt(quizMatch.groups.id));

            return [{}, true];
          } else {
            const foundQuiz = quizzes[parseInt(quizMatch.groups.id)];

            return [
              foundQuiz,
              true
            ];
          }
        }

        const startReg = /http:\/\/localhost:5005\/admin\/quiz\/(?<id>\d*)\/start/;
        const startMatch = input.match(startReg);
        if (startMatch.groups) {
          const modifiedQuiz = quizzes[parseInt(startMatch.groups.id)];
          modifiedQuiz.active = 1;
          quizzes[parseInt(startMatch.groups.id)] = modifiedQuiz;

          console.log(quizzes);

          return [{}, true]
        }

        const endReg = /http:\/\/localhost:5005\/admin\/quiz\/(?<id>\d*)\/end/;
        const endMatch = input.match(endReg);
        if (endMatch.groups) {
          const modifiedQuiz = quizzes[parseInt(startMatch.groups.id)];
          modifiedQuiz.active = null;
          quizzes[parseInt(startMatch.groups.id)] = modifiedQuiz;

          return [{}, true]
        }

        if (input.endsWith('status')) {
          return [
            {
              results: {
                active: false,
                answerAvailable: false,
                isoTimeLastQuestionStarted: '2020-10-31T14:45:21.077Z',
                position: 2,
                questions: [
                  {}
                ],
                numQuestions: 1,
                players: [
                  'No one'
                ]
              }
            },
            true
          ]
        }

        if (input.endsWith('results')) {
          return [
            [
              {
                name: 'Hayden Smith',
                answers: [
                  {
                    answerIds: [
                      56513315
                    ],
                    correct: false,
                    answeredAt: '2020-10-31T14:45:21.077Z',
                    questionStartedAt: '2020-10-31T14:45:21.077Z'
                  }
                ]
              }
            ],
            true
          ]
        }

        throw new Error(`Unsupported fetch mock URL ${input}`);
      }
    }
  }

  const mockedFetch = jest.fn(async (input, init) => {
    const [json, ok] = fetchJson(input, init);
    return {
      ok,
      json: async () => {
        return json;
      }
    };
  });

  const fetchMockCleanup = () => {
    quizzes.clear();
  }

  return [mockedFetch, fetchMockCleanup];
}

describe('App', () => {
  // This is a LONG test. 30 seconds allocated
  it('performs the happy path', async () => {
    const [mockedFetch,] = mockFetch();
    global.fetch = mockedFetch;

    render(
    <MemoryRouter>
      <RoutesApp />
    </MemoryRouter>);

    // Welcome page
    {
      const registerButton = screen.getByRole('button', { name: /register button/i });
      expect(registerButton).toBeInTheDocument();

      userEvent.click(registerButton);

      expect(globalLocation.pathname).toEqual('/register');
    }

    // Register page
    {
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const nameInput = screen.getByLabelText(/Name/i);
      const registerButton = screen.getByRole('button', {
        name: /register button/i
      });

      userEvent.type(emailInput, 'validemail@validemail.com');
      userEvent.type(passwordInput, 'rightpassword');
      userEvent.type(nameInput, 'Areal Person');

      userEvent.click(registerButton);

      await waitFor(() => expect(globalLocation.pathname).toEqual('/login'));
    }

    // Login page
    {
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', {
        name: /login button/i
      });

      userEvent.type(emailInput, 'validemail@validemail.com');
      userEvent.type(passwordInput, 'rightpassword');

      userEvent.click(loginButton);

      await waitFor(() => expect(globalLocation.pathname).toEqual('/dashboard'));
    }

    // Dashboard page
    {
      const createButton = screen.getByRole('button', {
        name: /create button/i
      });

      // Open new game form
      userEvent.click(createButton);

      const gameTitle = screen.getByRole('textbox', {
        name: /game name/i
      });

      const createGameButton = screen.getByRole('button', {
        name: /create game button/i
      });

      userEvent.type(gameTitle, 'Testing New Game');
      userEvent.click(createGameButton);

      await waitFor(() => {
        // Has to be done this way because antd hides aria-label for the specific button behind a function
        const startGameButton = screen.getByLabelText(/testing new game start stop button/i,).children[0];

        expect(startGameButton).toBeInTheDocument();

        userEvent.click(startGameButton);
      });

      await waitFor(() => {
        const closeStartButton = screen.getByRole('button', {
          name: /close modal button/i
        });

        expect(closeStartButton).toBeInTheDocument();

        userEvent.click(closeStartButton);
      });

      await waitFor(() => {
        const endGameButton = screen.getByLabelText(/testing new game start stop button/i,).children[0];

        expect(endGameButton).toBeInTheDocument();

        userEvent.click(endGameButton);
      });

      await waitFor(() => {
        const viewResultsButton = screen.getByRole('button', {
          name: /view results modal button/i
        });

        expect(viewResultsButton).toBeInTheDocument();

        userEvent.click(viewResultsButton);
      });

      await waitFor(() => expect(globalLocation.pathname).toEqual('/results/1'));
    }

    // Results page
    {
      const pointsExplanation = screen.getByLabelText(/points explanation/i);
      expect(pointsExplanation).toBeInTheDocument();

      const resultsGraph = screen.getByLabelText(/results graph/i);
      expect(resultsGraph).toBeInTheDocument();

      const topPlayers = screen.getByLabelText(/top players/i);
      expect(topPlayers).toBeInTheDocument();

      const logOutButton = screen.getByRole('button', {
        name: /log out button/i
      });

      userEvent.click(logOutButton);

      await waitFor(() => expect(globalLocation.pathname).toEqual('/login'));
    }

    // Login page
    {
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', {
        name: /login button/i
      });

      userEvent.type(emailInput, 'validemail@validemail.com');
      userEvent.type(passwordInput, 'rightpassword');

      userEvent.click(loginButton);

      await waitFor(() => expect(globalLocation.pathname).toEqual('/dashboard'));
    }
  }, 30000);
})
