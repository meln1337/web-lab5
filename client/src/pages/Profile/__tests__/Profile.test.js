// import { render, screen, cleanup } from '@testing-library/react'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Profile from '../Profile'

// test('checks if we get text that we are not authorized', () => {
//     render(
//         <Router>
//             <Profile />
//         </Router>)
//     const non_auth = screen.getByTestId("non-auth")
//     expect(non_auth).toBeInTheDocument()
// })

// test('checks if we get authorized profile', () => {
//     localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
//     render(
//         <Router>
//             <Profile />
//         </Router>)
//     setTimeout(() => {
//         const submit = screen.getByTestId("profile-submit")
//         expect(submit).toBeInTheDocument()
//     }, 3000)
// })

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Profile from '../Profile';

describe('Profile component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          "email": "user@gmail.com",
          "id": 1,
          "is_superuser": false,
          "place_id": 1,
          "username": "user"
        })
      })
    );
    localStorage.setItem("Authorization", "token");
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders "You are not authorized" message if not authorized', async () => {
    localStorage.removeItem("Authorization");
    await act(async () => {
      render(<Profile />);
    });
    expect(screen.getByTestId("non-auth")).toBeInTheDocument();
  });

//   it('renders form if authorized', async () => {
//     await act(async () => {
//       render(<Profile />);
//     });
//     expect(screen.getByLabelText("Email address")).toBeInTheDocument();
//     expect(screen.getByLabelText("Username")).toBeInTheDocument();
//     expect(screen.getByLabelText("Role")).toBeInTheDocument();
//   });

//   it('updates email and username', async () => {
//     await act(async () => {
//       render(<Profile />);
//     });
//     const emailInput = screen.getByLabelText("Email address");
//     const usernameInput = screen.getByLabelText("Username");
//     fireEvent.change(emailInput, { target: { value: 'newuser@gmail.com' }});
//     fireEvent.change(usernameInput, { target: { value: 'newuser' }});
//     expect(emailInput.value).toBe('newuser@gmail.com');
//     expect(usernameInput.value).toBe('newuser');
//   });

  it('submits updates when Submit button is clicked', async () => {
    await act(async () => {
      render(<Profile />);
    });
    const submitButton = screen.getByTestId("profile-submit");
    fireEvent.click(submitButton);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('logs out when Logout button is clicked', async () => {
    await act(async () => {
      render(<Profile />);
    });
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(localStorage.getItem("Authorization")).toBeNull();
  });

  it('deletes user when Delete button is clicked', async () => {
    await act(async () => {
      render(<Profile />);
    });
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
