import { GetStaticPaths, GetStaticProps } from "next"
import { convertDurationTimeString } from "../../utils/convertDurationTimeString";
import { format, parseISO } from 'date-fns';
import { usePlayer } from "../../Components/context/PlayerContext";
import  Link  from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './slug.module.scss';
import Image from 'next/image';
import Head from 'next/head';
import firebase from '../../services/firebaseConection';

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  url: string,
  duration: number,
  durationAsString: string,
  description: []
}
type slugProps = {
  episode: Episode;
}

export default function Episodes({ episode }: slugProps){
  const { play } = usePlayer()

  return(
    <div className={ styles.episodeContainer }>
      <div className={ styles.episodeCenter }>
        <Head>
          <title>{ episode.title } | podcastr</title>
        </Head>
        <header className={ styles.banner }>
            <Link href="/">
              <button><img src="/arrow-left.svg" alt="Botão voltar"/></button>
            </Link>

            <Image width={700} height={150} src={ episode.thumbnail} objectFit="cover" />

            <button onClick={ () => play(episode)}><img src="/play-white.svg" alt="Tocar podcast"/></button>
        </header>
        <main className={styles.mainContainer}>
            <h1>{ episode.title }</h1>
            <span>{ episode.members }</span>
            <span>{ episode.publishedAt}</span>
            <span>{ episode.durationAsString}</span>
        </main>
        <section className={ styles.description}>
          {
            episode.description.map((textos)=>{
              return(
                <p key={ textos}>
                  { textos }
                </p>
              )
            })
          }
        </section>
      </div>
    </div>
  )
}


export const getStaticPaths: GetStaticPaths = async () =>{
  const data = []

  await firebase.database().ref("episodes").get()
  .then((e)=>{
      let allEpisodes = Object.values(e.val())

      allEpisodes.sort((a: any,b:any)=>{
        if(a.title > b.title){
          return -1
        }else{
          return 1
        }
      })

      for(let c = 0; c < 2; c++){
        data.push(allEpisodes[c])
      }
      
  })

    const paths = data.map((episode)=>{
      return {
        params: {
          slug: String(episode.id),
        }
      }
   })

  return{
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (contexto) =>{
  const { slug } = contexto.params


  const data = await firebase.database().ref("episodes").child(`${ slug }`).get()
  .then((e)=>{
      return e.val()
  })

  const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", { locale: ptBR}),
        thumbnail: data.thumbnail,
        description: Object.values(data.description),
        url: data.file.url,
        duration: data.file.duration,
        durationAsString: convertDurationTimeString(Number(data.file.duration))
  }

  return{
    props:{ episode },
    revalidate: 60 * 60 * 24 //24 horas
  }
}