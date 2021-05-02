import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../pages/context/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationTimeString } from '../../utils/convertDurationTimeString';
import { AiOutlineCloseCircle } from 'react-icons/ai';

export function Player(){
  const [progress, setProgress] = useState(0)
  const {
    episodeList,
    isSidebar,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    hasNext,
    hasPrevious,
    setPlayingState,
    playNext,
    playPrevious,
    toggleLoop,
    toggleShuffle,
    clearEpisodes
  } = usePlayer()
  const episode = episodeList[currentEpisodeIndex]
  const audioRef = useRef<HTMLAudioElement>(null)

  function setupPlayer(){
    audioRef.current.currentTime = 0

    // seta progress com tempo atual
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodesEnded(){
    if(hasNext){
      playNext()
    }else{
      clearEpisodes()
    }
  }

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  }, [isPlaying])
  return(
    <div className={ isSidebar ? styles.playerContainer  : styles.playerContainerOff }>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {// se estiver episodio faça o primeiro senao o segundo
        episode ? (
          <div className={ styles.enablePlayer }>
            <Image width={592} height={592} objectFit="cover" src={ episode.thumbnail}/>
            <strong>{ episode.title }</strong>
            <span>{ episode.members }</span>
          </div>
        ) : (
          <div className={ styles.emptyPlayer }>
            <strong>Selecione o podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={ !episode ? styles.empty : '' }>
        <div className={ styles.progress}>
          <span>{ convertDurationTimeString( progress) }</span>
          <div className={ styles.slider }>
            {
              episode ? (
                <Slider 
                max={episode.duration}
                value={ progress }
                onChange={ handleSeek }
                trackStyle={{ background: '#04d361'}}
                railStyle={{ background: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}/>
              ) : (
                <div className={ styles.emptySlider }/>
              )

            }
          </div>
          <span>{convertDurationTimeString(episode?.duration ?? 0)}</span> 
        </div>

        {
          episode && (
            <audio
            src={ episode.url } 
            ref={ audioRef }
            loop={ isLooping }
            onEnded={ handleEpisodesEnded }
            onPlay={()=> setPlayingState(true)}
            onPause={()=> setPlayingState(false)}
            onLoadedMetadata={setupPlayer}
            autoPlay
          />
          )
        }

        <div className={ styles.buttons }>
          <button type="button" 
          disabled={!episode || episodeList.length === 1}
          onClick={ toggleShuffle } 
          className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" 
            alt="Tocar anterior" 
            onClick={ playPrevious }/>
          </button>
          <button type="button" 
          className={ styles.playButton }
          disabled={!episode}
          onClick={ togglePlay }
           >

            {
              isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" 
            alt="Tocar Próximo"
            onClick={ playNext }/>
          </button>
          <button type="button" 
          disabled={!episode} 
          onClick={ toggleLoop } 
          className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
      
    </div>
  )
}