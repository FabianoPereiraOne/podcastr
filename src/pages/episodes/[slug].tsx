import { GetStaticPaths, GetStaticProps } from "next"
import { api } from '../../services/axios';
import { convertDurationTimeString } from "../../utils/convertDurationTimeString";
import { format, parseISO } from 'date-fns';
import { usePlayer } from "../context/PlayerContext";
import  Link  from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './slug.module.scss';
import Image from 'next/image';
import Head from 'next/head';

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  url: string,
  duration: number,
  durationAsString: string,
  description: string
}
type slugProps = {
  episode: Episode;
}
export default function Episodes({ episode }: slugProps){
  const { play } = usePlayer()
  return(
    <div className={ styles.episodeContainer }>
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
        <p dangerouslySetInnerHTML={{__html: episode.description}} />
      </section>
    </div>
  )
}


export const getStaticPaths: GetStaticPaths = async () =>{
  const { data }  = await api.get("episodes",{
    params:{
       _limit: 2,
       _sort: "published_at",
       _order: "desc"
    }
   })

    const paths = data.map((episode)=>{
      return {
        params: {
          slug: episode.id,
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

  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", { locale: ptBR}),
        thumbnail: data.thumbnail,
        description: data.description,
        url: data.file.url,
        duration: data.file.duration,
        durationAsString: convertDurationTimeString(Number(data.file.duration))
  }

  return{
    props:{ episode },
    revalidate: 60 * 60 * 24 //24 horas
  }
}