/*
  Warnings:

  - You are about to drop the column `edit_id` on the `FormDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `limited_edit_id` on the `FormDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `view_id` on the `FormDefinition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormDefinition" DROP COLUMN "edit_id",
DROP COLUMN "limited_edit_id",
DROP COLUMN "view_id",
ADD COLUMN     "id_for_edit" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "id_for_extention" TEXT NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "id_for_view" TEXT NOT NULL DEFAULT gen_random_uuid();
