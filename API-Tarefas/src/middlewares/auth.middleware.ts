
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { registrarLog } from "../services/log.service";

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
        }
    }
}

async function registrarAcessoNaoAutorizado(
    req: Request,
    motivo: string
): Promise<void> {
    await registrarLog({
        acao: "ACESSO_NAO_AUTORIZADO",
        detalhe: `${motivo} Método: ${req.method}; rota: ${req.path}`,
    });
}

export async function autenticarToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        await registrarAcessoNaoAutorizado(
            req,
            "Tentativa de acesso sem token de autenticação."
        );

        res.status(401).json({
            mensagem: "Token de autenticação não fornecido."
        });
        return;
    }

    const token = authorization.slice("Bearer ".length);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("JWT_SECRET não está configurado.");

        res.status(500).json({
            mensagem: "Erro interno de configuração do servidor."
        });
        return;
    }

    try {
        const payload = jwt.verify(token, secret);

        if (typeof payload === "string" || typeof payload.sub !== "string") {
            await registrarAcessoNaoAutorizado(
                req,
                "Tentativa de acesso com token inválido: payload inesperado."
            );

            res.status(401).json({
                mensagem: "Token inválido."
            });
            return;
        }

        const usuarioId = Number(payload.sub);

        if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
            await registrarAcessoNaoAutorizado(
                req,
                "Tentativa de acesso com token inválido: identificador de usuário incorreto."
            );

            res.status(401).json({
                mensagem: "Token inválido."
            });
            return;
        }

        req.usuarioId = usuarioId;

        next();
    } catch {
        await registrarAcessoNaoAutorizado(
            req,
            "Tentativa de acesso com token inválido ou expirado."
        );

        res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}