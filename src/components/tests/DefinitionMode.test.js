import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DefinitionMode from '../WordDefinition/DefinitionMode';

jest.mock('../WordSnake/FuncProps', () => ({
    checkMissingWordExist: jest.fn(() => Promise.resolve(false)),
    missingWordDef: jest.fn(() => Promise.resolve('Mocked missing definition'))
}));

const mockNavigate = jest.fn();

jest.mock('../withFuncProps', () => ({
    withFuncProps: (Component) => (props) => <Component {...props} navigate={mockNavigate} />
}));

global.fetch = jest.fn();

describe('DefinitionMode Component functional behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<DefinitionMode />);
    });

    it('renders title and buttons correctly', () => {
        expect(screen.getByText('Word Definition')).toBeInTheDocument();
        expect(screen.getByText('Menu')).toBeInTheDocument();
        expect(screen.getByText('Add A Word')).toBeInTheDocument();
    });

    it('shows error for input starting with apostrophe or hyphen', () => {
        const input = screen.getByLabelText(/type a word/i);
        fireEvent.change(input, { target: { value: '-word' } });

        expect(screen.getByText(/apostrophes and\/or hyphens cannot be used in the beginning/i)).toBeInTheDocument();
    });

    it('shows error for input ending with apostrophe or hyphen on Enter', () => {
        const input = screen.getByLabelText(/type a word/i);
        fireEvent.change(input, { target: { value: 'word-' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(screen.getByText(/apostrophes and\/or hyphens cannot be used in the ending/i)).toBeInTheDocument();
    });

    it('shows error for special characters in input', () => {
        const input = screen.getByLabelText(/type a word/i);
        fireEvent.change(input, { target: { value: 'word!' } });

        expect(screen.getByText(/special character\(s\) or number\(s\) are not accepted/i)).toBeInTheDocument();
    });

    it('opens and closes Add A Word model', () => {
        fireEvent.click(screen.getByText('Add A Word'));
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('X'));
        expect(screen.queryByText('Submit')).toBeNull();
    });

    it('clicking Menu button navigates home', () => {
        fireEvent.click(screen.getByText('Menu'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
