import DataLoader from "dataloader";
import { prisma } from "../lib/prisma";

async function batchCommentsByPost(postIds: readonly string[]) {
    const comments = await prisma.comment.findMany({
        where: {
            postId: {
                in: postIds as string[],
            },
        },
    });

    return postIds.map((postId) => comments.filter((comment) => comment.postId === postId));

}

export function createCommentsByPostLoader() {
    return new DataLoader(batchCommentsByPost);
}