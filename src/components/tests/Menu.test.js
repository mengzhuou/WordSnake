import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from '../Menu/Menu';

const mockNavigate = jest.fn();

// Mock withFuncProps to inject mock navigate
jest.mock('../withFuncProps', () => ({
    withFuncProps: (Component) => (props) => <Component {...props} navigate={mockNavigate} />
}));

describe('Menu Component', () => {
    beforeEach(() => {
        render(<Menu />);
    });

    it('renders Word Snake title', () => {
        expect(screen.getByText('Word Snake')).toBeInTheDocument();
    });

    it('renders all menu buttons', () => {
        expect(screen.getByText('Definition Mode')).toBeInTheDocument();
        expect(screen.getByText('Unlimited Mode')).toBeInTheDocument();
        expect(screen.getByText('Classic Mode')).toBeInTheDocument();
        expect(screen.getByText('Add A Word')).toBeInTheDocument();
        expect(screen.getByText('Word Cloud')).toBeInTheDocument();
        expect(screen.getByText('Feedback')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
    });

    it('navigates to Definition Mode when button is clicked', () => {
        fireEvent.click(screen.getByText('Definition Mode'));
        expect(mockNavigate).toHaveBeenCalledWith('/DefinitionMode');
    });

    it('navigates to Unlimited Mode when button is clicked', () => {
        fireEvent.click(screen.getByText('Unlimited Mode'));
        expect(mockNavigate).toHaveBeenCalledWith('/UnlimitedMode');
    });

    it('navigates to Classic Mode when button is clicked', () => {
        fireEvent.click(screen.getByText('Classic Mode'));
        expect(mockNavigate).toHaveBeenCalledWith('/ClassicMode');
    });

    it('navigates to Word Cloud when button is clicked', () => {
        fireEvent.click(screen.getByText('Word Cloud'));
        expect(mockNavigate).toHaveBeenCalledWith('/WordCloud');
    });

    it('opens and closes Word Addition modal', () => {
        fireEvent.click(screen.getByText('Add A Word'));
        expect(document.body).toHaveTextContent(/If the word does not exist in our dictionary/i);
        expect(document.body).toHaveTextContent(/Submit/i);
        expect(document.body).toHaveTextContent(/Cancel/i);
        // close sign 'X'
        expect(document.body).toHaveTextContent(/X/i);

        fireEvent.click(screen.getByText('Cancel')); 
        expect(document.body).not.toHaveTextContent(/If the word does not exist in our dictionary/i);
        expect(document.body).not.toHaveTextContent(/Submit/i);
        expect(document.body).not.toHaveTextContent(/Cancel/i);
    });

    it('opens and closes Feedback modal', () => {
        fireEvent.click(screen.getByText('Feedback'));
    
        expect(document.body).toHaveTextContent(/FEEDBACK/i);
        expect(document.body).toHaveTextContent(/Submit/i);
        expect(document.body).toHaveTextContent(/Cancel/i);
        expect(document.body).toHaveTextContent(/X/i);
    
        fireEvent.click(screen.getByText('Cancel'));
        expect(document.body).not.toHaveTextContent(/Submit/i);
        expect(document.body).not.toHaveTextContent(/Cancel/i);
    });
    

    it('opens and closes Help modal', () => {
        fireEvent.click(screen.getByText('Help'));
    
        expect(document.body).toHaveTextContent(/Help/i);
        expect(document.body).toHaveTextContent(/X/i); 
        
        fireEvent.click(screen.getByText('X'));
        expect(document.body).not.toHaveTextContent(/X/i); 
    });
    
    
    it('renders footer text and link', () => {
        expect(document.body).not.toHaveTextContent(/Designed with ♥ by/i); 
        expect(screen.getByRole('link', { name: 'Mengzhu Ou' })).toHaveAttribute('href', 'https://mengzhuou.github.io/');
    });
});
