
import { API_CONFIG } from "./api.js";

function obterToken() {
    return localStorage.getItem("token");
}

function obterCabecalhos() {
    const token = obterToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

async function requisicao(url, opcoes = {}) {
    const response = await fetch(url, {
        ...opcoes,
        headers: {
            ...obterCabecalhos(),
            ...opcoes.headers
        }
    });

    if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(
            `Erro HTTP ${response.status}: ${mensagem || response.statusText}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    const texto = await response.text();
    return texto ? JSON.parse(texto) : null;
}

export async function getTodos() {
    return await requisicao(`${API_CONFIG.EXPRESS}/tarefas`);
}

export async function createTodo(data) {
    return await requisicao(`${API_CONFIG.EXPRESS}/tarefas`, {
        method: "POST",
        body: JSON.stringify({
            titulo: data.title,
            descricao: data.description
        })
    });
}

export async function editTodo(id, titulo) {
    return await requisicao(`${API_CONFIG.EXPRESS}/tarefas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ titulo })
    });
}

export async function toggleTodo(id) {
    return await requisicao(
        `${API_CONFIG.EXPRESS}/tarefas/${id}/concluir`,
        {
            method: "PATCH"
        }
    );
}

export async function deleteTodo(id) {
    return await requisicao(
        `${API_CONFIG.EXPRESS}/tarefas/${id}`,
        {
            method: "DELETE"
        }
    );
}

export async function getStats() {
    return await requisicao(`${API_CONFIG.FASTAPI}/stats`);
}