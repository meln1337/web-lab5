import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Places from '../Places';

describe('Places component', () => {
//   test('displays loading message while fetching places', async () => {
//     jest.spyOn(global, 'fetch').mockResolvedValueOnce({
//       json: jest.fn(),
//     });
//     render(
//       <BrowserRouter>
//         <Places />
//       </BrowserRouter>
//     );
//     const loadingMessage = screen.getByText('Loading...');
//     expect(loadingMessage).toBeInTheDocument();
//     await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
//     expect(loadingMessage).not.toBeInTheDocument();
//   });

  test('displays list of places when fetched', async () => {
    const mockPlaces = [
      { id: 1, name: 'Kyiv' },
      { id: 2, name: 'Lviv' },
      { id: 3, name: 'Chernivtsi' },
      { id: 4, name: 'Kharkiv' }
    ];
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockPlaces),
    });
    render(
      <BrowserRouter>
        <Places />
      </BrowserRouter>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    const place1 = screen.getByText('Name: Kyiv');
    const place2 = screen.getByText('Name: Lviv');
    const place3 = screen.getByText('Name: Chernivtsi');
    const place4 = screen.getByText('Name: Kharkiv');
    expect(place1).toBeInTheDocument();
    expect(place2).toBeInTheDocument();
    expect(place3).toBeInTheDocument();
    expect(place4).toBeInTheDocument();
  });

//   test('navigates to Add Place page when Add place button is clicked', async () => {
//     const historyMock = { push: jest.fn() };
//     render(
//       <BrowserRouter>
//         <Places history={historyMock} />
//       </BrowserRouter>
//     );
//     const addPlaceButton = screen.getByRole('button', { name: 'Add place' });
//     userEvent.click(addPlaceButton);
//     expect(historyMock.push).toHaveBeenCalledWith('/add-place');
//   });
});
