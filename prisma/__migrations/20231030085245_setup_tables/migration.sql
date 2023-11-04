-- CreateEnum
CREATE TYPE "FormAccessRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "FormDefinition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "actions" TEXT[],
    "source" TEXT NOT NULL DEFAULT '',
    "form_definition" JSON NOT NULL,
    "id_for_edit" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_for_view" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_for_extend" UUID NOT NULL DEFAULT gen_random_uuid(),
    "author_uid" TEXT DEFAULT auth.jwt()->>'sub',

    CONSTRAINT "FormDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormPermission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "form_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "FormAccessRole" NOT NULL,

    CONSTRAINT "FormPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_edit_key" ON "FormDefinition"("id_for_edit");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_view_key" ON "FormDefinition"("id_for_view");

-- CreateIndex
CREATE UNIQUE INDEX "FormDefinition_id_for_extend_key" ON "FormDefinition"("id_for_extend");

-- AddForeignKey
ALTER TABLE "FormPermission" ADD CONSTRAINT "FormPermission_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "FormDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
