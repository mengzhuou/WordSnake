import React, { useState, useEffect } from 'react';

type Props = {
  duration: number;
  onTimeUp: () => void;
  isTimerUpdated: boolean;
};

const UnlimitedCountdownTimer: React.FC<Props> = ({ duration, onTimeUp, isTimerUpdated }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
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
      setTimeLeft(timeLeft => {
        setIsMessageVisible(true);
        return timeLeft + 5;
      });
      setTimeout(() => {
        setIsMessageVisible(false);
      }, 1500);
    }
  }, [isTimerUpdated]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}: ${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='countdownTimer'>
      {formatTime(timeLeft)}
      {isMessageVisible && <p className='bonusMessage'> 5 seconds bonus are added </p>}

    </div>
  );
};

export default UnlimitedCountdownTimer;
