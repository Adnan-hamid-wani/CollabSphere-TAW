/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `StatusColumn` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StatusColumn_name_key" ON "StatusColumn"("name");
