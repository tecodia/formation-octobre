// Step 11: Page détail d'un post avec commentaires et mutation

import { useParams, useNavigate } from 'react-router-dom';
import { gql  } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useState, useEffect } from 'react';

const GET_POST_WITH_COMMENTS = gql`
  query GetPostWithComments($postId: ID!) {
    post(id: $postId) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
      comments {
        id
        text
        createdAt
        author {
          id
          name
        }
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($text: String!, $postId: ID!, $authorId: ID!) {
    createComment(text: $text, postId: $postId, authorId: $authorId) {
      id
      text
      createdAt
      author {
        id
        name
      }
    }
  }
`;

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  comments: Comment[];
}

interface PostData {
  post: Post;
}

interface User {
  id: string;
  name: string;
}

interface UsersData {
  users: User[];
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const { loading, error, data, refetch } = useQuery<PostData>(
    GET_POST_WITH_COMMENTS,
    {
      variables: { postId },
      skip: !postId,
    }
  );

  const { data: usersData } = useQuery<UsersData>(GET_USERS);

  // Définir le premier utilisateur par défaut quand les données sont chargées
  useEffect(() => {
    if (usersData?.users.length && !selectedUserId) {
      setSelectedUserId(usersData.users[0].id);
    }
  }, [usersData, selectedUserId]);

  const [createComment, { loading: createLoading }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setCommentText('');
      refetch(); // Recharger les commentaires
    },
    onError: (error) => {
      console.error('Erreur lors de la création du commentaire:', error);
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !postId) return;

    await createComment({
      variables: {
        text: commentText,
        postId,
        authorId: selectedUserId,
      },
    });
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Erreur: {error.message}
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="text-center py-8 text-gray-500">
        Post non trouvé
      </div>
    );
  }

  const { post } = data;

  return (
    <div className="post-detail max-w-4xl mx-auto p-4">
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2"
      >
        ← Retour au feed
      </button>

      {/* Contenu du post */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-4">
          <span>Par {post.author.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Section commentaires */}
      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4">
          Commentaires ({post.comments.length})
        </h2>

        {/* Liste des commentaires */}
        <div className="space-y-4 mb-8">
          {post.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
              >
                <p className="text-gray-300 mb-2">{comment.text}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="font-semibold">{comment.author.name}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulaire d'ajout de commentaire */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Ajouter un commentaire</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm font-medium mb-2">
                Commenter en tant que:
              </label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {usersData?.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Votre commentaire:
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrivez votre commentaire ici..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                disabled={createLoading}
              />
            </div>

            <button
              type="submit"
              disabled={!commentText.trim() || createLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {createLoading ? 'Envoi...' : 'Publier le commentaire'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
