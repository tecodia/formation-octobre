// Step 10: Composant Feed avec pagination cursor-based

import { useState, useEffect } from 'react';
import { gql  } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_FEED_PAGINATED = gql`
  query GetFeedPaginated($first: Int, $after: String) {
    feedPaginated(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          author {
            id
            name
          }
          content {
            __typename
            ... on ArticlePost {
              id
              title
              content
            }
            ... on VideoPost {
              id
              title
              videoUrl
            }
            ... on ImagePost {
              id
              title
              images {
                url
                caption
              }
            }
            ... on PollPost {
              id
              question
              options {
                text
                votes
              }
            }
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

interface FeedEdge {
  cursor: string;
  node: {
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
  };
}

interface FeedPaginatedData {
  feedPaginated: {
    edges: FeedEdge[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
    };
    totalCount: number;
  };
}

function renderContent(content: FeedEdge['node']['content']) {
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

export default function FeedPaginated() {
  const POSTS_PER_PAGE = 2; // Afficher 2 posts à la fois comme demandé
  const [allEdges, setAllEdges] = useState<FeedEdge[]>([]);

  const { loading, error, data, fetchMore } = useQuery<FeedPaginatedData>(
    GET_FEED_PAGINATED,
    {
      variables: { first: POSTS_PER_PAGE }
    }
  );

  // Utiliser useEffect pour initialiser les données
  useEffect(() => {
    if (data?.feedPaginated.edges && allEdges.length === 0) {
      console.log('data', data);
      setAllEdges(data.feedPaginated.edges);
    }
  }, [data, allEdges.length]);

  const handleLoadMore = () => {
    if (data?.feedPaginated.pageInfo.hasNextPage && data.feedPaginated.pageInfo.endCursor) {
      fetchMore({
        variables: {
          first: POSTS_PER_PAGE,
          after: data.feedPaginated.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          // Ajouter les nouveaux edges à notre state local
          setAllEdges([...allEdges, ...fetchMoreResult.feedPaginated.edges]);

          return {
            feedPaginated: {
              ...fetchMoreResult.feedPaginated,
              edges: [...prev.feedPaginated.edges, ...fetchMoreResult.feedPaginated.edges],
            },
          };
        },
      });
    }
  };

  if (loading && allEdges.length === 0) {
    return <p className="text-center py-4">Chargement...</p>;
  }

  if (error) {
    console.error('GraphQL Error:', error);
    return <p className="text-red-500 text-center py-4">Erreur: {error.message}</p>;
  }

  if (!data?.feedPaginated || allEdges.length === 0) {
    return <p className="text-center py-4 text-gray-500">Aucun contenu dans le feed</p>;
  }

  return (
    <div className="feed-paginated max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        Feed avec Pagination
        <span className="text-sm font-normal text-gray-400 ml-2">
          ({allEdges.length} / {data.feedPaginated.totalCount} posts)
        </span>
      </h2>

      <div className="space-y-4">
        {allEdges.map((edge) => (
          <div
            key={edge.cursor}
            className="feed-item bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="mb-4">
              {renderContent(edge.node.content)}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Par {edge.node.author.name}</span>
              <span>{new Date(edge.node.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        ))}
      </div>

      {data.feedPaginated.pageInfo.hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Chargement...' : 'Voir plus'}
          </button>
        </div>
      )}

      {!data.feedPaginated.pageInfo.hasNextPage && allEdges.length > 0 && (
        <p className="text-center text-gray-500 mt-6">
          ✨ Vous avez tout vu !
        </p>
      )}
    </div>
  );
}