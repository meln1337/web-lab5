import { render, screen, cleanup } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from '../Footer'

test('footer test1', () => {
    render(
        <Router>
            <Footer />
        </Router>)
    const footerLink = screen.getByTestId('footer-link')
    expect(footerLink).toBeInTheDocument()
    expect(footerLink).toHaveTextContent('Github')
})