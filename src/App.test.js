import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the components used in the routes
jest.mock('./components/Menu/Menu', () => () => <div>Menu Page</div>);
jest.mock('./components/WordSnake/ClassicMode', () => () => <div>Classic Mode</div>);
jest.mock('./components/WordSnake/UnlimitedMode', () => () => <div>Unlimited Mode</div>);
jest.mock('./components/WordSnake/CountdownTimer', () => () => <div>Countdown Timer</div>);
jest.mock('./components/WordSnake/UnlimitedCountdownTimer', () => () => <div>Unlimited Countdown Timer</div>);
jest.mock('./components/WordDefinition/DefinitionMode', () => () => <div>Definition Mode</div>);
jest.mock('./components/WordSnake/FuncProps', () => () => <div>Func Props</div>);
jest.mock('./components/NotFound', () => () => <div>404 Not Found</div>);
jest.mock('./components/WordCloud', () => () => <div>Word Cloud</div>);
jest.mock('./components/FooterNav', () => () => <div>Footer Nav</div>);

describe('App Routing', () => {
  it('renders Menu by default at "/"', () => {
    render(
        <App />
    );
    expect(screen.getByText('Menu Page')).toBeInTheDocument();
  });
});
