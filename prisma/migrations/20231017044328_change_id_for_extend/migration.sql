/*
  Warnings:

  - You are about to drop the column `id_for_extention` on the `FormDefinition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_for_extend]` on the table `FormDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FormDefinition_id_for_extention_key";

-- AlterTable
ALTER TABLE "FormDefinition" DROP COLUMN "id_for_extention",
ADD COLUMN     "id_for_extend" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_extend_key" ON "FormDefinition"("id_for_extend");
