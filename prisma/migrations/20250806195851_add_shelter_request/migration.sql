-- DropIndex
DROP INDEX `ShelterRequest_email_key` ON `ShelterRequest`;

-- AlterTable
ALTER TABLE `ShelterRequest` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `contactPerson` VARCHAR(191) NULL,
    ADD COLUMN `documents` JSON NULL,
    ADD COLUMN `houseNumber` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL;
