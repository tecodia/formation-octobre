import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_FEED = gql`
fragment ArticleFields on ArticlePost {
  id
  title
  content
}
fragment VideoFields on VideoPost {
  id
  title
  videoUrl
}
fragment ImageFields on ImagePost {
  id
  title
  images {
    url
    caption
  }
}
fragment PollFields on PollPost {
  id
  question
  options {
    text
    votes
  }
}

  query GetFeed {
    feed {
      id
      author {
        id
        name
      }
      content {
        __typename
        ...ArticleFields
        ...VideoFields
        ...ImageFields
        ...PollFields
      }
      createdAt
      updatedAt
    }
  }
`;

interface FeedItem {
  id: string;
  author: {
    id: string;
    name: string;
  };
  content: {
    __typename?: string;
    id?: string;
    title?: string;
    content?: string;
    videoUrl?: string;
    images?: Array<{
      url: string;
      caption?: string;
    }>;
    question?: string;
    options?: Array<{
      text: string;
      votes: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

interface FeedData {
  feed: FeedItem[];
}

function renderContent(content: FeedItem['content']) {
  if (!content || !content.__typename) {
    return <p className="text-gray-500">Contenu non disponible</p>;
  }

  switch (content.__typename) {
    case 'ArticlePost':
      return (
        <div>
          <h3 className="font-bold text-lg mb-2">{content.title || 'Article sans titre'}</h3>
          <p className="text-gray-300">{content.content || 'Contenu non disponible'}</p>
        </div>
      );

    case 'VideoPost':
      return (
        <div>
          <h3 className="font-bold text-lg mb-2">{content.title || 'Vidéo sans titre'}</h3>
          {content.videoUrl ? (
            <a
              href={content.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              📹 Regarder la vidéo
            </a>
          ) : (
            <p className="text-gray-400">Lien vidéo non disponible</p>
          )}
        </div>
      );

    case 'ImagePost':
      return (
        <div>
          <h3 className="font-bold text-lg mb-2">{content.title || 'Image sans titre'}</h3>
          {content.images && content.images.length > 0 ? (
            content.images.map((image, index) => (
              <div key={index} className="mb-2">
                <img
                  src={image.url}
                  alt={image.caption || 'Image'}
                  className="max-w-full rounded"
                />
                {image.caption && <p className="text-sm text-gray-400 mt-1">{image.caption}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucune image disponible</p>
          )}
        </div>
      );

    case 'PollPost':
      return (
        <div>
          <h3 className="font-bold text-lg mb-2">{content.question || 'Sondage sans question'}</h3>
          {content.options && content.options.length > 0 ? (
            <div className="space-y-2">
              {content.options.map((option, index) => (
                <div key={index} className="flex justify-between bg-gray-700 p-2 rounded">
                  <span>{option.text}</span>
                  <span className="text-gray-400">{option.votes} votes</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune option disponible</p>
          )}
        </div>
      );

    default:
      return <p className="text-gray-500">Type de contenu inconnu: {content.__typename}</p>;
  }
}

export default function Feed() {
  const { loading, error, data } = useQuery<FeedData>(GET_FEED);

  // Debug logging
  console.log('Feed Query State:', { loading, error, data });

  if (loading) return <p className="text-center py-4">Chargement...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p className="text-red-500 text-center py-4">Erreur: {error.message}</p>;
  }

  if (!data?.feed || data.feed.length === 0) {
    console.log('No data in feed:', data);
    return <p className="text-center py-4 text-gray-500">Aucun contenu dans le feed</p>;
  }

  console.log('Feed data:', data.feed);

  return (
    <div className="feed max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Feed</h2>
      <div className="space-y-4">
        {data.feed.map((item) => (
          <div key={item.id} className="link-card bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4">
              {renderContent(item.content)}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Par {item.author.name}</span>
              <span>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}