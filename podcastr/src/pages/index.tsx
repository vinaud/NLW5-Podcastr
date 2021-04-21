import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import api from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTImeString';

type Episode = {

  id: String;
  title: String;
  thumbnail: String;
  description: String;
  members: String;
  duration: Number;
  durationAsString: String;
  url: String;
  publishedAt: String;


}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
    
  )
}


export const getStaticProps : GetStaticProps = async () =>{
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const data = response.data;

  const episodes = data.map( episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,

    };
  })

  return({
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  })
}