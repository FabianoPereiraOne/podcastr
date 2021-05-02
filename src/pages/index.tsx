import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import { api } from '../services/axios';
import { usePlayer } from './context/PlayerContext';
import { convertDurationTimeString } from '../utils/convertDurationTimeString';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './home.module.scss'
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

type Episodio = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  url: string,
  duration: number,
  durationAsString: string,
}

type HomeProps = {
  lastEpisodes: Array<Episodio>
  allEpisodes: Array<Episodio>
}

export default function Home({ lastEpisodes, allEpisodes}: HomeProps) {
  const { playList } = usePlayer()
  const episodeList = [...lastEpisodes, ...allEpisodes]

  return (
    <div className={ styles.Homepage }>
      <Head>
        <title>Home | podcastr</title>
      </Head>
      <section className={ styles.lastEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {
            lastEpisodes.map((episode, index)=>{
              return (
                <li key={ episode.id }>
                  <Image  width={192}
                   height={192}
                  objectFit='cover'
                  className={ styles.thumb }
                  src={episode.thumbnail}
                  alt={ episode.title }/>

                  <div className={ styles.cardDetails }>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{ episode.title }</a>
                    </Link>
                    <p>{ episode.members }</p>
                    <span>{ episode.publishedAt}</span>
                    <span>{ episode.durationAsString }</span>
                  </div>

                  <button type="button" onClick={()=> playList(episodeList, index)}>
                    <img src="/play-green.svg" alt="Tocar podcast"/>
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className={ styles.allEpisodes }>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
              <thead>
                <tr>
                  <th></th>
                  <th>Podcast</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  allEpisodes.map((episode, index) => {
                    return(
                      <tr key={ episode.id }>
                        <td style={{width: 64}}><Image 
                        width={64} 
                        height={64} 
                        objectFit="cover" 
                        src={ episode.thumbnail }
                        alt={ episode.title }/></td>
                        <td>
                          <Link href={`/episodes/${episode.id}`}>
                              <a>{ episode.title }</a>
                          </Link>
                        </td>
                        <td>{ episode.members}</td>
                        <td style={{width: 100}}>{ episode.publishedAt }</td>
                        <td>{ episode.durationAsString }</td>
                        <td><button type="button" onClick={ ()=> playList(episodeList, (index+ lastEpisodes.length))}><img src="/play-green.svg" alt="Tocar episodio"/></button></td>
                      </tr>
                    )
                  })
                }
              </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
    const { data }  = await api.get("episodes",{
     params:{
        _limit: 12,
        _sort: "published_at",
        _order: "desc"
     }
    })

    const episodios = data.map((episodio)=>{
      return{
        id: episodio.id,
        title: episodio.title,
        members: episodio.members,
        publishedAt: format(parseISO(episodio.published_at), "d MMM yy", { locale: ptBR}),
        thumbnail: episodio.thumbnail,
        url: episodio.file.url,
        duration: episodio.file.duration,
        durationAsString: convertDurationTimeString(Number(episodio.file.duration))
      }
    })

    const lastEpisodes = episodios.slice(0,2)
    const allEpisodes = episodios.slice(2, episodios.length)

    return{ 
      props: {
        lastEpisodes,
        allEpisodes
      },
      revalidate: 60 * 60 * 8
    }

}
