-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormDefinition" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "edit_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "limited_edit_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "view_id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "authorId" INTEGER,

    CONSTRAINT "FormDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FormDefinition" ADD CONSTRAINT "FormDefinition_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
