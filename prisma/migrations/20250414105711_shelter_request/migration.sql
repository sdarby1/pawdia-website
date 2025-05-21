/*
  Warnings:

  - You are about to drop the column `address` on the `ShelterRequest` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ShelterRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ShelterRequest` DROP COLUMN `address`,
    DROP COLUMN `status`;
