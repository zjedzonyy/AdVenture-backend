/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileViews` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('INDOOR', 'OUTDOOR', 'HYBRID', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'FAVORITED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profileViews" INTEGER NOT NULL;

-- DropTable
DROP TABLE "sessions";

-- CreateTable
CREATE TABLE "idea" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "completionCount" INTEGER NOT NULL,
    "estimatedTimeId" INTEGER,
    "priceRangeId" INTEGER NOT NULL,
    "location" "LocationType" NOT NULL,

    CONSTRAINT "idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "user_follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_idea_status" (
    "id" SERIAL NOT NULL,
    "status" "IdeaStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" INTEGER NOT NULL,

    CONSTRAINT "user_idea_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "ideaId" INTEGER NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "ideaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_range" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "price_range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "number_of_people" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "number_of_people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duration" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "_GroupSizeToIdea" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupSizeToIdea_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryToIdea" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToIdea_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_follow_followerId_followingId_key" ON "user_follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "user_idea_status_userId_ideaId_key" ON "user_idea_status"("userId", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "review_authorId_ideaId_key" ON "review"("authorId", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "price_range_name_key" ON "price_range"("name");

-- CreateIndex
CREATE UNIQUE INDEX "number_of_people_name_key" ON "number_of_people"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "duration_label_key" ON "duration"("label");

-- CreateIndex
CREATE INDEX "_GroupSizeToIdea_B_index" ON "_GroupSizeToIdea"("B");

-- CreateIndex
CREATE INDEX "_CategoryToIdea_B_index" ON "_CategoryToIdea"("B");

-- AddForeignKey
ALTER TABLE "idea" ADD CONSTRAINT "idea_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea" ADD CONSTRAINT "idea_estimatedTimeId_fkey" FOREIGN KEY ("estimatedTimeId") REFERENCES "duration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea" ADD CONSTRAINT "idea_priceRangeId_fkey" FOREIGN KEY ("priceRangeId") REFERENCES "price_range"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_idea_status" ADD CONSTRAINT "user_idea_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_idea_status" ADD CONSTRAINT "user_idea_status_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSizeToIdea" ADD CONSTRAINT "_GroupSizeToIdea_A_fkey" FOREIGN KEY ("A") REFERENCES "number_of_people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSizeToIdea" ADD CONSTRAINT "_GroupSizeToIdea_B_fkey" FOREIGN KEY ("B") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToIdea" ADD CONSTRAINT "_CategoryToIdea_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToIdea" ADD CONSTRAINT "_CategoryToIdea_B_fkey" FOREIGN KEY ("B") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
