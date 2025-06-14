-- DropForeignKey
ALTER TABLE "category_to_idea" DROP CONSTRAINT "category_to_idea_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "group_size_to_idea" DROP CONSTRAINT "group_size_to_idea_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "user_idea_status" DROP CONSTRAINT "user_idea_status_ideaId_fkey";

-- AddForeignKey
ALTER TABLE "category_to_idea" ADD CONSTRAINT "category_to_idea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_size_to_idea" ADD CONSTRAINT "group_size_to_idea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_idea_status" ADD CONSTRAINT "user_idea_status_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
