import React, { useState, useEffect } from 'react';

type Props = {
  duration: number;
  wordLength: number;
  onTimeUp: () => void;
  isTimerUpdated: boolean;
};

const UnlimitedCountdownTimer: React.FC<Props> = ({ duration, wordLength, onTimeUp, isTimerUpdated }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [bonusValue, setBonusValue] = useState<number | null>(null);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft => timeLeft > 0 ? timeLeft - 1 : 0);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isTimerUpdated) {
      setTimeLeft((timeLeft) => {
        setIsMessageVisible(true);
        if (timeLeft !== undefined) {
          let bonus: number = 0;
          if (wordLength >= 0 && wordLength <= 5) {
            bonus = 3;
          } else if (wordLength >= 6 && wordLength <= 10) {
            bonus = 6;
          } else if (wordLength > 10 && wordLength <= 20) {
            bonus = 15;
          } else if (wordLength > 20) {
            bonus = 30;
          }

          setBonusValue(bonus); // Set the bonus value in the state
          return timeLeft + bonus;
        }
        return timeLeft;
      });
      setTimeout(() => {
        setIsMessageVisible(false);
        setBonusValue(null); // Reset bonus value after hiding the message
      }, 1500);
    }
  }, [isTimerUpdated, wordLength]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}: ${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='countdownTimer'>
      {formatTime(timeLeft)}
      {isMessageVisible && <p className='bonusMessage'> +{bonusValue}</p>}
    </div>
  );
};

export default UnlimitedCountdownTimer;
