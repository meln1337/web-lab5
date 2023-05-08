import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from '../Home'
import { useEffect, useState } from "react";

test('checks that we get ads', () => {
    render(
        <Router>
            <Home />
        </Router>)
    
    setTimeout(() => {
        const ad = screen.getByTestId('ad')
        expect(ad).toBeInTheDocument()
    }, 3000)
})

test('checks that we get ads as logged in', () => {
    localStorage.setItem("Authorization", "Basic dXNlcjpwYXNzd29yZA==")
    render(
        <Router>
            <Home />
        </Router>)
    
    setTimeout(() => {
        const ad = screen.getByTestId('ad private-ad')
        expect(ad).toBeInTheDocument()
    }, 3000)
})

test('mocks ads', async () => {
	const mockFetch = jest.fn(() =>
	  Promise.resolve({
		json: () =>
		  Promise.resolve([
			{
			  author_id: 10,
			  id: 2,
			  place_id: 1,
			  text: 'ad 1',
			  type_id: 1,
			},
			{
			  author_id: 10,
			  id: 3,
			  place_id: 1,
			  text: 'Ad 2 local',
			  type_id: 1,
			},
			{
			  author_id: 10,
			  id: 4,
			  place_id: 1,
			  text: 'ad 3',
			  type_id: 1,
			},
			{
			  author_id: 10,
			  id: 5,
			  place_id: 1,
			  text: 'ad 4',
			  type_id: 1,
			},
		  ]),
		status: 201,
	  })
	);
	global.fetch = mockFetch;
	const { getByTestId } = render(
	  <Router>
		<Home />
	  </Router>
	);
  
	expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:5000/advertisement', {
		"headers": {
			"Authorization": "Basic dXNlcjpwYXNzd29yZA==", 
			"Content-Type": "application/json"
		}
	})
  
	// await waitFor(() => {
	//   const ads = getByTestId('ads').querySelectorAll('.ad');
	//   expect(ads).toHaveLength(4);
	// });
  });