import  { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
}


type PlayerProps = {
  episodeList: Array<Episode>,
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  isSidebar: boolean,
  hasNext: boolean,
  hasPrevious: boolean,
  play: (episode: Episode) => void,
  playList: (list: Array<Episode>, index: number) => void,
  setPlayingState: (state: boolean) => void,
  togglePlay: () => void,
  playNext: () => void,
  playPrevious: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  clearEpisodes: () => void,
  toggleSidebar: () => void,
}

type PlayerContextProviderProps = {
  children: ReactNode, // React node pode ser qualquer elemento
}

export const PlayerContext = createContext({} as PlayerProps)


export function PlayerContextProvider( { children } : PlayerContextProviderProps){
  const [ episodeList, setEpisodeList ]  = useState([])
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0) 
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ isLooping, setIsLooping ] = useState(false)
  const [ isShuffling, setIsShuffling ] = useState(false)
  const [ isSidebar, setIsSidebar ] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list, index){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function clearEpisodes(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function toggleSidebar(){
    setIsSidebar(!isSidebar)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext(){
    if(isShuffling){ // Se estar em modo shuffle
      const nextEpisodeRandom = Math.floor(Math.random()* episodeList.length)
      setCurrentEpisodeIndex(nextEpisodeRandom)
    }else if(hasNext){ // senao Passe para o proximo
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }


  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  return (
      <PlayerContext.Provider value={ { 
        episodeList, 
        currentEpisodeIndex,
        play,
        hasNext,
        hasPrevious,
        isPlaying,
        isSidebar,
        isLooping,
        isShuffling,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        togglePlay,
        toggleShuffle,
        toggleSidebar,
        clearEpisodes,
        setPlayingState} 
        }>
        { children }
      </PlayerContext.Provider>
  )
}

export const usePlayer = () =>{
  return(
    useContext(PlayerContext)
  )
}