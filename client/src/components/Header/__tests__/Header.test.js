import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from '../Header'

test('header test1', () => {
    render(
        <Router>
            <Header />
        </Router>)
    const home = screen.getByTestId('home')
    expect(home).toBeInTheDocument()
    expect(home).toHaveTextContent('Home')
})