import React, {Component} from 'react';
import './App.css';
import Card from './components/card';
import Pusher from 'pusher-js';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
const axios = require('axios');
require('dotenv').config()

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
    onlyWords: [],
    twentyFive: [],
    red: [],
    blue: [],
    black: "",
      text: '',
      username: '',
      chats: []
    };
  }


  componentDidMount() {
     this.getWords()
    // const username = window.prompt('Username: ', 'Anonymous');
    // this.setState({ username });
    const pusher = new Pusher('462207fd95a0750caf6c', {
      cluster: 'us3',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
    });
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    if (e.keyCode === 13) {
      const payload = {
        username: this.state.username,
        message: this.state.text
      };
      axios.post('http://localhost:5040/message', payload);
    } else {
      this.setState({ text: e.target.value });
    }
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
  this.setState({ twentyFive: [...this.state.twentyFive, word]});
  const index = onlyWords.indexOf(word);
  if (index > -1) {
    onlyWords.splice(index, 1);
  }
  }
  let twentyFive = this.state.twentyFive
  let copy = [...twentyFive];
  for (let step=0; step < 9; step++) {
  let red = copy[Math.floor(Math.random() * copy.length)]
  this.setState({ red: [...this.state.red, red]});
  const index = copy.indexOf(red);
  if (index > -1) {
    copy.splice(index, 1);
  }}
  for (let step=0; step < 8; step++) {
  let blue = copy[Math.floor(Math.random() * copy.length)]
  this.setState({ blue: [...this.state.blue, blue]});
  const index2 = copy.indexOf(blue);
  if (index2 > -1) {
    copy.splice(index2, 1);
  }}
  for (let step=0; step < 1; step++) {
    let black = copy[Math.floor(Math.random() * copy.length)]
    this.setState({ black: black});
    const index3 = copy.indexOf(black);
    if (index3 > -1) {
      copy.splice(index3, 1);
    }}
  console.log(this.state.blue)
  console.log(this.state.red)
  console.log(this.state.black)
}

revealCard = (event) => {
  let name = event.currentTarget.dataset.name
  let red = this.state.red
  let blue = this.state.blue
  let black = this.state.black
  if(red.includes(name)){
  document.getElementById(`${name}`).src='red.jpg'
  document.getElementById(`${name}`).nextSibling.classList.add("hide")
} else if(blue.includes(name)){
  document.getElementById(`${name}`).src='blue.jpg'
  document.getElementById(`${name}`).nextSibling.classList.add("hide")
} else if(black.includes(name)){
  document.getElementById(`${name}`).src='black.jpg'
  document.getElementById(`${name}`).nextSibling.classList.add("hide")
} else {
  document.getElementById(`${name}`).src='gray.jpg'
  document.getElementById(`${name}`).nextSibling.classList.add("hide")
}
}

  render() {
    return (
      <div className="App">
          <div className="board">
            <div className="row">
            <Card word={this.state.twentyFive[0]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[1]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[2]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[3]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[4]} selectHandler={this.revealCard}/>
            </div>
            <div className="row">
            <Card word={this.state.twentyFive[5]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[6]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[7]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[8]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[9]} selectHandler={this.revealCard}/>
            </div>
            <div className="row">
            <Card word={this.state.twentyFive[10]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[11]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[12]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[13]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[14]} selectHandler={this.revealCard}/>
            </div>
            <div className="row">
            <Card word={this.state.twentyFive[15]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[16]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[17]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[18]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[19]} selectHandler={this.revealCard}/>
            </div>
            <div className="row">
            <Card word={this.state.twentyFive[20]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[21]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[22]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[23]} selectHandler={this.revealCard}/>
            <Card word={this.state.twentyFive[24]} selectHandler={this.revealCard}/>
            </div>
            <div className="chat"><section>
              <ChatList chats={this.state.chats} />
              <ChatBox
                text={this.state.text}
                username={this.state.username}
                handleTextChange={this.handleTextChange}
              />
            </section></div>
          </div>
          
      </div>
)}}
