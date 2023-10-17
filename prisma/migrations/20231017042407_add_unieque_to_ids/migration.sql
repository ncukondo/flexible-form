/*
  Warnings:

  - A unique constraint covering the columns `[id_for_edit]` on the table `FormDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_for_extention]` on the table `FormDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_for_view]` on the table `FormDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_edit_key" ON "FormDefinition"("id_for_edit");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_extention_key" ON "FormDefinition"("id_for_extention");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_view_key" ON "FormDefinition"("id_for_view");
