/*
  Warnings:

  - You are about to drop the column `address` on the `Shelter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Shelter` DROP COLUMN `address`,
    ADD COLUMN `houseNumber` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OpeningHour` (
    `id` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `fromTime` VARCHAR(191) NOT NULL,
    `toTime` VARCHAR(191) NOT NULL,
    `shelterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OpeningHour` ADD CONSTRAINT `OpeningHour_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `Shelter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
