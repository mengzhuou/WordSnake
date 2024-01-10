import React, { useState } from 'react';
import { collection, onSnapshot, DocumentData, addDoc, doc, getDoc, getDocs, updateDoc, query, where, limit  } from 'firebase/firestore';
import db from "./firebase";

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

export const updateWordCloud = async (word: string) => {
  const wordCloudRef = collection(db, "WordCloud");

  const q = query(wordCloudRef, where('Word', '==', word.toLowerCase()), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Document with the word already exists
    const docRef = doc(wordCloudRef, querySnapshot.docs[0].id);
    const currentOccurrence = querySnapshot.docs[0].data().Occurrence;
    // Update the occurrence value
    await updateDoc(docRef, {
      Occurrence: currentOccurrence + 1
    });
  } else {
    // Document with the word does not exist, add a new one
    const payload = { Word: word, Occurrence: 10000 };
    await addDoc(wordCloudRef, payload);
  }
}


const FuncProps: React.FC = () => {
  return (
    <>
    </>
  );
};

export default FuncProps;
