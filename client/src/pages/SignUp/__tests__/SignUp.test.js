// import { render, screen, cleanup } from '@testing-library/react'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import SignUp from '../SignUp'

// test('signup test1', () => {
//     render(
//         <Router>
//             <SignUp />
//         </Router>)
//     const submit = screen.getByTestId("signup-submit")
//     expect(submit).toBeInTheDocument()
//     expect(submit).toHaveTextContent('Submit')
//     expect(submit).toHaveClass('btn submit sign-in-submit disabled')
// })

// test('checks if the error appeared after focusing', async () => {
//     render(
//         <Router>
//             <SignUp />
//         </Router>)
//     const username_input = screen.getByTestId('signup-username')
//     const password_input = screen.getByTestId('signup-password')
//     const email_input = screen.getByTestId('signup-email')
//     const place_id_input = screen.getByTestId('signup-place-id')

//     username_input.focus()
//     password_input.focus()
//     email_input.focus()
//     place_id_input.focus()

//     setTimeout(() => {
//         const username_error = screen.getByTestId('username-error')
//         const password_error = screen.getByTestId('password-error')
//         const email_error = screen.get('email-error')
//         const place_id_error = screen.get('place-id-error')
//         expect(username_error).toBeInTheDocument()
//         expect(password_error).toBeInTheDocument()
//         expect(email_error).toBeInTheDocument()
//         expect(place_id_error).toBeInTheDocument()
//     }, 10)    
// })

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignUp from '../SignUp';

describe('SignUp component', () => {
  it('should display error message if email is invalid', () => {
    const { getByTestId, getByText } = render(<SignUp />);
    const emailInput = getByTestId('signup-email');
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    expect(getByText('You typed the wrong email')).toBeInTheDocument();
  });

  it('should disable the submit button if any field is empty or invalid', () => {
    const { getByTestId } = render(<SignUp />);
    const emailInput = getByTestId('signup-email');
    const usernameInput = getByTestId('signup-username');
    const passwordInput = getByTestId('signup-password');
    const placeIdInput = getByTestId('signup-place-id');
    const submitButton = getByTestId('signup-submit');

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(usernameInput, { target: { value: 'user' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(placeIdInput, { target: { value: '1' } });
    setTimeout(() => {
        expect(submitButton).not.toBeDisabled();
    }, 10)
  });

  it('should submit the form data when the submit button is clicked', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ 
            id: 1, 
            username: 'user',
            place_id: 1,
            is_superuser: false,
            password: 'password'
        }),
        status: 201
      })
    );

    const { getByTestId } = render(<SignUp />);
    const emailInput = getByTestId('signup-email');
    const usernameInput = getByTestId('signup-username');
    const passwordInput = getByTestId('signup-password');
    const placeIdInput = getByTestId('signup-place-id');
    const submitButton = getByTestId('signup-submit');

    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } });
    fireEvent.change(usernameInput, { target: { value: 'user' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(placeIdInput, { target: { value: 1 } });
    fireEvent.click(submitButton);

    
  });

  it('should send the form data on submit', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ 
          id: 1, 
          username: 'user',
          place_id: 1,
          is_superuser: false,
          password: 'password'
        }),
        status: 201
      })
    );
    global.fetch = mockFetch;
    const { getByTestId } = render(<SignUp />);
    const email = getByTestId('signup-email')
    const username = getByTestId('signup-username')
    const place_id = getByTestId('signup-place-id')
    const password = getByTestId('signup-password')
    const submit = getByTestId('signup-submit')
    fireEvent.input(email, { target: { value: 'valid-email@example.com' } });
    fireEvent.input(username, { target: { value: 'valid-username' } });
    fireEvent.input(password, { target: { value: 'valid-password' } });
    fireEvent.input(place_id, { target: { value: 123 } });
    fireEvent.click(submit)

    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:5000/user', {
      method: 'POST',
      body: JSON.stringify({
        username: 'valid-username',
        password: 'valid-password',
        email: 'valid-email@example.com',
        place_id: 123,
        is_superuser: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });



});
