-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "follow_request" (
    "id" SERIAL NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "follow_request_fromUserId_toUserId_key" ON "follow_request"("fromUserId", "toUserId");

-- AddForeignKey
ALTER TABLE "follow_request" ADD CONSTRAINT "follow_request_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_request" ADD CONSTRAINT "follow_request_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
