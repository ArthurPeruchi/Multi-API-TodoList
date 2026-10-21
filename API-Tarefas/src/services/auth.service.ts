import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("A variável JWT_SECRET não foi configurada.");
}

interface CadastroDados {
  nome: string;
  email: string;
  senha: string;
}

interface LoginDados {
  email: string;
  senha: string;
}

// Cadastra um novo usuário.
export async function cadastrarUsuario(dados: CadastroDados) {
  const nome = dados.nome.trim();
  const email = dados.email.trim().toLowerCase();

  if (!nome || !email || !dados.senha) {
    throw new Error("Nome, email e senha são obrigatórios.");
  }

  if (dados.senha.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("EMAIL_JA_CADASTRADO");
  }

  // Nunca armazenamos a senha original no banco.
  const senhaHash = await bcrypt.hash(dados.senha, 12);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });

  return usuario;
}

// Autentica um usuário e gera um JWT.
export async function autenticarUsuario(dados: LoginDados) {
  const email = dados.email.trim().toLowerCase();

  if (!email || !dados.senha) {
    throw new Error("Email e senha são obrigatórios.");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  // A mesma mensagem evita revelar se um email está cadastrado.
  if (!usuario) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  const senhaCorreta = await bcrypt.compare(
    dados.senha,
    usuario.senha,
  );

  if (!senhaCorreta) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  const token = jwt.sign(
    { sub: String(usuario.id) },
    JWT_SECRET!,
    { expiresIn: "1h" },
  );

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    token,
    tipo: "Bearer",
    expiresIn: 3600,
  };
}