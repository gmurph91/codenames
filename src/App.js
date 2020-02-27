import React, { Component } from 'react';
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
      username: "",
      team: "",
      joinCode: "",
      codemaster: false,
      words: [],
      onlyWords: [],
      twentyFive: [],
      red: [],
      blue: [],
      black: "",
      text: '',
      chats: [],
      welcome: true,
    };
  }

  welcome = () => {
    if (this.state.welcome === true) {
      document.getElementById("welcome")
    } else {
      document.getElementById("welcome").classList.add("hide")
    }
  }


  componentDidMount() {
    this.welcome()
    const pusher = new Pusher('462207fd95a0750caf6c', {
      cluster: 'us3',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
      
      // if(data.json.has("flip")){
      //   console.log("flip")
      // }
      // let flip = data.flip.name
      // this.revealCard2(flip)
      var elem = document.getElementById('chat');
      elem.scrollTop = elem.scrollHeight;
    });
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    try {
      if (e.keyCode === 13) {
        const payload = {
          username: this.state.username,
          message: this.state.text
        };
        axios.post('https://gregapis.herokuapp.com/message', payload);
        e.currentTarget.value = "";
      } else {
        this.setState({ text: e.target.value });
      }
    } catch (err) {
      console.error(err);
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
      this.setState({ onlyWords: [...this.state.onlyWords, words[i].word] });
      return word
    })
    await (this.setState({}))
    for (let step = 0; step < 26; step++) {
      let onlyWords = this.state.onlyWords
      let word = onlyWords[Math.floor(Math.random() * onlyWords.length)]
      this.setState({ twentyFive: [...this.state.twentyFive, word] });
      const index = onlyWords.indexOf(word);
      if (index > -1) {
        onlyWords.splice(index, 1);
      }
    }
    let twentyFive = this.state.twentyFive
    let copy = [...twentyFive];
    for (let step = 0; step < 9; step++) {
      let red = copy[Math.floor(Math.random() * copy.length)]
      this.setState({ red: [...this.state.red, red] });
      const index = copy.indexOf(red);
      if (index > -1) {
        copy.splice(index, 1);
      }
    }
    for (let step = 0; step < 8; step++) {
      let blue = copy[Math.floor(Math.random() * copy.length)]
      this.setState({ blue: [...this.state.blue, blue] });
      const index2 = copy.indexOf(blue);
      if (index2 > -1) {
        copy.splice(index2, 1);
      }
    }
    for (let step = 0; step < 1; step++) {
      let black = copy[Math.floor(Math.random() * copy.length)]
      this.setState({ black: black });
      const index3 = copy.indexOf(black);
      if (index3 > -1) {
        copy.splice(index3, 1);
      }
    }
    console.log(this.state.blue)
    console.log(this.state.red)
    console.log(this.state.black)
    try {
      const apiCall = await axios.post('https://gregapis.herokuapp.com/codenames/newgame', {
      joinCode: this.state.joinCode,
      twentyFive: this.state.twentyFive,
      red: this.state.red,
      blue: this.state.blue,
      black: this.state.black,
      })
      await apiCall
    } catch (err) {
      console.log(err)
  }
  console.log("game saved!")
  }

  revealCard = (event) => {
    let name = event.currentTarget.dataset.name
    let red = this.state.red
    let blue = this.state.blue
    let black = this.state.black
    if (red.includes(name)) {
      document.getElementById(`${name}`).src = 'red.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload = {
        username: "System",
        message: `Clicked card "${name}," which was Red`,
        flip: {name}
      };
      axios.post('https://gregapis.herokuapp.com/message', payload);
    } else if (blue.includes(name)) {
      document.getElementById(`${name}`).src = 'blue.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload2 = {
        username: "System",
        message: `Clicked card "${name}," which was Blue`,
        flip: {name}
      };
      axios.post('https://gregapis.herokuapp.com/message', payload2);
    } else if (black.includes(name)) {
      document.getElementById(`${name}`).src = 'black.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload3 = {
        username: "System",
        message: `Clicked card "${name}," which was Black.  Game Over!`,
        flip: {name}
      };
      axios.post('https://gregapis.herokuapp.com/message', payload3);
    } else {
      document.getElementById(`${name}`).src = 'gray.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload4 = {
        username: "System",
        message: `Clicked card "${name}," which was an Innocent Bystander.`,
        flip: {name}
      };
      axios.post('https://gregapis.herokuapp.com/message', payload4);
    }
  }

  revealCard2 = (name) => {
    let red = this.state.red
    let blue = this.state.blue
    let black = this.state.black
    if (red.includes(name)) {
      document.getElementById(`${name}`).src = 'red.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
    } else if (blue.includes(name)) {
      document.getElementById(`${name}`).src = 'blue.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
    } else if (black.includes(name)) {
      document.getElementById(`${name}`).src = 'black.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
    } else {
      document.getElementById(`${name}`).src = 'gray.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
    }
  }

  radioClick = (event) => {
    this.setState({
      team: event.target.value
    })
  }

  radioClick2 = (event) => {
    if(event.target.value==="yes")
    this.setState({
      codemaster: true,
    }) 
    if(event.target.value==="no")
    this.setState({
      codemaster: false,
    }) 
  }
  

  newGame = async () => {
    this.getWords()
    this.setState({
      welcome: false,
    })
    await this.setState({})
    this.welcome()
    
  }

  joinGame = async () => {
    let joinCode = this.state.joinCode
    try {
      const response = await axios.get(`https://gregapis.herokuapp.com/codenames/savedgame/${joinCode}`);
      await response
      this.setState({
        twentyFive: response.data.twentyFive,
        red: response.data.red,
        blue: response.data.blue,
        black: response.data.black
      })
      console.log(this.state)
    } catch (err) {
      console.error(err);
    }
    this.setState({
      welcome: false,
    })
    await this.setState({})
    this.welcome()
  }


  render() {
    return (
      <div className="App">
        <div className="board">
          <div className="row">
            <Card word={this.state.twentyFive[0]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[1]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[2]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[3]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[4]} selectHandler={this.revealCard} />
          </div>
          <div className="row">
            <Card word={this.state.twentyFive[5]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[6]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[7]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[8]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[9]} selectHandler={this.revealCard} />
          </div>
          <div className="row">
            <Card word={this.state.twentyFive[10]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[11]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[12]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[13]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[14]} selectHandler={this.revealCard} />
          </div>
          <div className="row">
            <Card word={this.state.twentyFive[15]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[16]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[17]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[18]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[19]} selectHandler={this.revealCard} />
          </div>
          <div className="row">
            <Card word={this.state.twentyFive[20]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[21]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[22]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[23]} selectHandler={this.revealCard} />
            <Card word={this.state.twentyFive[24]} selectHandler={this.revealCard} />
          </div>
          <div className="chat">
            <h2>Chat</h2>
            <div className="chatList" id="chat">
              <ChatList chats={this.state.chats} />
            </div>
            <div className="newChat">
              <ChatBox
                username={this.state.username}
                handleTextChange={this.handleTextChange}
              />
            </div>
          </div>
          <div className="information">
            <h2>hello</h2>
          </div>
        </div>
        <div id="welcome">
          <div>
            <h1 className="welcomeHeader">Welcome</h1>
            <form className="welcomeForm">
            <label htmlFor="username">Name:</label>
            <input id="username" type="text" value={this.state.username} onChange={(event)=>{
              this.setState({
                username: event.target.value
              })
            }}/>
            <label htmlFor="joinCode">Join Code:</label>
            <input id="joinCode" type="text" value={this.state.joinCode} onChange={(event)=>{
              this.setState({
                joinCode: event.target.value
              })
            }}/>
            <label htmlFor="team">Team:</label>
            <div className="group">
              <input type="radio" name="buttonGroup" value="red" id="red" onChange={this.radioClick}/><label className="radioButton" htmlFor="red">Red</label>
              <input type="radio" name="buttonGroup" value="blue" id="blue" onChange={this.radioClick}/><label className="radioButton" htmlFor="blue">Blue</label>
            </div>
              <label htmlFor="username">Codemaster:</label>
              <div className="group">
              <input type="radio" name="buttonGroup2" value="yes" id="yes" onChange={this.radioClick2}/><label className="radioButton" htmlFor="yes">Yes</label>
              <input type="radio" name="buttonGroup2" value="no" id="no" onChange={this.radioClick2}/><label className="radioButton" htmlFor="no">No</label>
              </div>
              <br/>
              <div className="group">
              <input type="button" className="welcomeButton" onClick={this.newGame} value="New" id="New"/>
              <input type="button" className="welcomeButton" onClick={this.joinGame} value="Join" id="Join"/>
              </div>
            </form>
            </div>
        </div>
      </div>
    )
  }
}
