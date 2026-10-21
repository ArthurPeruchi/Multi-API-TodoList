import { NextFunction, Request, Response } from "express";
import { registrarLog } from "../services/log.service";

export async function tratarErro(
    erro: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> {
    console.error("Erro inesperado na API:", erro);

    const detalheErro = erro instanceof Error
        ? erro.message
        : "Erro desconhecido.";

    if (res.headersSent) {
        return;
    }

    await registrarLog({
        acao: "ERRO_SISTEMA",
        detalhe: `Erro inesperado. Método: ${req.method}; rota: ${req.originalUrl}; detalhe: ${detalheErro}`,
        ...(req.usuarioId !== undefined
            ? { usuario_id: req.usuarioId }
            : {})
    });

    res.status(500).json({
        mensagem: "Ocorreu um erro interno no servidor."
    });
}
