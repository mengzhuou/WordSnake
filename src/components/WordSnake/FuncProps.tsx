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

const FuncProps: React.FC = () => {
  return (
    <>
    </>
  );
};

export default FuncProps;
