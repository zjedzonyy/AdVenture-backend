-- AlterTable
ALTER TABLE "idea" ALTER COLUMN "viewCount" SET DEFAULT 0,
ALTER COLUMN "averageRating" SET DEFAULT 0,
ALTER COLUMN "completionCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "profileViewCount" SET DEFAULT 0;
