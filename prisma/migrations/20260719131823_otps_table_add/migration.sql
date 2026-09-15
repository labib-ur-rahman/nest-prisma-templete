/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('ACCOUNT_VERIFY', 'PASSWORD_RESET');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OtpType" NOT NULL DEFAULT 'PASSWORD_RESET',
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
