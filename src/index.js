import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {getSongData, filterTrackName} from './songInfo'
import './index.css'

(async () => {
  const hints = await getSongData();
  const songAnswer = hints[0];
  const unFilteredAnswer = songAnswer.data + '\nby\n' + hints[4].data;
  songAnswer.data = filterTrackName(songAnswer.data);
  console.log(songAnswer.data);
  hints.shift();
  const songImage = hints[0];
  hints.shift();
  
  console.log(hints);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App displayedAnswer={unFilteredAnswer} answer={songAnswer.data} finalHints={hints} albumCover={songImage}/>
    </React.StrictMode>,
  )
})();

