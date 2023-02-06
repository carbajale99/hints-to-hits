import * as React from 'react'
import wrongIcon from './assets/wrong.png'
import { motion } from 'framer-motion'
import { filterTrackName } from './songInfo'
import {GiInfo} from "react-icons/gi"
import './App.css'

/**
 * 
 * @param {object} props Component props 
 * @param {string} props.displayedAnswer The unfiltered track name to be displayed when the game is over 
 * @param {string} props.answer The filtered track name to be used to check if the players guess is right
 * @param {Array} props.finalHints The hints to be given to the player as they guess
 * @param {img} props.albumCover The album cover of the album the correct song is in
 * @returns {JSX.Element} The final application with all its components
 */
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
  const [infoActive, setInfoActive] = React.useState({active:true, initialized: false});
  const [gameStarted, setGameStarted] = React.useState("visible");


  /**
   * Sets the user guess in real time
   * @param {*} event the button clicks
   */
  const handleGuess = (event) =>{
    setUserGuess(event.target.value);
  };

  /**
   * Open and closes the info text
   */
  const handleInfoClick = () => {
    setInfoActive({active: !infoActive.active, initialized:true});
  };

  /**
   * Closes the info text and starts the game
   */
  const handleStartGame = () => {
    setInfoActive({active: false, initialized:true});
    setGameStarted('none');
  };
  
  /**
   * Submits the user guess to see if its correct, wrong and the current guess
   */
  const handleGuessClick = () => {

    console.log(filterTrackName(userGuess));

    //stores the current win status by checking the filtered guess with the answer
    var winStatus = (filterTrackName(userGuess) === props.answer ? true : null);

    //stores the current lose status by checking if the amount of guesses exceeds 4
    var loseStatus = (guessCount >= 4? false : null);

    //Checks whether the user has won or not and handles how to progress whether it has or not
    if(winStatus === true){
      //The player has won and the appropriate components have been set to show the winner result
      setGameOutcome('Winner!!!\nThe correct answer is');
      setButtonStatus(winStatus);
      setResultColor('#1DB954');
    }
    else{
      if (loseStatus === false){
        //The player has lost and the appropriate components have been set to show the loser result
        setGameOutcome('Damn:/ Super wrong.\nThe correct answer is')
        setButtonStatus(!loseStatus)
      }
      else{
        // The player has guessed wrong and visuals popped up to indicate being wrong
        setWrongLoad(false);

        setCount(guessCount+1);

        setListPadding(10);

        setTimeout(() =>{
          setWrongLoad(true);
        },1200);

        //this adds a hint after a set amount of time
        setTimeout(() =>{
          setCurrentHintList([...currentHintList, props.finalHints[guessCount]]);
        },1200);
      }
    }
  }
  
  return (
    <div className='app-container'>
      <InfoButton isActive={infoActive} handleClick={handleInfoClick} hasStarted={gameStarted} startGame={handleStartGame}/>
      <h1 className='main-title'>{title}</h1>
      <Guess songGuess={userGuess} onGuess={handleGuess} bStatus={buttonStatus} onGuessClick={handleGuessClick}count={guessCount}/>
      { buttonStatus ? (<GameOverPopUp aCover={props.albumCover}outcome={gameOutcome} unFiltered={props.displayedAnswer} answerColor={resultColor}/>) : (wrongLoad ? null : <WrongPopUp count={guessCount}/>) }
      <HintsList list={currentHintList} count={guessCount} liPadding={listPadding}/>
    </div>
  );
};

/**
 * 
 * @param {object} props Components props
 * @param {boolean} props.isActive The current status of the info text
 * @param {function} props.handleClick Handles activiting the info text by pressing the button
 * @param {string} props.hasStarted The current visibility of the stat button
 * @param {function} props Handles starting the game
 * @returns {JSX.Element} The info button that toggles the info text
 */
const InfoButton = (props) =>{
  return(
    <div className='info-container'> 
      <button className='info-button' onClick={props.handleClick}> <GiInfo size={25} /> </button>
      <InfoText active={props.isActive} startGame={props.startGame} hasStarted={props.hasStarted}/>
    </div>
  );
};

/**
 * 
 * @param {object} props Component props
 * @param {string} props.hasStarted string that indicates the visibility of the start button
 * @param {function} props.startGame Handles starting the game by removing the start button and closing the initial info text
 * @returns {JSX.Element} The start button
 */
const StartGameButton = (props) =>{
  return(
    <input id='s-button' type='button' style={{display: props.hasStarted}} onClick={props.startGame} value="Start Playing!"/>
  );
};

/**
 * 
 * @param {object} props Component props 
 * @param {object} props.active The current status of the info text, whether it has been initialized or not and wheter it is open or not 
 * @param {string} props.hasStarted string that indicates the visibility of the start button
 * @param {function} props.startGame Handles starting the game by removing the start button and closing the initial info text
 * @returns {JSX.Element} The text box that has info about the game and its properties
 */
const InfoText = (props) => {

  var scaling = props.active.initialized ? (props.active.active ? {init: 0, anim: 1} : {init: 1, anim:0}) : {};
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
      <StartGameButton startGame={props.startGame} active={props.active} hasStarted={props.hasStarted}/>
    </motion.div>
  );
}

/**
 * 
 * @param {object} props Component props 
 * @param {function} props.onGuess Handles the change of the current guess
 * @param {boolean} props.bStatus The current status of the guess button
 * @param {boolean} props.onGuessClick Handles the player guess
 * @returns {JSX.Element} The component that contains where the player inputs their guess
 */
const Guess = (props) =>{
  return(
    <div className='guess-container'>
      <input id='guess-input' type="text" onChange={props.onGuess}/>
      <input id='s-button' type='button' disabled={props.bStatus} onClick={props.onGuessClick} value="Submit Guess!"/>
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
  