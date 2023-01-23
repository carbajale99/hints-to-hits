import * as React from 'react'
import wrongIcon from './assets/wrong.png'
import { delay, motion } from 'framer-motion'
import './App.css'

import {GiInfo} from "react-icons/gi"

const filterTrackName = (track) =>{
  track = track.split('(')[0];
  track = track.toLowerCase();
  track = track.replace(/\s+/g, "");
  track = track.replace(/[^a-zA-Z0-9]/g, '');
  return track;
};


const App = (props) =>{
  const title = 'Hints to Hits!!!';
  
  const [userGuess, setUserGuess] = React.useState('');
  const [guessCount, setCount] = React.useState(0);
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [wrongLoad, setWrongLoad] = React.useState(true);
  const [currentHintList, setCurrentHintList] = React.useState([]);
  const [listPadding, setListPadding] = React.useState(0);
  const [gameOutcome, setGameOutcome] = React.useState('');
  const [resultColor, setResultColor] = React.useState('#e24767');
  const [infoActive, setInfoActive] = React.useState({active: false, initialized: false});

  
  const handleGuess = (event) =>{
    setUserGuess(event.target.value);
  };

  const handleInfoClick = () => {
    setInfoActive({active: !infoActive.active, initialized: true});
  };
  
  const handleGuessClick = () => {

    console.log(filterTrackName(userGuess));
    var winStatus = (filterTrackName(userGuess) === props.answer ? true : null);
    var loseStatus = (guessCount >= 4? false : null);

    if(winStatus == true){
      setGameOutcome('Winner!!!\nThe correct answer is');
      setButtonStatus(winStatus);
      setResultColor('#1DB954');
    }
    else{
      if (loseStatus == false){
        setGameOutcome('Damn:/ Super wrong.\nThe correct answer is')
        setButtonStatus(!loseStatus)
      }
      else{
        setWrongLoad(false);

        setCount(guessCount+1);

        setListPadding(10);

        setTimeout(() =>{
          setWrongLoad(true);
        },1200);


        setTimeout(() =>{
          setCurrentHintList([...currentHintList, props.finalHints[guessCount]]);
        },1200);


      }
    }
  }
  
  
  return (
    <div className='app-container'>

      <InfoButton iActive={infoActive} handleClick={handleInfoClick}/>

      <h1 className='main-title'>{title}</h1>

      <Guess songGuess={userGuess} onGuess={handleGuess} bStatus={buttonStatus} onGuessClick={handleGuessClick}count={guessCount}/>
      { buttonStatus ? (<GameOverPopUp aCover={props.albumCover}outcome={gameOutcome} unFiltered={props.displayedAnswer} answerColor={resultColor}/>) : (wrongLoad ? null : <WrongPopUp count={guessCount}/>) }
      
      <HintsList list={currentHintList} count={guessCount} liPadding={listPadding}/>
    
    </div>

  );
};

const InfoButton = (props) =>{
  return(
    <div className='info-container'> 
      <button className='info-button' onClick={props.handleClick}> <GiInfo size={25} /> </button>
      <InfoText active={props.iActive}/>
    </div>
  );
};

const InfoText = (props) => {

  var scaling = {}
  props.active.initialized ? (props.active.active ? scaling = {init: 0, anim: 1}: scaling = {init: 1, anim:0 }) : scaling = {init: 0, anim: 0};

  return(
    <motion.div className='info-text-container'
    initial={{scale:scaling.init}}
    animate={{layout: true, scale:scaling.anim}}
    transition={{duration:.3}}
    style={{opacity:scaling.opacity}}
    >
      <p className='info-text'>
        Welcome to Hints to Hits. In this game, a random popular song will be chosen and it's your job to figure out what it is.
        Everytime you guess you will be given a new hint that will lead you closer to the answer. You get 5 tries before you lose.
      </p>

      <p>The hints are given in this order:</p>

      <ul style={{ listStyle: 'none', padding: 0}}>
        <li>Song Duration</li>
        <li>Year of Release</li>
        <li>Artist Name</li>
        <li>Album Name</li>
      </ul>

      <p>-------------------------------------</p>

      <p>
        This website was made using the Spotify API with client credentials
      </p>
    </motion.div>
  );
}

const Guess = (props) =>{

  
  return(
    <div className='guess-container'>

      <input id='guess-input' type="text" onChange={props.onGuess}/>
      
      <input id='submit-button' type='button' disabled={props.bStatus} onClick={props.onGuessClick}>Submit Guess!</input>


    </div>
  );
};

const HintsList = (props) => {

  const animations = {
    layout: true,
  }

  return (
    <motion.ul {...animations} className='hint-list'>
        {props.list.map((hint) =>(
          <motion.li 
            initial={{scale:.2}}
            animate={{layout: true, scale:1}}
            transition={{duration:.2, delay: .5}}
            style={{padding:props.liPadding}} id='hint' key={hint.id}>
            <span id='hint-data'>{hint.data}</span>
          </motion.li>
          ))}
    </motion.ul>
    );
}

const GameOverPopUp = (props) => {

  
  return(
      <motion.div
      initial= {{opacity:0, scale:0.5}}
      animate={{opacity:1, scale:1}} 
      transition={{duration: 1.2, delay: 0.5, ease:[0, .71, .2, 1.01]}}
      className='game-over'
      >
        <div className='outcome-text'>
            <span>{props.outcome.split('\n').map(str => <p style={{margin:'5px'}}>{str}</p>)}</span>
            <span id='answer' style={{margin:'10px', color:props.answerColor}}>{props.unFiltered}</span>
        </div>
        <img id={props.aCover.id} src={props.aCover.data.url} alt="gameOver" height={props.aCover.data.height} width={props.aCover.data.width}/>

      </motion.div>
  );
}

const WrongPopUp = (props) => {

  var wrongIcons = Array(props.count).fill(wrongIcon);

  return(
    <ul className='wrong-list'>

      {
        wrongIcons.map((icon) => (
          <li id='wrong-item'>
            <img src={icon} className='wrong-icon' alt="wrongIcon" height={100} width={100}/>
          </li>
        ))}
    </ul>
  );
}

export default App
  