/*
  Warnings:

  - Added the required column `min` to the `duration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max` to the `group_size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min` to the `group_size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min` to the `price_range` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "duration" ADD COLUMN     "max" INTEGER,
ADD COLUMN     "min" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "group_size" ADD COLUMN     "max" INTEGER NOT NULL,
ADD COLUMN     "min" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "price_range" ADD COLUMN     "max" INTEGER,
ADD COLUMN     "min" INTEGER NOT NULL;
