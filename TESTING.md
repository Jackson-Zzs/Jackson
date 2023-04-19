In our testing, we used Jest and React Testing Library to test our programme.
We define mockAlert functions that mock the browser's alert function.
Define mock success callback functions (onSuccessMock).
Create a memory router using createMemoryRouter and configure the corresponding routes.
Use the render function to render the RouterProvider and pass the created router to it.
Test whether every forms is rendered correctly.
Use the APIs provided by @testing-library/react (such as screen.getByRole, screen.getByLabelText, etc.) to find and manipulate DOM elements. 
Use the @testing-library/user-event library to simulate user events, such as clicking buttons, entering text....