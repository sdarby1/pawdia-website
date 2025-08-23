/*
  Warnings:

  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Animal` DROP FOREIGN KEY `Animal_shelterId_fkey`;

-- DropForeignKey
ALTER TABLE `BlogBlock` DROP FOREIGN KEY `BlogBlock_blogPostId_fkey`;

-- DropForeignKey
ALTER TABLE `BlogPostCategory` DROP FOREIGN KEY `BlogPostCategory_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_shelterId_fkey`;

-- DropForeignKey
ALTER TABLE `OpeningHour` DROP FOREIGN KEY `OpeningHour_shelterId_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserFavorites` DROP FOREIGN KEY `_UserFavorites_B_fkey`;

-- DropIndex
DROP INDEX `Animal_shelterId_fkey` ON `Animal`;

-- DropIndex
DROP INDEX `OpeningHour_shelterId_fkey` ON `OpeningHour`;

-- DropTable
DROP TABLE `_UserFavorites`;

-- CreateTable
CREATE TABLE `UserFavorite` (
    `userId` VARCHAR(191) NOT NULL,
    `animalId` VARCHAR(191) NOT NULL,

    INDEX `UserFavorite_animalId_idx`(`animalId`),
    PRIMARY KEY (`userId`, `animalId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OpeningHour` ADD CONSTRAINT `OpeningHour_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `Shelter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `Shelter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavorite` ADD CONSTRAINT `UserFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFavorite` ADD CONSTRAINT `UserFavorite_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `Shelter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPostCategory` ADD CONSTRAINT `BlogPostCategory_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogBlock` ADD CONSTRAINT `BlogBlock_blogPostId_fkey` FOREIGN KEY (`blogPostId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `BlogBlock` RENAME INDEX `BlogBlock_blogPostId_fkey` TO `BlogBlock_blogPostId_idx`;

-- RenameIndex
ALTER TABLE `BlogPostCategory` RENAME INDEX `BlogPostCategory_postId_fkey` TO `BlogPostCategory_postId_idx`;

-- RenameIndex
ALTER TABLE `Chat` RENAME INDEX `Chat_animalId_fkey` TO `Chat_animalId_idx`;

-- RenameIndex
ALTER TABLE `Chat` RENAME INDEX `Chat_shelterId_fkey` TO `Chat_shelterId_idx`;

-- RenameIndex
ALTER TABLE `Chat` RENAME INDEX `Chat_userId_fkey` TO `Chat_userId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_chatId_fkey` TO `Message_chatId_idx`;
