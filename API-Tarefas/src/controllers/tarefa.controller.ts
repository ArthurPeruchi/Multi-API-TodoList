import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registrarLog } from "../services/log.service";

function obterIdTarefa(valor: string | string[] | undefined): number | null {
    if (typeof valor !== "string") {
        return null;
    }

    const id = Number(valor);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

export async function criarTarefa(req: Request, res: Response): Promise<void> {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
        res.status(401).json({ mensagem: "Usuário não autenticado." });
        return;
    }

    const titulo = typeof req.body?.titulo === "string"
        ? req.body.titulo.trim()
        : "";

    if (!titulo) {
        res.status(400).json({
            mensagem: "O título da tarefa é obrigatório."
        });
        return;
    }

    const tarefa = await prisma.tarefa.create({
        data: {
            titulo,
            usuarioId
        }
    });

    await registrarLog({
        acao: "TAREFA_CRIADA",
        detalhe: `Tarefa criada com ID ${tarefa.id}`,
        usuario_id: usuarioId
    });

    res.status(201).json({
        mensagem: "Tarefa criada com sucesso.",
        tarefa
    });
}

export async function listarTarefas(req: Request, res: Response): Promise<void> {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
        res.status(401).json({ mensagem: "Usuário não autenticado." });
        return;
    }

    const tarefas = await prisma.tarefa.findMany({
        where: { usuarioId },
        orderBy: { id: "desc" }
    });

    res.status(200).json({ tarefas });
}

export async function editarTarefa(req: Request, res: Response): Promise<void> {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
        res.status(401).json({ mensagem: "Usuário não autenticado." });
        return;
    }

    const id = obterIdTarefa(req.params.id);

    if (id === null) {
        res.status(400).json({ mensagem: "ID de tarefa inválido." });
        return;
    }

    const titulo = typeof req.body?.titulo === "string"
        ? req.body.titulo.trim()
        : "";

    if (!titulo) {
        res.status(400).json({
            mensagem: "Informe um título válido para a tarefa."
        });
        return;
    }

    const resultado = await prisma.tarefa.updateMany({
        where: { id, usuarioId },
        data: { titulo }
    });

    if (resultado.count === 0) {
        res.status(404).json({ mensagem: "Tarefa não encontrada." });
        return;
    }

    const tarefaAtualizada = await prisma.tarefa.findFirst({
        where: { id, usuarioId }
    });

    await registrarLog({
        acao: "TAREFA_EDITADA",
        detalhe: `Título da tarefa ${id} atualizado para "${titulo}"`,
        usuario_id: usuarioId
    });

    res.status(200).json({
        mensagem: "Tarefa atualizada com sucesso.",
        tarefa: tarefaAtualizada
    });
}

export async function concluirTarefa(req: Request, res: Response): Promise<void> {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
        res.status(401).json({ mensagem: "Usuário não autenticado." });
        return;
    }

    const id = obterIdTarefa(req.params.id);

    if (id === null) {
        res.status(400).json({ mensagem: "ID de tarefa inválido." });
        return;
    }

    const resultado = await prisma.tarefa.updateMany({
        where: { id, usuarioId },
        data: { concluida: true }
    });

    if (resultado.count === 0) {
        res.status(404).json({ mensagem: "Tarefa não encontrada." });
        return;
    }

    const tarefaAtualizada = await prisma.tarefa.findFirst({
        where: { id, usuarioId }
    });

    await registrarLog({
        acao: "TAREFA_CONCLUIDA",
        detalhe: `Tarefa ${id} marcada como concluída`,
        usuario_id: usuarioId
    });

    res.status(200).json({
        mensagem: "Tarefa concluída com sucesso.",
        tarefa: tarefaAtualizada
    });
}

export async function excluirTarefa(req: Request, res: Response): Promise<void> {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
        res.status(401).json({ mensagem: "Usuário não autenticado." });
        return;
    }

    const id = obterIdTarefa(req.params.id);

    if (id === null) {
        res.status(400).json({ mensagem: "ID de tarefa inválido." });
        return;
    }

    const resultado = await prisma.tarefa.deleteMany({
        where: { id, usuarioId }
    });

    if (resultado.count === 0) {
        res.status(404).json({ mensagem: "Tarefa não encontrada." });
        return;
    }

    await registrarLog({
        acao: "TAREFA_EXCLUIDA",
        detalhe: `Tarefa ${id} excluída`,
        usuario_id: usuarioId
    });

    res.status(200).json({
        mensagem: "Tarefa excluída com sucesso."
    });
}