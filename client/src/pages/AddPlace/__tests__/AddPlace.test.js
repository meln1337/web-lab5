import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddPlace from '../AddPlace'

afterEach(cleanup)

test('checks if we are authorized', () => {
    render(
        <Router>
            <AddPlace />
        </Router>)
    const non_auth = screen.getByTestId('non-auth')
    expect(non_auth).toBeInTheDocument()
    expect(non_auth).toHaveTextContent('You are not authorized')
})

test('checks that we are authorized', () => {
    localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
    render(
        <Router>
            <AddPlace />
        </Router>)
    const submit = screen.getByTestId('add-place-submit')
    expect(submit).toBeInTheDocument()
})

test('checks that we add place', () => {
    localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
    render(
        <Router>
            <AddPlace />
        </Router>)
    const submit = screen.getByTestId('add-place-submit')
    const name = screen.getByTestId('add-place')
    fireEvent.change(name, {value: "Dnipro"})
    submit.click()
})