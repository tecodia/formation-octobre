import { useQuery, gql } from '@apollo/client';

const GET_FEED = gql`
  query GetFeed {
    feed {
      id
      description
      url
      postedBy {
        id
        name
      }
    }
  }
`;

interface Link {
  id: string;
  description: string;
  url: string;
  postedBy: {
    id: string;
    name: string;
  } | null;
}

interface FeedData {
  feed: Link[];
}

export default function Feed() {
  const { loading, error, data } = useQuery<FeedData>(GET_FEED);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="feed">
      <h2>Feed</h2>
      {data?.feed.map((link) => (
        <div key={link.id} className="link-card">
          <div className="link-description">{link.description}</div>
          <div className="link-url">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url}
            </a>
          </div>
          {link.postedBy && (
            <div className="link-author">Posted by: {link.postedBy.name}</div>
          )}
        </div>
      ))}
    </div>
  );
}
