import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddAd from '../AddAd'
import userEvent from '@testing-library/user-event';

test('checks if we are authorized', () => {
    render(
        <Router>
            <AddAd />
        </Router>)
    const non_auth = screen.getByTestId('not-auth')
    expect(non_auth).toBeInTheDocument()
    expect(non_auth).toHaveTextContent('You are not authorized')
})

test('checks that we are authorized', () => {
    localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
    render(
        <Router>
            <AddAd />
        </Router>)
    const submit = screen.getByTestId('add-ad-submit')
    expect(submit).toBeInTheDocument()
})

test('checks that we add ad', () => {
    localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
    render(
        <Router>
            <AddAd />
        </Router>)
    const submit = screen.getByTestId('add-ad-submit')
    const textarea = screen.getByTestId('textarea')
    const place_id = screen.getByTestId('place_id')
    fireEvent.change(textarea, {value: "Ad created from test"})
    fireEvent.change(place_id, {value: 1})
    submit.click()
})