import { render, screen, act } from '@testing-library/react';
import CountdownTimer from '../WordSnake/CountdownTimer';
import '@testing-library/jest-dom';

jest.useFakeTimers();

describe('CountdownTimer', () => {
    it('counts down each second and triggers onTimeUp at 0', () => {
        const onTimeUp = jest.fn();
        render(<CountdownTimer duration={3} onTimeUp={onTimeUp} />);

        expect(screen.getByText('00: 03')).toBeInTheDocument();

        act(() => {
        jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('00: 02')).toBeInTheDocument();

        act(() => {
        jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('00: 01')).toBeInTheDocument();

        act(() => {
        jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText('00: 00')).toBeInTheDocument();
        expect(onTimeUp).toHaveBeenCalledTimes(1);
    });

    it('does not decrement below 0 and still calls onTimeUp', () => {
        const onTimeUp = jest.fn();
        render(<CountdownTimer duration={0} onTimeUp={onTimeUp} />);
      
        expect(screen.getByText('00: 00')).toBeInTheDocument();
      
        act(() => {
          jest.advanceTimersByTime(1000); 
        });
      
        expect(screen.getByText('00: 00')).toBeInTheDocument();
        expect(onTimeUp).toHaveBeenCalledTimes(1);
    });
      
    it('cleans up interval on unmount', () => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        const { unmount } = render(<CountdownTimer duration={5} onTimeUp={() => {}} />);
        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});
