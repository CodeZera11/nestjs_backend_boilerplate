-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('ADMIN', 'CLIENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "UserRoleEnum" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
