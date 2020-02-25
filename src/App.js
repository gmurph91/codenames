import React, {Component} from 'react';
import './App.css';
import Card from './components/card';
const axios = require('axios');
require('dotenv').config()

export default class App extends Component {
  state = {
    words: [],
    onlyWords: [],
    thirtyWords: [],
  }

  componentDidMount(){
    this.getWords()
  }

  
getWords = async () => {
  try {
    const response = await axios.get(`https://gregapis.herokuapp.com/codenames/words`);
    this.setState({
      words: await response.data,
    })
  } catch (err) {
    console.error(err);
  }
  this.getWord()
}

getWord = async () => {
  let words = this.state.words
  words.map((word, i) => {
      this.setState({ onlyWords: [...this.state.onlyWords, words[i].word]});
      return word
  })
  await (this.setState({}))
  for (let step = 0; step < 26; step++) {
    let onlyWords = this.state.onlyWords
  let word = onlyWords[Math.floor(Math.random() * onlyWords.length)]
  this.setState({ thirtyWords: [...this.state.thirtyWords, word]});
  const index = onlyWords.indexOf(word);
  if (index > -1) {
    onlyWords.splice(index, 1);
  }
  }
}

  render() {
    return (
      <div className="App">
          <div className="board">
            <div className="row">
            <Card word={this.state.thirtyWords[0]}/>
            <Card word={this.state.thirtyWords[1]}/>
            <Card word={this.state.thirtyWords[2]}/>
            <Card word={this.state.thirtyWords[3]}/>
            <Card word={this.state.thirtyWords[4]}/>
            </div>
            <div className="row">
            <Card word={this.state.thirtyWords[5]}/>
            <Card word={this.state.thirtyWords[6]}/>
            <Card word={this.state.thirtyWords[7]}/>
            <Card word={this.state.thirtyWords[8]}/>
            <Card word={this.state.thirtyWords[9]}/>
            </div>
            <div className="row">
            <Card word={this.state.thirtyWords[10]}/>
            <Card word={this.state.thirtyWords[11]}/>
            <Card word={this.state.thirtyWords[12]}/>
            <Card word={this.state.thirtyWords[13]}/>
            <Card word={this.state.thirtyWords[14]}/>
            </div>
            <div className="row">
            <Card word={this.state.thirtyWords[15]}/>
            <Card word={this.state.thirtyWords[16]}/>
            <Card word={this.state.thirtyWords[17]}/>
            <Card word={this.state.thirtyWords[18]}/>
            <Card word={this.state.thirtyWords[19]}/>
            </div>
            <div className="row">
            <Card word={this.state.thirtyWords[20]}/>
            <Card word={this.state.thirtyWords[21]}/>
            <Card word={this.state.thirtyWords[22]}/>
            <Card word={this.state.thirtyWords[23]}/>
            <Card word={this.state.thirtyWords[24]}/>
            </div>
          </div>
          <div className="chat"></div>
      </div>
)}}
