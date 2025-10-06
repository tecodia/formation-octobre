import { createCommentsByPostLoader } from "./commentLoader";

export function createLoaders() {
    return {
        commentsByPostLoader: createCommentsByPostLoader(),
    };
}