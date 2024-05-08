import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';
import FooterNav from "./FooterNav";
import { withFuncProps } from "./withFuncProps";
import { collection, DocumentData, getDocs } from 'firebase/firestore';
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
      this.menuNav = this.menuNav.bind(this);
    }

    menuNav = () => {
      this.props.navigate("/")
    } 

    componentDidMount() {
      if (!this.state.initialDataLoaded) {
        this.loadInitialData();
        console.log("initialDataLoaded", this.state.initialDataLoaded)
      }
  }

  async loadInitialData() {
    try {
      const leaderboardCollection = collection(db, "WordCloud");
      const snapshot = await getDocs(leaderboardCollection);
      const wordList = snapshot.docs.map((doc) => doc.data());
      this.setState({ wordListAndOccurrence: wordList, isError: false, initialDataLoaded: true });
    } catch (error) {
      const errorMes = "Oops, something is wrong with the server. Please come back tomorrow!";
      this.setState({ dbErrorMessage: errorMes, isError: true });
    }
  }
  

  transformDataForWordCloud(wordList: DocumentData[]): { text: string; value: number }[] {
    return wordList.map((word) => ({
      text: word.Word,
      value: parseInt(word.Occurrence, 10) || 0,  // Parse as integer, default to 0 if parsing fails
    }));
  }
  

  render() {
    const { wordListAndOccurrence } = this.state ?? { wordListAndOccurrence: [] };
    console.log("initialDataLoaded", this.state.initialDataLoaded)

    const data = this.transformDataForWordCloud(wordListAndOccurrence);
    console.log("data", data);

    return (
      <div className="customWordCloud">
        <div className="topnav">
          <button className="topnavButton" onClick={this.menuNav}>Menu</button>
        </div>   
        <div>
          <WordCloud 
              data={data}
              font="Times"
              fontWeight="bold"
              fontSize={(word) => Math.max(1, (word.value * 5))}
              spiral="rectangular"
              rotate={(word) => word.value % 80}
              padding={2}
              random={Math.random}
            />
        </div>
        <FooterNav/>
      </div>
    );
  }
}

export default withFuncProps(WordCloudComponent);
