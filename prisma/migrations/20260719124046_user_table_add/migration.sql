-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
