import { PostDataSource } from '../../datasources/PostDataSource';

const postDataSource = new PostDataSource();


const decodeCursor = (cursor: string) => {
    return Buffer.from(cursor, 'base64').toString('utf-8');
};

const encodeCursor = (cursor: string) => {
    return Buffer.from(cursor).toString('base64');
};


export const postPaginated = async (parent: any, args: { first: number, after: string}, context: any) => {
    const first = args.first;
    const after = args.after ? decodeCursor(args.after) : null;

    const result = await postDataSource.getPostPaginated(first, after);



    return {
        edges: result.slice(0, first).map((post: any) => ({
            cursor: encodeCursor(post.id),
            node: post
        })),
        pageInfo: {
            hasNextPage: result.length > first,
            endCursor: result.length > 0 ? encodeCursor(result[result.slice(0, first).length - 1].id) : null
        },
    }
};