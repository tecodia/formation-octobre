// Step 10: DataSource pour le Feed avec pagination cursor-based

import { Post } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface FeedPaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

interface FeedEdge {
  cursor: string;
  node: any;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface FeedConnection {
  edges: FeedEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export class FeedDataSource {
  // Helper pour encoder/décoder les cursors (base64)
  private encodeCursor(id: string): string {
    return Buffer.from(id).toString('base64');
  }

  private decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('utf-8');
  }

  async getFeedPaginated(args: FeedPaginationArgs): Promise<FeedConnection> {
    const { first, after, last, before } = args;

    // Validation des arguments
    if (first && last) {
      throw new Error('Vous ne pouvez pas utiliser first et last en même temps');
    }

    if (before && after) {
      throw new Error('Vous ne pouvez pas utiliser before et after en même temps');
    }

    // Par défaut, on prend les 10 premiers
    const limit = first || last || 10;
    const isForward = !!first || (!first && !last);

    // Construction du where clause pour le cursor
    let whereClause: any = {};

    if (after) {
      const decodedCursor = this.decodeCursor(after);
      const cursorPost = await prisma.Post.findUnique({
        where: { id: decodedCursor }
      });
      if (cursorPost) {
        whereClause = {
          createdAt: {
            lt: cursorPost.createdAt
          }
        };
      }
    }

    if (before) {
      const decodedCursor = this.decodeCursor(before);
      const cursorPost = await prisma.Post.findUnique({
        where: { id: decodedCursor }
      });
      if (cursorPost) {
        whereClause = {
          createdAt: {
            gt: cursorPost.createdAt
          }
        };
      }
    }

    // Récupération des posts avec un de plus pour savoir s'il y a une page suivante
    const posts = await prisma.Post.findMany({
      where: whereClause,
      take: limit + 1,
      orderBy: {
        createdAt: isForward ? 'desc' : 'asc'
      }
    });

    // Vérification s'il y a plus de résultats
    const hasMore = posts.length > limit;
    const nodes = hasMore ? posts.slice(0, limit) : posts;

    // Si on pagine en arrière, on inverse les résultats
    if (!isForward) {
      nodes.reverse();
    }

    // Récupération du total
    const totalCount = await prisma.Post.count();

    // Construction des edges avec transformation du contenu
    const edges = nodes.map((post: Post) => ({
      cursor: this.encodeCursor(post.id),
      node: this.transformPostToFeed(post)
    }));

    // Construction de pageInfo
    const pageInfo: PageInfo = {
      hasNextPage: isForward ? hasMore : false,
      hasPreviousPage: !isForward ? hasMore : false,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
    };

    // Si on utilise after, vérifier s'il y a des éléments avant
    if (after && isForward && nodes.length > 0) {
      const hasPrevious = await prisma.Post.count({
        where: {
          createdAt: {
            gt: nodes[0].createdAt
          }
        }
      });
      pageInfo.hasPreviousPage = hasPrevious > 0;
    }

    // Si on utilise before, vérifier s'il y a des éléments après
    if (before && !isForward && nodes.length > 0) {
      const hasNext = await prisma.Post.count({
        where: {
          createdAt: {
            lt: nodes[nodes.length - 1].createdAt
          }
        }
      });
      pageInfo.hasNextPage = hasNext > 0;
    }

    return {
      edges,
      pageInfo,
      totalCount
    };
  }

  private transformPostToFeed(post: Post) {
    return {
      id: post.id,
      content: {
        __typename: post.type || 'ArticlePost', // Default to ArticlePost si pas de type
        id: post.id,
        ...this.getContentFields(post)
      },
      authorId: post.authorId, // Juste l'ID, le resolver Feed se chargera de charger l'auteur
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  }

  private getContentFields(post: Post) {
    const metadata = post.metadata as any;

    switch (post.type) {
      case 'ArticlePost':
        return {
          title: post.title || 'Sans titre',
          content: post.content || ''
        };
      case 'VideoPost':
        return {
          title: post.title || 'Sans titre',
          videoUrl: metadata?.videoUrl || ''
        };
      case 'ImagePost':
        return {
          title: post.title || 'Sans titre',
          images: metadata?.images || []
        };
      case 'PollPost':
        return {
          question: post.title || 'Sondage sans question',
          options: metadata?.options || []
        };
      default:
        // Si pas de type, on considère que c'est un ArticlePost
        return {
          title: post.title || 'Sans titre',
          content: post.content || ''
        };
    }
  }
}