/*
  Warnings:

  - You are about to drop the `_CategoryToIdea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupSizeToIdea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToIdea" DROP CONSTRAINT "_CategoryToIdea_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToIdea" DROP CONSTRAINT "_CategoryToIdea_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupSizeToIdea" DROP CONSTRAINT "_GroupSizeToIdea_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupSizeToIdea" DROP CONSTRAINT "_GroupSizeToIdea_B_fkey";

-- DropTable
DROP TABLE "_CategoryToIdea";

-- DropTable
DROP TABLE "_GroupSizeToIdea";

-- CreateTable
CREATE TABLE "category_to_idea" (
    "ideaId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "category_to_idea_pkey" PRIMARY KEY ("ideaId","categoryId")
);

-- CreateTable
CREATE TABLE "group_size_to_idea" (
    "ideaId" INTEGER NOT NULL,
    "groupSizeId" INTEGER NOT NULL,

    CONSTRAINT "group_size_to_idea_pkey" PRIMARY KEY ("ideaId","groupSizeId")
);

-- AddForeignKey
ALTER TABLE "category_to_idea" ADD CONSTRAINT "category_to_idea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_to_idea" ADD CONSTRAINT "category_to_idea_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_size_to_idea" ADD CONSTRAINT "group_size_to_idea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_size_to_idea" ADD CONSTRAINT "group_size_to_idea_groupSizeId_fkey" FOREIGN KEY ("groupSizeId") REFERENCES "group_size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
