import { Request, Response } from "express";
import {cadastrarUsuario, autenticarUsuario } from "../services/auth.service";

function responderErro(res: Response, erro: unknown) {
  const mensagem =
    erro instanceof Error ? erro.message : "Erro interno.";

  if (mensagem === "EMAIL_JA_CADASTRADO") {
    return res.status(409).json({
      erro: "Este email já está cadastrado.",
    });
  }

  if (mensagem === "CREDENCIAIS_INVALIDAS") {
    return res.status(401).json({
      erro: "Email ou senha inválidos.",
    });
  }

  if (
    mensagem === "Nome, email e senha são obrigatórios." ||
    mensagem === "Email e senha são obrigatórios." ||
    mensagem === "A senha deve ter pelo menos 8 caracteres."
  ) {
    return res.status(400).json({ erro: mensagem });
  }

  console.error("Erro na autenticação:", erro);

  return res.status(500).json({
    erro: "Ocorreu um erro interno.",
  });
}

export async function cadastro(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body ?? {};

    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string"
    ) {
      return res.status(400).json({
        erro: "Informe nome, email e senha como textos.",
      });
    }

    const usuario = await cadastrarUsuario({
      nome,
      email,
      senha,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario,
    });
  } catch (erro) {
    return responderErro(res, erro);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string"
    ) {
      return res.status(400).json({
        erro: "Informe email e senha como textos.",
      });
    }

    const resultado = await autenticarUsuario({
      email,
      senha,
    });

    return res.status(200).json(resultado);
  } catch (erro) {
    return responderErro(res, erro);
  }
}