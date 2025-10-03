-- AlterTable
ALTER TABLE "User" ADD COLUMN     "commentNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "friendRequestNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "postNotifications" BOOLEAN NOT NULL DEFAULT true;
