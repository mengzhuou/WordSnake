import React, { Component } from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import db from "./WordSnake/firebase";

interface WordCloudState {
  initialDataLoaded: boolean;
  wordListAndOccurrence: DocumentData[];
  dbErrorMessage: string;
  isError: boolean;
}

class WordCloudComponent extends Component<any, WordCloudState> {
    constructor(props: any) {
        super(props);
        this.state = {
            wordListAndOccurrence: [],
            initialDataLoaded: false,
            dbErrorMessage: "",
            isError: false,
        };
    }
    componentDidMount() {
        if (!this.state.initialDataLoaded) {
        this.loadInitialData();
    }

    onSnapshot(collection(db, "WordCloud"), (snapshot) => {
      const wordList = snapshot.docs
        .map((doc) => doc.data() as DocumentData);

      this.setState({ wordListAndOccurrence: wordList });
    });
  }

  async loadInitialData() {
    const leaderboardCollection = collection(db, "WordCloud");
    const unsubscribe = onSnapshot(
      leaderboardCollection,
      (snapshot) => {
        const wordList = snapshot.docs
          .map((doc) => doc.data() as DocumentData);

        this.setState({ wordListAndOccurrence: wordList, isError: false, initialDataLoaded: true });
      },
      (error) => {
        const errorMes = "Oops, something is wrong with the server. Please come back tomorrow!";
        this.setState({ dbErrorMessage: errorMes, isError: true });
      }
    );
  }

  transformDataForWordCloud(wordList: DocumentData[]): { text: string; value: number }[] {
    return wordList.map((word) => ({
      text: word.Word,
      value: parseInt(word.Occurrence, 10) || 0,  // Parse as integer, default to 0 if parsing fails
    }));
  }
  

  render() {
    const { wordListAndOccurrence } = this.state ?? { wordListAndOccurrence: [] };

    const data = this.transformDataForWordCloud(wordListAndOccurrence);
    console.log("data", data);

    return (
      <WordCloud data={data} />
    );
  }
}

export default WordCloudComponent;
