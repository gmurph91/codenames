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
      chatID: "",
      welcome: true,
      winner: false,
      width: 0,
      height: 0,
      who: ["red","blue"],
      first: "",
      creator: "",
      turn: "",
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.startover2 = this.startover2.bind(this);
  }

  welcome = () => {
    if (this.state.welcome === true) {
      document.getElementById("board").classList.add("hide2")
      document.getElementById("chatbox").classList.add("hide2")
      document.getElementById("infobox").classList.add("hide2")
    } else {
      document.getElementById("welcome").classList.add("hide")
      document.getElementById("board").classList.remove("hide2")
      document.getElementById("chatbox").classList.remove("hide2")
      document.getElementById("infobox").classList.remove("hide2")
    }
  }


  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('scroll', this.handleScroll);
    this.handleResize()
    this.welcome()
  }

  componentDidUpdate(){
   this.checkWinner()
   this.handleResize()
   this.loading()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('scroll', this.handleScroll);
  }

  loading = () => {
    var element = document.getElementById("loadingIcon")
    if (this.state.loading) {
      element.classList.remove("hide")
      document.getElementById("board").classList.add("hide")
    document.getElementById("chatbox").classList.add("hide")
    document.getElementById("infobox").classList.add("hide")
    } else {
      element.classList.add("hide")
      document.getElementById("board").classList.remove("hide")
    document.getElementById("chatbox").classList.remove("hide")
    document.getElementById("infobox").classList.remove("hide")
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleResize = () => {
    let width = this.state.width
    let board = document.getElementById("board");
    let chat = document.getElementById("chatbox");
    let information = document.getElementById("infobox");
    let word = document.querySelectorAll(".word")
    if (width <=600){
      board.classList.add("full");
      chat.classList.add("relative");
       information.classList.add("relative");
      for (var i = 0; i < word.length; i++) {
        word[i].classList.add("smaller")
        word[i].classList.remove("small")
    }}
    if (width >600 && width <=750){
      board.classList.add("full");
      chat.classList.add("relative");
      information.classList.add("relative");
      for (var i2 = 0; i2 < word.length; i2++) {
        word[i2].classList.add("small")
        word[i2].classList.remove("smaller")
    }} 
    if (width >750 && width <= 1000) {
      board.classList.add("full");
      chat.classList.add("relative");
      information.classList.add("relative");
      for (var i3 = 0; i3 < word.length; i3++) {
        word[i3].classList.remove("small")
        word[i3].classList.remove("smaller")
    }} 
    else if (width>1000) { 
      board.classList.remove("full");
      chat.classList.remove("relative");
      information.classList.remove("relative");
      for (var i4 = 0; i4 < word.length; i4++) {
        word[i4].classList.remove("small")
        word[i4].classList.remove("smaller")
    }} 
  }

  getChat = async () => {
    if(this.state.chatID===""){
    var timestamp = new Date().valueOf();
    this.setState({
      chatID: timestamp,
    })}
    await this.setState({})
    const pusher = new Pusher('462207fd95a0750caf6c', {
      authEndpoint: 'https://gregapis.herokuapp.com/pusher/auth',
      cluster: 'us3',
      encrypted: true
    });
    const channel = pusher.subscribe(`private-${this.state.chatID}`);
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
        if ('flip' in data){
          let flip = data.flip.name
          this.revealCard2(flip)
        }
        if ('startover' in data){
          this.setState({loading:true})
          let cards = document.querySelectorAll(".thumbnail")
    for (var i = 0; i < cards.length; i++) {
      cards[i].src = 'card.jpg'
      cards[i].nextSibling.classList.remove("hide")
  }
          setTimeout(() => {
            this.startover2(data.startover)
          }, 5000);
        }
        if ('color' in data){
          if(data.color === "red"){
            let reduceOne = this.state.redCount - 1
            this.setState({
              redCount: reduceOne,
            })
          }
          if(data.color === "blue"){
            let reduceOne = this.state.blueCount - 1
            this.setState({
              blueCount: reduceOne,
            })
          }
        }
      var elem = document.getElementById('chat');
      elem.scrollTop = elem.scrollHeight;
    });
  }

  checkWinner = () => {
    if (this.state.blueCount === 0 && this.state.winner === false && this.state.codemaster=== true && this.state.team=== "blue"){
      this.setState({
        winner: true,
      })
      const payload = {
        username: "System",
        message: `Blue Wins!`,
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload);
    }
    if (this.state.redCount === 0 && this.state.winner === false&& this.state.codemaster=== true && this.state.team=== "red"){
      this.setState({
        winner: true,
      })
      const payload = {
        username: "System",
        message: `Red Wins!`,
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload);
    }
  }

  handleTextChange(e) {
    try {
      if (e.keyCode === 13) {
        const payload = {
          username: this.state.username,
          message: e.target.value,
          team: this.state.team,
          id: this.state.chatID
        };
        axios.post('https://gregapis.herokuapp.com/message', payload);
        e.currentTarget.value = "";
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }

  codemaster = () => {
    let redCount = this.state.red.length
    let blueCount = this.state.blue.length
    let red = this.state.red
    let blue = this.state.blue
    let black = this.state.black
    let twentyFive = this.state.twentyFive
    let copy = [...twentyFive]
    this.setState({
      redCount: redCount,
      blueCount: blueCount,
      copy: copy
    })
    if (redCount > blueCount){
      this.setState({
        turn: "Red's turn"
      })
    } else {this.setState({turn: "Blue's turn"})}
    let word = document.querySelectorAll(".word")
      for (var i = 0; i < word.length; i++) {
        word[i].classList.remove("codemasterRed")
        word[i].classList.remove("codemasterBlue")
        word[i].classList.remove("codemasterBlack")
    }
    if (this.state.codemaster === false){
      document.getElementById("player").classList.remove("hide")
      document.getElementById("codemaster").classList.add("hide")
    } else if (this.state.codemaster === true){
      document.getElementById("player").classList.add("hide")
      document.getElementById("codemaster").classList.remove("hide")
       red.map((word, i) => {
      document.getElementById(`${word}`).nextSibling.classList.add("codemasterRed")
      return word
    })
    blue.map((word, i) => {
      document.getElementById(`${word}`).nextSibling.classList.add("codemasterBlue")
      return word
    })
    document.getElementById(`${black}`).nextSibling.classList.add("codemasterBlack")
    }
    this.setState({
      loading: false,
    })
  }


  getWords = async () => {
    try {
      const response = await axios.get(`https://gregapis.herokuapp.com/codenames/words`);
      this.setState({
        words: await response.data,
      })
    } catch (err) {
      console.log(err);
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
    for (let step = 0; step < 1; step++) {
      let whoFirst = this.state.who
      let first = whoFirst[Math.floor(Math.random() * whoFirst.length)]
      this.setState({ first: first});
    }
    for (let step = 0; step < 25; step++) {
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
    if(this.state.first === "red"){
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
    }} else {
      for (let step = 0; step < 8; step++) {
        let red = copy[Math.floor(Math.random() * copy.length)]
        this.setState({ red: [...this.state.red, red] });
        const index = copy.indexOf(red);
        if (index > -1) {
          copy.splice(index, 1);
        }
      }
      for (let step = 0; step < 9; step++) {
        let blue = copy[Math.floor(Math.random() * copy.length)]
        this.setState({ blue: [...this.state.blue, blue] });
        const index2 = copy.indexOf(blue);
        if (index2 > -1) {
          copy.splice(index2, 1);
        }
    }}
    for (let step = 0; step < 1; step++) {
      let black = copy[Math.floor(Math.random() * copy.length)]
      this.setState({ black: black });
      const index3 = copy.indexOf(black);
      if (index3 > -1) {
        copy.splice(index3, 1);
      }
    }
    try {
      const apiCall = await axios.post('https://gregapis.herokuapp.com/codenames/newgame', {
      joinCode: this.state.joinCode,
      twentyFive: this.state.twentyFive,
      red: this.state.red,
      blue: this.state.blue,
      black: this.state.black,
      chatID: this.state.chatID
      })
      await apiCall
    } catch (err) {
      console.log(err)
  }
  this.codemaster()
  }

  revealCard = (event) => {
    try{
    let name = event.currentTarget.dataset.name
    let master = this.state.codemaster
    let username = this.state.username
    let red = this.state.red
    let blue = this.state.blue
    let black = this.state.black
    let copy = this.state.copy
    if (red.includes(name) && copy.includes(name) && master === false) {
      document.getElementById(`${name}`).src = 'red.jpg'
      document.getElementById(`${name}`).classList.add("animation")
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload = {
        username: "System",
        message: `${username} clicked "${name}," which was Red`,
        flip: {name},
        color: "red",
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload);
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("red")
    } else if (blue.includes(name) && copy.includes(name) && master === false) {
      document.getElementById(`${name}`).src = 'blue.jpg'
      document.getElementById(`${name}`).classList.add("animation")
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload2 = {
        username: "System",
        message: `${username} clicked "${name}," which was Blue`,
        flip: {name},
        color: "blue",
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload2);
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("blue")
    } else if (black.includes(name) && copy.includes(name) && master === false) {
      document.getElementById(`${name}`).src = 'black.jpg'
      document.getElementById(`${name}`).classList.add("animation")
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload3 = {
        username: "System",
        message: `${username} clicked "${name}," which was Black.  Game Over!`,
        flip: {name},
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload3);
      this.setState({
        copy: [],
      })
    } else if(copy.includes(name) && master === false) {
      document.getElementById(`${name}`).src = 'gray.jpg'
      document.getElementById(`${name}`).classList.add("animation")
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const payload4 = {
        username: "System",
        message: `${username} clicked "${name}," which was an Innocent Bystander.`,
        flip: {name},
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload4);
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("end")
    }
  } catch(e){console.log(e)}}

  revealCard2 = (name) => {
    let red = this.state.red
    let blue = this.state.blue
    let black = this.state.black
    let copy = this.state.copy
    if (red.includes(name) && copy.includes(name)) {
      document.getElementById(`${name}`).src = 'red.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("red")
    } else if (blue.includes(name) && copy.includes(name)) {
      document.getElementById(`${name}`).src = 'blue.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("blue")
    } else if (black.includes(name) && copy.includes(name)) {
      document.getElementById(`${name}`).src = 'black.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      this.setState({
        copy: [],
      })
    } else if(copy.includes(name)) {
      document.getElementById(`${name}`).src = 'gray.jpg'
      document.getElementById(`${name}`).nextSibling.classList.add("hide")
      const index = copy.indexOf(name);
      if (index > -1) {
        copy.splice(index, 1);
      }
      this.turn("end")
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
    let username = this.state.username
    let joinCode = this.state.joinCode
    let team = this.state.team
    if(username === "" || joinCode === "" || team === ""){
      alert("Please fill out all fields")
    } else {
    this.getWords()
    this.setState({
      welcome: false,
      loading: true,
    })
    await this.setState({})
    this.welcome()
    this.getChat()
  }}

  joinGame = async () => {
    let username = this.state.username
    let joinCode = this.state.joinCode
    let team = this.state.team
    if(username === "" || joinCode === "" || team === ""){
      alert("Please fill out all fields")
    } else {
    try {
      const response = await axios.get(`https://gregapis.herokuapp.com/codenames/savedgame/${joinCode}`);
      await response
      if(response.data !== ""){
      this.setState({
        twentyFive: response.data.twentyFive,
        red: response.data.red,
        blue: response.data.blue,
        black: response.data.black,
        chatID: response.data.chatID,
        welcome: false,
        loading: true,
      })
      await this.setState({})
      this.welcome()
      this.codemaster()
      this.getChat()
      const payload = {
        username: "System",
        message: `${this.state.username} joined the game.`,
        id: this.state.chatID
      };
      axios.post('https://gregapis.herokuapp.com/message', payload);
    }
      else {alert("Unable to join game.  Check your join code and try again")}
    } catch (err) {
      console.log(err)
    }}
  }

  startover2 = async (joinCode) => {
    if(this.state.creator === joinCode){} else {
    this.setState({
      joinCode: joinCode,
    words: [],
    onlyWords: [],
    twentyFive: [],
    red: [],
    blue: [],
    black: "",
    winner: false,
    })
    await this.setState({})
      const response = await axios.get(`https://gregapis.herokuapp.com/codenames/savedgame/${joinCode}`);
      await response
      if(response.data !== ""){
      this.setState({
        twentyFive: response.data.twentyFive,
        red: response.data.red,
        blue: response.data.blue,
        black: response.data.black,
        chatID: response.data.chatID,
        welcome: false,
      })
      await this.setState({})
      this.codemaster()
    } else {
      setTimeout(() => {
        this.startover3(joinCode)
      }, 5000);
    }}
  }

  startover3 = async (joinCode) => {
    const response = await axios.get(`https://gregapis.herokuapp.com/codenames/savedgame/${joinCode}`);
      await response
      if(response.data !== ""){
      this.setState({
        twentyFive: response.data.twentyFive,
        red: response.data.red,
        blue: response.data.blue,
        black: response.data.black,
        chatID: response.data.chatID,
        welcome: false,
      })
      await this.setState({})
      this.codemaster()
  } else {console.log("Failed to join game.  Please refresh the page and join manually.")}}
  

  startOver = async () => {
    let timestamp = String(new Date().valueOf())
    let username = this.state.username
      this.setState({
        loading: true,
        joinCode: timestamp,
      words: [],
      onlyWords: [],
      twentyFive: [],
      red: [],
      blue: [],
      black: "",
      winner: false,
      first: "", 
      creator: timestamp,
      })
      await this.setState({})
    const payload = {
      username: "System",
      message: `${username} started a new game!`,
      startover: timestamp,
      id: this.state.chatID
    };
    axios.post('https://gregapis.herokuapp.com/message', payload);
    this.getWords()
  }

  copy = () => {
    this.copyTextToClipboard(`${this.state.joinCode}`);
  }

  copyTextToClipboard = (text) => {
    try{
    navigator.clipboard.writeText(text).then(function() {
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }catch(e){console.log(e)}}

  turn = (input) => {
    let turn = this.state.turn
    if (turn === "Red's turn" && input === "blue"){
      this.setState({
        turn: "Blue's turn"
      })
    } 
    if (turn === "Red's turn" && input === "end"){
      this.setState({
        turn: "Blue's turn"
      })
    } 
    if (turn === "Blue's turn" && input === "red"){
      this.setState({
        turn: "Red's turn"
      })
    } 
    if (turn === "Blue's turn" && input === "end"){
      this.setState({
        turn: "Red's turn"
      })
    } 
    else {}
  }


  render() {
    return (
      <div className="App" id="app">
        <div className="header">
          <p>Join Code: {this.state.joinCode}<img src="/copy.png" onClick={this.copy} alt="copy"/></p>
          <h2>Codenames</h2>
          <button onClick={this.startOver}>New Game</button>
        </div>
        <div className="board hide" id="board">
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
          <div className="chat hide" id="chatbox">
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
          <div className="information hide" id="infobox">
            <div id="codemaster" className="hide">
            <h2>{this.state.team} Codemaster</h2>
            <p>{this.state.turn}</p>
            <p>Red cards: {this.state.red[0]}, {this.state.red[1]}, {this.state.red[2]}, {this.state.red[3]}, {this.state.red[4]}, {this.state.red[5]}, {this.state.red[6]}, {this.state.red[7]}, {this.state.red[8]}</p>
            <p>Blue cards: {this.state.blue[0]}, {this.state.blue[1]}, {this.state.blue[2]}, {this.state.blue[3]}, {this.state.blue[4]}, {this.state.blue[5]}, {this.state.blue[6]}, {this.state.blue[7]}, {this.state.blue[8]}</p>
            <p>Assassin: {this.state.black}</p>
            </div>
            <div id="player" className="hide">
            <h2>{this.state.team} Team</h2>
            <p>{this.state.turn}</p>
            <p>Red remaining: {this.state.redCount}</p>
            <p>Blue remaining: {this.state.blueCount}</p>
            </div>
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
        <img id="loadingIcon" src="loading.gif" alt="loading" />
      </div>
    )
  }
}
