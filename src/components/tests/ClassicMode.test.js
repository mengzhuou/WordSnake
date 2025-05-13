import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassicMode from '../WordSnake/ClassicMode';

jest.mock('../WordSnake/FuncProps', () => ({
    checkWordExist: jest.fn(() => Promise.resolve(true)),
    checkMissingWordExist: jest.fn(() => Promise.resolve(false)),
    getLetterFromPreviousWord: jest.fn(() => 'nextword'),
    updateWordCloud: jest.fn(() => Promise.resolve()),
    getRandomStart: jest.fn(() => Promise.resolve('a')),
}));

const mockNavigate = jest.fn();

jest.mock('../withFuncProps', () => ({
    withFuncProps: (Component) => (props) => <Component {...props} navigate={mockNavigate} />
}));

global.prompt = jest.fn(() => 'Tester');

describe('ClassicMode Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<ClassicMode />);
    });

    it('renders Classic Mode title', () => {
        expect(screen.getByText('Classic Mode')).toBeInTheDocument();
    });

    it('starts the game and shows Confirm button', async () => {
        fireEvent.click(screen.getByText('Start Game'));
        await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument());
    });

    it('rejects word starting with hyphen', () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "-start" } });
        expect(screen.getByText(/apostrophes and\/or hyphens/i)).toBeInTheDocument();
    });

    it('rejects invalid single letter', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "x" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: "Enter", code: "Enter" });
        await waitFor(() => expect(screen.getByText(/does not form a word/i)).toBeInTheDocument());
    });

    it('accepts valid input and updates word list', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "apple" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/does not exist/i)).not.toBeInTheDocument();
        });
    });

    it('reject empty input', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "apple" } });
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/does not exist/i)).not.toBeInTheDocument();
        });
    });

    it('reject input ending with `\` or `-`', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "apple`\`" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/The word already exist. Please type another word./i)).toBeInTheDocument();
        });
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "test-" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/The word already exist. Please type another word./i)).not.toBeInTheDocument();
        });
    });

    it('shows nothing if keydown is not Enter', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Escape', code: 'Escape' });

        expect(screen.queryByText(/astWord is undefined or empty/i)).not.toBeInTheDocument();
    });
    
    it('reject input with length less or equal to 1', async () => {
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "a" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/This single letter does not form a word/i)).not.toBeInTheDocument();
        });
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "i" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/This single letter does not form a word/i)).not.toBeInTheDocument();
        });
        fireEvent.change(screen.getByLabelText(/Enter a word/), { target: { value: "o" } });
        fireEvent.keyDown(screen.getByLabelText(/Enter a word/), { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(screen.queryByText(/This single letter does not form a word/i)).not.toBeInTheDocument();
        });
    });

    it('opens and closes Add A Word model', () => {
        fireEvent.click(screen.getByText('Add A Word'));
        expect(screen.getByText(/Submit/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('X'));
        expect(screen.queryByText(/Submit/i)).not.toBeInTheDocument();
    });

    it('navigates to menu on Menu click', () => {
        fireEvent.click(screen.getByText('Menu'));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});

describe('ClassicMode Restart Button', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock reload method
        delete (window).location;
        (window).location = { reload: jest.fn() };

        render(<ClassicMode />);
    });

    it('calls window.location.reload when Restart button is clicked', async () => {
        fireEvent.click(screen.getByText('Start Game'));

        const restartButton = screen.getByText('Restart');
        fireEvent.click(restartButton);

        expect(window.location.reload).toHaveBeenCalled();
    });
});
