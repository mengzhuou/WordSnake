import React from 'react';
import "./HintPopupProps.css";
import Draggable from 'react-draggable';

interface HintPopupProps {
  hint: [];
  onClose: () => void;
}

const HintPopup: React.FC<HintPopupProps> = ({ hint, onClose }) => {
  return (
    <Draggable>
      <div className="hint-popup">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="hint-content">
          {hint.map((item, index) => (
            <p className="hint-line" key={index}>{item}</p>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default HintPopup;
