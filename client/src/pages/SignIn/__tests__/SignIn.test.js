// import { render, screen, fireEvent } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import SignIn from '../SignIn'

// test('checks if the button is disabled', () => {
    
//     render(
//         <Router>
//             <SignIn />
//         </Router>)
//     const submit = screen.getByTestId("signin-submit")
//     expect(submit).toBeInTheDocument()
//     expect(submit).toHaveTextContent('Submit')
//     expect(submit).toHaveClass('btn submit sign-in-submit disabled')
// })

// test('checks if the error appeared after focusing', async () => {
//     render(
//         <Router>
//             <SignIn />
//         </Router>)
//     const username_input = screen.getByTestId('signin-username')
//     const password_input = screen.getByTestId('signin-password')

//     username_input.focus()
//     password_input.focus()

//     setTimeout(() => {
//         const username_error = screen.getByTestId('username-error')
//         const password_error = screen.getByTestId('password-error')
//         expect(username_error).toBeInTheDocument()
//         expect(password_error).toBeInTheDocument()
//     }, 10)    
// })

// test('checks if the error appeared after username="", password=1234567', async () => {
//     render(
//         <Router>
//             <SignIn />
//         </Router>)
//     const username_input = screen.getByTestId('signin-username')
//     const password_input = screen.getByTestId('signin-password')

//     fireEvent.change(username_input, {value: "af"})
//     fireEvent.change(password_input, {value: "1234567"})

//     setTimeout(() => {
//         const password_error = screen.getByTestId('password-error')
//         expect(password_error).toBeInTheDocument()
//         expect(username_input).toBe("af")
//         expect(password_input).toBe("1234567")
//     }, 10)    
// })

// test('checks if the btn after filling the inputs turns undisable', () => {
//     render(
//         <Router>
//             <SignIn />
//         </Router>)
//     const username_input = screen.getByTestId('signin-username')
//     fireEvent.change(username_input, {value: "someuser"})
//     setTimeout(() => {
//         expect(username_input.value).toBe("someuser")
//     }, 10)
// })

// test('testing log in', () => {
//     render(
//         <Router>
//             <SignIn />
//         </Router>)
//     const username_input = screen.getByTestId('signin-username')
//     const password_input = screen.getByTestId('signin-password')
//     const submit = screen.getByTestId('signin-submit')
//     fireEvent.change(username_input, {value: "user"})
//     fireEvent.change(password_input, {value: "password"})
//     submit.click()
// })

import { render, fireEvent, screen } from '@testing-library/react';
import SignIn from '../SignIn';

test('renders username input', () => {
  render(<SignIn />);
  const usernameInput = screen.getByTestId('signin-username');
  expect(usernameInput).toBeInTheDocument();
});

test('renders password input', () => {
  render(<SignIn />);
  const passwordInput = screen.getByTestId('signin-password');
  expect(passwordInput).toBeInTheDocument();
});

test('renders submit button', () => {
  render(<SignIn />);
  const submitButton = screen.getByTestId('signin-submit');
  expect(submitButton).toBeInTheDocument();
});

test('disabled submit button when no username and password is entered', () => {
  render(<SignIn />);
  const submitButton = screen.getByTestId('signin-submit');
  expect(submitButton.disabled).toBeTruthy();
});

test('enables submit button when username and password is entered', () => {
  render(<SignIn />);
  const usernameInput = screen.getByTestId('signin-username');
  const passwordInput = screen.getByTestId('signin-password');
  const submitButton = screen.getByTestId('signin-submit');

  fireEvent.input(usernameInput, { target: { value: 'testuser' } });
  fireEvent.input(passwordInput, { target: { value: 'testpassword' } });

  expect(submitButton.disabled).toBeFalsy();
});

test('shows username error when username is not entered and input is focused', () => {
  render(<SignIn />);
  const usernameInput = screen.getByTestId('signin-username');

  fireEvent.focus(usernameInput);
  fireEvent.blur(usernameInput);

  const usernameError = screen.getByTestId('username-error');
  expect(usernameError).toBeInTheDocument();
});

test('hides username error when username is entered', () => {
  render(<SignIn />);
  const usernameInput = screen.getByTestId('signin-username');

  fireEvent.focus(usernameInput);
  fireEvent.blur(usernameInput);

  fireEvent.input(usernameInput, { target: { value: 'testuser' } });

  const usernameError = screen.queryByTestId('username-error');
  expect(usernameError).toBeNull();
});

test('shows password error when password length is less than 8 and input is focused', () => {
  render(<SignIn />);
  const passwordInput = screen.getByTestId('signin-password');

  fireEvent.focus(passwordInput);
  fireEvent.blur(passwordInput);

  const passwordError = screen.getByText('Password length must be greater than 7');
  expect(passwordError).toBeInTheDocument();
});

test('hides password error when password length is at least 8', () => {
  render(<SignIn />);
  const passwordInput = screen.getByTestId('signin-password');

  fireEvent.focus(passwordInput);
  fireEvent.blur(passwordInput);

  fireEvent.input(passwordInput, { target: { value: 'testpass' } });

  const passwordError = screen.queryByText('Password length must be greater than 7');
  expect(passwordError).toBeNull();
});

// Mock fetch function for testing sign_in
global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({ Authorization: 'test-token' }) }));
