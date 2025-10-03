// Step 11: Composant de notification pour les nouveaux commentaires via subscription

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription OnCommentAdded {
    commentAdded {
      comment {
        id
        text
        author {
          id
          name
        }
      }
      post {
        id
        title
      }
      action
    }
  }
`;

interface CommentAddedData {
  commentAdded: {
    comment: {
      id: string;
      text: string;
      author: {
        id: string;
        name: string;
      };
    };
    post: {
      id: string;
      title: string;
    };
    action: string;
  };
}

export default function CommentNotification() {
  const [notification, setNotification] = useState<{
    authorName: string;
    commentText: string;
    postTitle: string;
  } | null>(null);

  const { data } = useSubscription<CommentAddedData>(COMMENT_ADDED_SUBSCRIPTION);

  useEffect(() => {
    if (data?.commentAdded) {
      const { comment, post } = data.commentAdded;

      // Afficher la notification
      setNotification({
        authorName: comment.author.name,
        commentText: comment.text,
        postTitle: post.title,
      });

      // Cacher la notification après 5 secondes
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-2xl max-w-md border-2 border-purple-400">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              💬
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-sm">Nouveau commentaire</h4>
              <button
                onClick={() => setNotification(null)}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm mb-1">
              <span className="font-semibold">{notification.authorName}</span> a commenté sur{' '}
              <span className="font-semibold">"{notification.postTitle}"</span>
            </p>
            <p className="text-xs text-white/90 bg-white/10 p-2 rounded mt-2 italic">
              "{notification.commentText.length > 100
                ? notification.commentText.substring(0, 100) + '...'
                : notification.commentText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
