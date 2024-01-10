import React, { Component } from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';

class WordCloudComponent extends Component {
  render() {
    const data = [
      { text: 'Nina', value: 2 },
      { text: 'Supercool', value: 29 },
      { text: 'first impression', value: 1 },
      { text: 'very cool', value: 10 },
      { text: 'duck', value: 10 },
    ];

    return (
      <WordCloud data={data} />
    );
  }
}

render(<WordCloudComponent />, document.getElementById('root'));

export default WordCloudComponent;
