/*
  Warnings:

  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFromUser` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `read`,
    DROP COLUMN `sender`,
    DROP COLUMN `text`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `isFromUser` BOOLEAN NOT NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;
