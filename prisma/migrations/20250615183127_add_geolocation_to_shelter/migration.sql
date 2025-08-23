-- AlterTable
ALTER TABLE `Shelter` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL;
