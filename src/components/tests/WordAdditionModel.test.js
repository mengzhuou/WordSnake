import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WordAdditionModel from '../Menu/WordAdditionModel';

global.alert = jest.fn();
console.error = jest.fn(); 

jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
    return {
        ...originalModule,
        addDoc: jest.fn(), // mock addDoc
    };
});

jest.mock('../WordSnake/FuncProps', () => ({
    checkWordExist: jest.fn(() => false),
    checkMissingWordExist: jest.fn(() => false),
}));
  
function WordAdditionModelWrapper() {
    const [message, setMessage] = React.useState('');
  
    return (
      <WordAdditionModel
        message={message}
        time={new Date()}
        onClose={jest.fn()}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={jest.fn()}
      />
    );
  }
  

describe('WordAdditionModel Component functional behavior', () => {

    beforeEach(() => {
        render(<WordAdditionModelWrapper />);
    });
    // beforeEach(() => {
    //     render(<WordAdditionModel message="" time={new Date()} onClose={jest.fn()} onChange={jest.fn()} onSubmit={jest.fn()} />);
    // });

    it('handles word request input and submission correctly', async () => {
        const messageTextarea = screen.getByPlaceholderText(/Type a word.../i);

        // Simulate user input
        fireEvent.change(messageTextarea, { target: { value: 'nina', name: 'message' } });

        // Submit form
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Submit Successfully'));
        });        
    });

    it('shows alert when message is missing', async () => {
        const messageTextarea = screen.getByPlaceholderText(/Type a word.../i);
    
        fireEvent.change(messageTextarea, { target: { value: null, name: 'message' } });
    
        fireEvent.click(screen.getByText('Submit'));
    
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("You can't submit an empty request. Please try again.");
        });
    });
});