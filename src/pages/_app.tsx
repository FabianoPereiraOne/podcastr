import { Header } from '../Components/Header';
import { Player } from '../Components/Player';

import styles from '../styles/app.module.scss';
import '../styles/globals.scss';
import { PlayerContextProvider } from './context/PlayerContext';

function MyApp({ Component, pageProps }) {
  return (
      <PlayerContextProvider>
        <div className={ styles.appContainer }>
          
          <main>
            <Header/>
            <Component {...pageProps} />
          </main>
          <Player/>

        </div>
    </PlayerContextProvider>
  )
}

export default MyApp
