import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbackModel from '../Menu/FeedbackModel';
import { addDoc } from 'firebase/firestore';

global.alert = jest.fn();

jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
    return {
        ...originalModule,
        addDoc: jest.fn(), // mock addDoc
    };
});

console.error = jest.fn(); 

describe('FeedbackModel Component functional behavior', () => {
    beforeEach(() => {
        render(<FeedbackModel name="" email="" message="" time={new Date()} onClose={jest.fn()} onChange={jest.fn()} onSubmit={jest.fn()} />);
    });

    it('handles feedback input and submission correctly', async () => {
        const nameInput = screen.getByPlaceholderText(/Enter your name/i);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        const messageTextarea = screen.getByPlaceholderText(/Enter your feedback/i);

        // Simulate user input
        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(messageTextarea, { target: { value: 'Nice app!', name: 'message' } });

        // Submit form
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Submit Successfully'));
        });        
    });

    it('shows alert when name is missing', async () => {
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        const messageTextarea = screen.getByPlaceholderText(/Enter your feedback/i);
    
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(messageTextarea, { target: { value: 'Nice app!', name: 'message' } });
    
        fireEvent.click(screen.getByText('Submit'));
    
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Please fill out Name field.");
        });
    });

    it('shows alert when message is missing', async () => {
        const nameInput = screen.getByPlaceholderText(/Enter your name/i);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    
        fireEvent.change(nameInput, { target: { value: 'nina', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
    
        fireEvent.click(screen.getByText('Submit'));
    
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Please fill out Feedback field.");
        });
    });
    
    it('logs error when addDoc fails', async () => {
        addDoc.mockRejectedValueOnce(new Error('Simulated Firebase failure'));

        const nameInput = screen.getByPlaceholderText(/Enter your name/i);
        const emailInput = screen.getByPlaceholderText(/Enter your email/i);
        const messageTextarea = screen.getByPlaceholderText(/Enter your feedback/i);

        fireEvent.change(nameInput, { target: { value: 'Error Tester', name: 'name' } });
        fireEvent.change(emailInput, { target: { value: 'error@example.com', name: 'email' } });
        fireEvent.change(messageTextarea, { target: { value: 'Trigger error case', name: 'message' } });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                "Error submitting feedback: ",
                expect.any(Error)
            );
        });
    });
});