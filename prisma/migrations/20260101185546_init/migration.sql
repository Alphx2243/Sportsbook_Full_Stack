-- AlterTable
ALTER TABLE "Sport" ADD COLUMN     "maxCapacity" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
