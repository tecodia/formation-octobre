-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ARTICLE', 'VIDEO', 'POLL', 'IMAGE');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'ARTICLE';

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");
