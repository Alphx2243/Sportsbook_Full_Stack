/*
  Warnings:

  - The `issuedEquipments` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalEquipments` column on the `Sport` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `equipmentsInUse` column on the `Sport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "issuedEquipments",
ADD COLUMN     "issuedEquipments" TEXT[];

-- AlterTable
ALTER TABLE "Sport" DROP COLUMN "totalEquipments",
ADD COLUMN     "totalEquipments" TEXT[],
DROP COLUMN "equipmentsInUse",
ADD COLUMN     "equipmentsInUse" TEXT[] DEFAULT ARRAY[]::TEXT[];
