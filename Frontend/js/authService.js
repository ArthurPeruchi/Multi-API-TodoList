import { API_CONFIG } from "./api.js";

async function requisicaoAuth(endpoint, dados) {
    const response = await fetch(`${API_CONFIG.EXPRESS}/auth/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    if (!response.ok) {
        throw new Error(
            resultado.mensagem ||
            resultado.message ||
            resultado.erro ||
            "Não foi possível realizar a autenticação."
        );
    }

    return resultado;
}

export async function login(email, senha) {
    const resultado = await requisicaoAuth("login", {
        email,
        senha
    });

    const token = resultado.token ?? resultado.access_token;

    if (!token) {
        throw new Error("A API não retornou o token de autenticação.");
    }

    localStorage.setItem("token", token);

    return resultado;
}

export async function cadastrar(nome, email, senha) {
    return await requisicaoAuth("cadastro", {
        nome,
        email,
        senha
    });
}

export function logout() {
    localStorage.removeItem("token");
}