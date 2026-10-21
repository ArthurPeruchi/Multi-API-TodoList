-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "tarefas_usuarioId_idx" ON "tarefas"("usuarioId");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
