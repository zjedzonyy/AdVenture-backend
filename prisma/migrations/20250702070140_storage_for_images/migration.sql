/*
  Warnings:

  - Added the required column `detailedDescription` to the `idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "idea" ADD COLUMN     "detailedDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "idea_images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "ideaId" INTEGER NOT NULL,

    CONSTRAINT "idea_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "idea_images" ADD CONSTRAINT "idea_images_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
