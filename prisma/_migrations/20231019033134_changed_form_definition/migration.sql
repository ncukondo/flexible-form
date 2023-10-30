/*
  Warnings:

  - You are about to drop the `FormDefinition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."FormDefinition";

-- CreateTable
CREATE TABLE "FormDefinition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" JSON NOT NULL,
    "author_id" UUID,
    "id_for_edit" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_for_view" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_for_extend" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "FormDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_edit_key" ON "FormDefinition"("id_for_edit");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_view_key" ON "FormDefinition"("id_for_view");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_extend_key" ON "FormDefinition"("id_for_extend");
