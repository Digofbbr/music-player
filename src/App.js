
import {useState, useRef} from "react";

// Add componentes
import Song from './components/Song';
import Player from './components/Player';
import Library from "./components/Library"
import Nav from "./components/Nav"
// import styles
import "./styles/app.scss";
// import data
import data from "./data";



function App() {
  
  
  // State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0
  });
  const [libraryStatus, setLibraryStatus] = useState(false);

   // UseRef
  const audioRef = useRef(null);

  // Hander
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // Calculo de porcentagem para animação
    const roundedCurrent = Math.round(current)
    const roundedDuration = Math.round(duration)
    const animationPercentage = Math.round((roundedCurrent / roundedDuration) * 100)

    setSongInfo({...setSongInfo, currentTime: current,duration: duration, animationPercentage: animationPercentage});
  }

  const songEndHandler = async () => {
    let currentIndex =  songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(songs[(currentIndex + 1) % songs.length])
    if (isPlaying) audioRef.current.play()
  }
  
  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}/>
      <Song currentSong={currentSong} />
      <Player 
        songInfo={songInfo}
        setSongInfo={setSongInfo} 
        audioRef={audioRef} 
        setIsPlaying={setIsPlaying} 
        currentSong={currentSong} 
        isPlaying={isPlaying}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library 
        isPlaying={isPlaying} 
        audioRef={audioRef} 
        songs={songs} 
        setCurrentSong={setCurrentSong} 
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio onLoadedMetadata={timeUpdateHandler}  onTimeUpdate={timeUpdateHandler} ref={audioRef} src={currentSong.audio} onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
