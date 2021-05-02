import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';
import { VscThreeBars } from 'react-icons/vsc';
import { usePlayer } from '../../pages/context/PlayerContext';

export function Header(){
  const { toggleSidebar } = usePlayer()
  const currentDate = format(new Date(), 'EEEEEE d MMMM', {
    locale: ptBr
  })


  return(
    <header className={ styles.headerContainer }>
      <img src="/logo.svg" alt="Podcastr"/>
      
      <p>O melhor para você ouvir, sempre</p>

      <span>{ currentDate }</span>

      <button onClick={ toggleSidebar }><VscThreeBars className={ styles.bars }/></button>
    </header>

  )
}
