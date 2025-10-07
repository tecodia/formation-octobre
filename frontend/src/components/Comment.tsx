import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_LATEST_COMMENTS = gql`
    query GetLatestComments($limit: Int!) {
        latestComments(limit: $limit) {
            id
            text
        }
    }
`;

interface CommentData {
    latestComments: {
        id: string;
        text: string;
    }[];
}


export default function Comments() {

    const { loading, error, data } = useQuery<CommentData>(GET_LATEST_COMMENTS, {
        variables: {
            limit: 5
        }
    });

    if (loading) return <p className="text-center py-4">Chargement...</p>;
    if (error) return <p className="text-red-500 text-center py-4">Erreur: {error.message}</p>;

    if (!data?.latestComments || data.latestComments.length === 0) {
        return <p className="text-center py-4 text-gray-500">Aucun commentaire</p>;
    }

    return <div>
        {data.latestComments.map((comment) => (
            <div key={comment.id}>{comment.text}</div>
        ))}
    </div>;
}