import React, { useState } from 'react';
import { collection, addDoc, doc, getDocs, updateDoc, query, where, limit  } from 'firebase/firestore';
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
    const payload = { Word: word, Occurrence: 1 };
    await addDoc(wordCloudRef, payload);
  }
}

export const checkWordExist = async (word: string): Promise<boolean> => {
  try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      return response.ok;
  } catch (error) {
      console.error('Error checking word existence:', error);
      return false;
  }
};

export const checkMissingWordExist = async (word: string): Promise<boolean> => {
  const missingWords = ["kite", "fuck", "hell", "nigga"];
  const missingWordExists = missingWords.includes(word);
  return missingWordExists;
}

export const missingWordDef = (word: string): string => {
  const missingWords: { [key: string]: string } = {
    "kite": "a toy consisting of a light frame with thin material stretched over it, flown in the wind at the end of a long string",
    "fuck": "have sex with (someone). ruin or damage (something).",
    "hell": "a place regarded in various religions as a spiritual realm of evil and suffering, often traditionally depicted as a place of perpetual fire beneath the earth where the wicked are punished after death. irreligious children were assumed to have passed straight to the eternal fires of hell",
    "nigga": "OFFENSIVE. Respelling of nigger (typically representing African American speech)."
  };

  const wordDef = missingWords[word];
  return wordDef || "Definition not available";
}



const FuncProps: React.FC = () => {
  return (
    <>
    </>
  );
};

export default FuncProps;
