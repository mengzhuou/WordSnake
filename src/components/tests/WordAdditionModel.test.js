import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WordAdditionModel from '../Menu/WordAdditionModel';
import { checkMissingWordExist } from '../WordSnake/FuncProps';

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

    it('handles word request input and submission correctly', async () => {
        const messageTextarea = screen.getByPlaceholderText(/Type a word.../i);

        fireEvent.change(messageTextarea, { target: { value: 'nina', name: 'message' } });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Submit Successfully'));
        });        
    });

    it('handles existing word request input and submission failed', async () => {
        checkMissingWordExist.mockResolvedValueOnce(true);

        const messageTextarea = screen.getByPlaceholderText(/Type a word.../i);

        fireEvent.change(messageTextarea, { target: { value: 'kite', name: 'message' } });

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("You can't request for a word that exists in our dictionary."));
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