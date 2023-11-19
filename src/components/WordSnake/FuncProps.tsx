import React, { useState } from 'react';

interface Definition {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
}

export const getLetterFromPreviousWord = (previousWord: string): string => {
  // Assuming the previousWord is not an empty string
  return previousWord.slice(-1).toLowerCase();
};

export const getRandomStart = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
};

export const getHintWordAndDef = async (startLetter: string): Promise<Definition | null> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${startLetter}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hint word and definition');
    }

    const data: Definition[] = await response.json();
    if (data.length === 0 || !data[0].meanings) {
      return null;
    }

    // Return the first word and its definition as a hint
    return data[0];
  } catch (error) {
    console.error('Error fetching hint word and definition:', error);
    return null;
  }
};

const FuncProps: React.FC = () => {
  const [previousWord, setPreviousWord] = useState<string>('');
  const [startLetter, setStartLetter] = useState<string>('');

  const handleGetLetterClick = () => {
    const letter = getLetterFromPreviousWord(previousWord);
    alert(`Letter from previous word: ${letter}`);
  };

  const handleGetRandomStartClick = () => {
    const start = getRandomStart();
    alert(`Random start letter: ${start}`);
  };

  const handleGetHintClick = async () => {
    const hintData = await getHintWordAndDef(startLetter);
    if (hintData) {
      alert(`Hint Word: ${hintData.word}\nHint Definition: ${hintData.meanings[0].definitions[0].definition}`);
    } else {
      alert('Failed to fetch hint word and definition');
    }
  };

  return (
    <div>
      <button onClick={handleGetLetterClick}>Get Letter from Previous Word</button>
      <button onClick={handleGetRandomStartClick}>Get Random Start Letter</button>
      <button onClick={handleGetHintClick}>Get Hint Word and Definition</button>
    </div>
  );
};

export default FuncProps;
