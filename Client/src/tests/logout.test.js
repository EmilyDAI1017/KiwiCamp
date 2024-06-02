import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logout from '../pages/logout'; 

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Logout', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    it('should perform logout operations and navigate to login page', () => {
        const mockSetIsLoggedIn = jest.fn();
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <Logout setIsLoggedIn={mockSetIsLoggedIn} />
            </MemoryRouter>
        );

        expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
