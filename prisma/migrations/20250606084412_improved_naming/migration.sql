/*
  Warnings:

  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTimeId` on the `idea` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `idea` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `price_range` table. All the data in the column will be lost.
  - You are about to drop the column `profileViews` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `user_idea_status` table. All the data in the column will be lost.
  - You are about to drop the `number_of_people` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[label]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `price_range` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isChallenge` to the `idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationType` to the `idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `price_range` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileViewCount` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideaStatus` to the `user_idea_status` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GroupSizeToIdea" DROP CONSTRAINT "_GroupSizeToIdea_A_fkey";

-- DropForeignKey
ALTER TABLE "idea" DROP CONSTRAINT "idea_estimatedTimeId_fkey";

-- DropIndex
DROP INDEX "category_name_key";

-- DropIndex
DROP INDEX "price_range_name_key";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "idea" DROP COLUMN "estimatedTimeId",
DROP COLUMN "location",
ADD COLUMN     "durationId" INTEGER,
ADD COLUMN     "isChallenge" BOOLEAN NOT NULL,
ADD COLUMN     "locationType" "LocationType" NOT NULL;

-- AlterTable
ALTER TABLE "price_range" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "profileViews",
ADD COLUMN     "profileViewCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_idea_status" DROP COLUMN "status",
ADD COLUMN     "ideaStatus" "IdeaStatus" NOT NULL;

-- DropTable
DROP TABLE "number_of_people";

-- CreateTable
CREATE TABLE "group_size" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "group_size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_size_label_key" ON "group_size"("label");

-- CreateIndex
CREATE UNIQUE INDEX "category_label_key" ON "category"("label");

-- CreateIndex
CREATE UNIQUE INDEX "price_range_label_key" ON "price_range"("label");

-- AddForeignKey
ALTER TABLE "idea" ADD CONSTRAINT "idea_durationId_fkey" FOREIGN KEY ("durationId") REFERENCES "duration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSizeToIdea" ADD CONSTRAINT "_GroupSizeToIdea_A_fkey" FOREIGN KEY ("A") REFERENCES "group_size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
