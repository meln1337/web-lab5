import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from '../Users'

test('checks if the users are loaded', () => {
    render(
        <Router>
            <Users />
        </Router>)
    setTimeout(() => {
        const user = screen.getByTestId('user-1')
        expect(user).toBeInTheDocument()
    }, 1000)
})