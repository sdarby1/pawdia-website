-- AlterTable
ALTER TABLE `Animal` ADD COLUMN `adoptionFee` DOUBLE NULL,
    ADD COLUMN `goodWithCats` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `goodWithChildren` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `goodWithDogs` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isForBeginners` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isForSeniors` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isNeutered` BOOLEAN NOT NULL DEFAULT false;
