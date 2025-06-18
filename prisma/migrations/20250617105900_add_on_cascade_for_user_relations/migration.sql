-- DropForeignKey
ALTER TABLE "category_to_idea" DROP CONSTRAINT "category_to_idea_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "follow_request" DROP CONSTRAINT "follow_request_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "follow_request" DROP CONSTRAINT "follow_request_toUserId_fkey";

-- DropForeignKey
ALTER TABLE "group_size_to_idea" DROP CONSTRAINT "group_size_to_idea_groupSizeId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_authorId_fkey";

-- DropForeignKey
ALTER TABLE "user_follow" DROP CONSTRAINT "user_follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "user_follow" DROP CONSTRAINT "user_follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "user_idea_status" DROP CONSTRAINT "user_idea_status_userId_fkey";

-- AddForeignKey
ALTER TABLE "follow_request" ADD CONSTRAINT "follow_request_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_request" ADD CONSTRAINT "follow_request_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_to_idea" ADD CONSTRAINT "category_to_idea_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_size_to_idea" ADD CONSTRAINT "group_size_to_idea_groupSizeId_fkey" FOREIGN KEY ("groupSizeId") REFERENCES "group_size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_idea_status" ADD CONSTRAINT "user_idea_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
